# Setup -------------------------------------------------------------------

library(tidyverse)
library(googlesheets4)
library(yaml)
library(btw)

btw_mcp_session()

# Validation functions ----------------------------------------------------

check_duplicates <- function(data, ..., na.rm = FALSE) {
  if (na.rm) {
    data <- filter(data, !if_any(c(...), is.na))
  }
  data |>
    group_by(...) |>
    filter(n() > 1) |>
    ungroup() |>
    arrange(...)
}

check_duplicates_across <- function(data, column, across, na.rm = FALSE) {
  if (na.rm) {
    data <- filter(data, !is.na({{ column }}))
  }
  data |>
    group_by({{ column }}) |>
    filter(n_distinct({{ across }}) > 1) |>
    ungroup() |>
    arrange({{ column }})
}

check_conditional_required <- function(data, condition, required) {
  data |>
    filter({{ condition }}, is.na({{ required }}))
}

check_formula_errors <- function(spreadsheet, sheet) {
  cells <- googlesheets4::range_read_cells(
    spreadsheet,
    sheet = sheet,
    cell_data = "full"
  )
  cells |>
    mutate(
      error_type = map_chr(
        cell,
        \(x) x$effectiveValue$errorValue$type %||% NA_character_
      )
    ) |>
    filter(!is.na(error_type)) |>
    select(loc, row, col, error_type)
}

check_orphans <- function(data, ref, by) {
  data |>
    anti_join(ref, by = by)
}

# Papers with a given status that have no matching rows in a lower-level sheet
check_status_missing_rows <- function(papers, ref, status) {
  papers |>
    filter(paper_status %in% status) |>
    select(paper, paper_label, paper_status) |>
    check_orphans(distinct(ref, paper), by = "paper")
}

# Rows in a lower-level sheet that a paper's status says should not be there
check_status_unexpected_rows <- function(
  data,
  papers,
  status,
  condition = TRUE
) {
  data |>
    left_join(select(papers, paper, paper_status), by = "paper") |>
    filter(paper_status %in% status, {{ condition }}) |>
    relocate(paper, paper_label, paper_status)
}

check_sequence <- function(data, sequence_col, ..., skip_zero = FALSE) {
  data |>
    group_by(...) |>
    arrange({{ sequence_col }}, .by_group = TRUE) |>
    mutate(
      .n_neg = if (skip_zero) sum({{ sequence_col }} < 0) else 0L,
      .expected = row_number() - .n_neg - as.integer(row_number() <= .n_neg)
    ) |>
    filter(any({{ sequence_col }} != .expected)) |>
    select(-.n_neg, -.expected) |>
    ungroup()
}

check_missing <- function(data) {
  data |>
    summarise(across(everything(), ~ sum(is.na(.x)))) |>
    pivot_longer(everything(), names_to = "column", values_to = "n_missing") |>
    filter(n_missing > 0) |>
    arrange(desc(n_missing))
}

check_smd <- function(effects, statistics, tolerance = 0.001) {
  stats_wide <- statistics |>
    filter(statistic_name %in% c("M", "SD", "n")) |>
    pivot_wider(
      id_cols = c(paper, study, outcome, sample, statistics),
      names_from = statistic_name,
      values_from = statistic_value
    )

  # Difference-in-differences SMDs (with _2 groups) aren't _1 vs _1 comparisons
  data <- effects |>
    filter(effect_size_name == "SMD", is.na(intervention_statistics_2)) |>
    left_join(
      select(
        stats_wide,
        paper,
        study,
        outcome,
        statistics,
        m1i = M,
        sd1i = SD,
        n1i = n
      ),
      by = c(
        "paper",
        "study",
        "outcome",
        "intervention_statistics_1" = "statistics"
      )
    ) |>
    left_join(
      select(
        stats_wide,
        paper,
        study,
        outcome,
        statistics,
        m2i = M,
        sd2i = SD,
        n2i = n
      ),
      by = c("paper", "study", "outcome", "control_statistics_1" = "statistics")
    ) |>
    filter(
      !is.na(m1i),
      !is.na(sd1i),
      !is.na(n1i),
      !is.na(m2i),
      !is.na(sd2i),
      !is.na(n2i)
    )

  recalculated <- metafor::escalc(
    measure = "SMD",
    m1i = data$m1i,
    sd1i = data$sd1i,
    n1i = data$n1i,
    m2i = data$m2i,
    sd2i = data$sd2i,
    n2i = data$n2i
  )

  data |>
    mutate(
      effect_size_recalculated = recalculated$yi,
      effect_size_var_recalculated = recalculated$vi
    ) |>
    filter(
      abs(effect_size - effect_size_recalculated) > tolerance |
        abs(effect_size_var - effect_size_var_recalculated) > tolerance
    ) |>
    select(
      paper,
      paper_label,
      study,
      outcome,
      effect,
      effect_size,
      effect_size_recalculated,
      effect_size_var,
      effect_size_var_recalculated
    )
}

check_effect_direction <- function(effects, statistics, outcomes) {
  # effect_size is stored unflipped, i.e. positive means the intervention's
  # raw descriptive value (M, or percentage for successes/failures-based
  # effects like OR2DL) is higher than the control's (the convention used by
  # escalc in check_smd/check_or2dl). Flipping by outcome_expectation happens
  # later, in meta-analysis.r. M is preferred over percentage when both are
  # present for a statistics group.
  raw_stats <- statistics |>
    filter(statistic_name %in% c("M", "percentage")) |>
    mutate(priority = if_else(statistic_name == "M", 1L, 2L)) |>
    group_by(paper, study, outcome, statistics) |>
    slice_min(priority, n = 1, with_ties = FALSE) |>
    ungroup() |>
    select(
      paper,
      study,
      outcome,
      statistics,
      statistic_name,
      value = statistic_value
    )

  # Difference-in-differences effects don't follow the sign of _1 vs _1
  effects |>
    filter(is.na(intervention_statistics_2)) |>
    left_join(
      select(outcomes, paper, study, outcome, outcome_expectation),
      by = c("paper", "study", "outcome")
    ) |>
    left_join(
      select(
        raw_stats,
        paper,
        study,
        outcome,
        statistics,
        statistic_name_1 = statistic_name,
        value_1 = value
      ),
      by = c(
        "paper",
        "study",
        "outcome",
        "intervention_statistics_1" = "statistics"
      )
    ) |>
    left_join(
      select(
        raw_stats,
        paper,
        study,
        outcome,
        statistics,
        statistic_name_2 = statistic_name,
        value_2 = value
      ),
      by = c("paper", "study", "outcome", "control_statistics_1" = "statistics")
    ) |>
    filter(
      !is.na(value_1),
      !is.na(value_2),
      !is.na(effect_size),
      value_1 != value_2
    ) |>
    mutate(
      raw_direction = sign(value_1 - value_2),
      effect_sign = sign(effect_size)
    ) |>
    filter(effect_sign != raw_direction) |>
    select(
      paper,
      paper_label,
      study,
      outcome,
      effect,
      outcome_expectation,
      statistic_name_1,
      value_1,
      statistic_name_2,
      value_2,
      effect_size,
      raw_direction,
      effect_sign
    )
}

check_or2dl <- function(effects, statistics, tolerance = 0.001) {
  stats_wide <- statistics |>
    filter(statistic_name %in% c("successes", "failures")) |>
    pivot_wider(
      id_cols = c(paper, study, outcome, sample, statistics),
      names_from = statistic_name,
      values_from = statistic_value,
      values_fn = \(x) if (length(x) == 1) x else NA_real_
    )

  data <- effects |>
    filter(effect_size_name == "OR2DL") |>
    left_join(
      select(
        stats_wide,
        paper,
        study,
        outcome,
        statistics,
        ai = successes,
        bi = failures
      ),
      by = c(
        "paper",
        "study",
        "outcome",
        "intervention_statistics_1" = "statistics"
      )
    ) |>
    left_join(
      select(
        stats_wide,
        paper,
        study,
        outcome,
        statistics,
        ci = successes,
        di = failures
      ),
      by = c("paper", "study", "outcome", "control_statistics_1" = "statistics")
    ) |>
    filter(!is.na(ai), !is.na(bi), !is.na(ci), !is.na(di))

  recalculated <- metafor::escalc(
    measure = "OR2DL",
    ai = data$ai,
    bi = data$bi,
    ci = data$ci,
    di = data$di
  )

  data |>
    mutate(
      effect_size_recalculated = recalculated$yi,
      effect_size_var_recalculated = recalculated$vi
    ) |>
    filter(
      abs(effect_size - effect_size_recalculated) > tolerance |
        abs(effect_size_var - effect_size_var_recalculated) > tolerance
    ) |>
    select(
      paper,
      paper_label,
      study,
      outcome,
      effect,
      effect_size,
      effect_size_recalculated,
      effect_size_var,
      effect_size_var_recalculated
    )
}

# Codebook ----------------------------------------------------------------

# codebook.yaml defines each sheet's columns and what values they allow; see
# the comment at the top of that file for the format
codebook <- read_yaml("codebook.yaml")

# One row per sheet column, in sheet order, and whether it's a lookup
codebook_sheets <- tibble(
  sheet = names(codebook$sheets),
  definition = codebook$sheets
) |>
  unnest_wider(definition)

codebook_sheet_columns <- codebook_sheets |>
  select(sheet, column = columns, lookups) |>
  unnest_longer(column) |>
  mutate(
    position = row_number(),
    lookup = map2_lgl(column, lookups, `%in%`),
    .by = sheet
  ) |>
  select(-lookups)

# One row per column definition: type, multiple, required, min, max, status
codebook_columns <- tibble(
  column = names(codebook$columns),
  definition = codebook$columns
) |>
  unnest_wider(definition) |>
  mutate(multiple = multiple %in% TRUE, required = required %in% TRUE)

# One row per allowed level. Levels are written as a plain string or as a map
# with value, description, and requires; plain strings become maps too.
level_as_map <- function(level) {
  if (is.list(level)) level else list(value = level)
}

codebook_levels <- codebook_columns |>
  select(column, level = levels) |>
  mutate(level = map(level, \(levels) map(as.list(levels), level_as_map))) |>
  unnest_longer(level) |>
  unnest_wider(level) |>
  mutate(value = as.character(value))

# One row per level that requires another column, and each level allowed there
codebook_requires <- codebook_levels |>
  select(column, value, requires) |>
  filter(!map_lgl(requires, is.null)) |>
  unnest_longer(
    requires,
    indices_to = "other_column",
    values_to = "other_level"
  ) |>
  unnest_longer(other_level)

# Import data -------------------------------------------------------------

url <- "https://docs.google.com/spreadsheets/"
url_id <- "d/1asBfkq4AkTtdcb_yZTkN685LVeV5DYHNrO83g9N5HCU/"

# .row is the row number in the sheet, to find a problem there. Trailing rows
# without a paper are empty rows whose formulas show #REF! or #N/A.
sheets <- names(codebook$sheets) |>
  set_names() |>
  map(\(sheet) {
    read_sheet(paste0(url, url_id), sheet = sheet, na = c("", "-")) |>
      mutate(.row = row_number() + 1, .before = 1) |>
      filter(!is.na(paper))
  })

papers <- sheets$`Paper-level`
studies <- sheets$`Study-level`
samples <- sheets$`Sample-level`
conditions <- sheets$`Condition-level`
outcomes <- sheets$`Outcome-level`
statistics <- sheets$`Statistics-level`
effects <- sheets$`Effects-level`

reviews <- read_sheet(
  paste0(url, url_id),
  sheet = "Meta-reviews & reviews",
  na = c("", "-", "NA")
)

# Validation: Codebook ---------------------------------------------------

# Columns in the codebook but not in the sheet, and the other way round
sheet_columns <- sheets |>
  imap(\(data, sheet) {
    tibble(sheet = sheet, column = setdiff(names(data), ".row")) |>
      mutate(position = row_number())
  }) |>
  list_rbind()

anti_join(codebook_sheet_columns, sheet_columns, by = c("sheet", "column"))
anti_join(sheet_columns, codebook_sheet_columns, by = c("sheet", "column"))

# Columns that both have, but in a different order
inner_join(
  sheet_columns,
  codebook_sheet_columns,
  by = c("sheet", "column"),
  suffix = c("_sheet", "_codebook")
) |>
  filter(
    rank(position_sheet) != rank(position_codebook),
    .by = sheet
  )

# One row per cell of every column that is entered by hand: lookups (sheet
# formulas) and draft columns are left out. Cells with mixed types come in as
# a list column, so all values are compared as text.
as_text <- function(x) {
  if (is.list(x)) {
    x <- map_chr(x, \(v) if (length(v) == 0) NA_character_ else as.character(v))
  }
  na_if(str_trim(as.character(x)), "")
}

cells <- sheets |>
  imap(\(data, sheet) {
    data |>
      mutate(across(-c(.row, paper), as_text)) |>
      pivot_longer(-c(.row, paper), names_to = "column", values_to = "value") |>
      mutate(sheet = sheet, .before = 1)
  }) |>
  list_rbind() |>
  semi_join(
    filter(codebook_sheet_columns, !lookup),
    by = c("sheet", "column")
  ) |>
  inner_join(
    select(
      codebook_columns,
      column,
      type,
      multiple,
      required,
      min,
      max,
      status
    ),
    by = "column"
  ) |>
  filter(!status %in% "draft")

# Required cells that are empty
cells |>
  filter(required, is.na(value)) |>
  select(sheet, .row, paper, column)

# Numbers: not a number, not a whole number, or outside the allowed range
numbers <- cells |>
  filter(type %in% c("integer", "number"), !is.na(value)) |>
  mutate(number = suppressWarnings(as.numeric(value)))

numbers |>
  filter(is.na(number)) |>
  select(sheet, .row, paper, column, value)

numbers |>
  filter(type == "integer", number %% 1 != 0) |>
  select(sheet, .row, paper, column, value)

numbers |>
  filter(number < min | number > max) |>
  select(sheet, .row, paper, column, value, min, max)

# Links that don't start with http(s)://
cells |>
  filter(type == "url", !is.na(value), !str_detect(value, "^https?://")) |>
  select(sheet, .row, paper, column, value)

# Factor cells, one row per level; multi-value cells are split on commas
factor_cells <- bind_rows(
  cells |>
    filter(type == "factor", !multiple, !is.na(value)) |>
    mutate(level = value),
  cells |>
    filter(type == "factor", multiple, !is.na(value)) |>
    mutate(level = value) |>
    separate_longer_delim(level, delim = ",")
) |>
  mutate(level = str_trim(level))

# Levels that aren't in the codebook
factor_cells |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  count(sheet, column, level, sort = TRUE)

factor_cells |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  select(sheet, .row, paper, column, value)

# Levels that require another column in the same row to hold one of the
# listed levels, e.g. product subtype "beef" requires product type "meat"
factor_cells |>
  select(sheet, .row, paper, column, level) |>
  inner_join(
    codebook_requires,
    by = c("column", "level" = "value"),
    relationship = "many-to-many"
  ) |>
  left_join(
    factor_cells |>
      select(sheet, .row, other_column = column, other_level = level) |>
      mutate(found = TRUE),
    by = c("sheet", ".row", "other_column", "other_level")
  ) |>
  summarise(
    ok = any(found %in% TRUE),
    allowed = paste(other_level, collapse = " or "),
    .by = c(sheet, .row, paper, column, level, other_column)
  ) |>
  filter(!ok) |>
  left_join(
    select(cells, sheet, .row, other_column = column, other_value = value),
    by = c("sheet", ".row", "other_column")
  ) |>
  select(-ok)

# The included reviews should be the paper_in_paper levels, with the same
# reference. Meta-reviews led to reviews, not to papers, so they're no level.
reviews_included <- reviews |>
  filter(status == "included", `source type` != "meta-review") |>
  select(value = label, reference)

paper_in_paper_levels <- codebook_levels |>
  filter(column == "paper_in_paper", value != "Other") |>
  select(value, description)

full_join(reviews_included, paper_in_paper_levels, by = "value") |>
  filter(
    is.na(reference) |
      is.na(description) |
      str_squish(reference) != str_squish(description)
  )

# Validation: Paper-level ------------------------------------------------

check_duplicates(papers, paper)
check_duplicates(papers, paper_label)

# Duplicate titles, ignoring case and punctuation
papers |>
  mutate(
    title = paper_title |>
      str_to_lower() |>
      str_remove_all("[^a-z0-9 ]") |>
      str_squish()
  ) |>
  check_duplicates(title, na.rm = TRUE) |>
  select(.row, paper, paper_label, paper_title)

# Duplicate links, ignoring http(s), www, dx., case, and a trailing slash
papers |>
  mutate(
    link = paper_link |>
      str_to_lower() |>
      str_remove("^https?://(dx\\.)?(www\\.)?") |>
      str_remove("/$")
  ) |>
  check_duplicates(link, na.rm = TRUE) |>
  select(.row, paper, paper_label, paper_link)

# Years after this year (the codebook checks the minimum)
papers |>
  filter(paper_year > year(today())) |>
  select(.row, paper, paper_label, paper_year)

# Labels should look like "Author (2020)", "Author & Author (2020)", or
# "Author et al. (2020a)", with "&" rather than "and"
papers |>
  filter(
    !str_detect(paper_label, "^\\S.* \\((.+, )?\\d{4}[a-z]?\\)$") |
      str_detect(paper_label, " and |\\Set al\\.|et al(?!\\.)|et a\\.")
  ) |>
  select(.row, paper, paper_label)

# The label's year should be paper_year
papers |>
  mutate(label_year = as.numeric(str_extract(paper_label, "\\d{4}(?=[a-z]?\\)$)"))) |>
  filter(label_year != paper_year) |>
  select(.row, paper, paper_label, paper_year)

# The label's first author should be the first author in paper_authors.
# Names with particles can be written either way round ("da Silva" vs
# "Rocha Possidónio da Silva"), so one may end with the other. Organisations
# as authors show up here too.
papers |>
  mutate(
    label_author = str_to_lower(str_extract(paper_label, "^.*?(?= et a| & | and | \\()")),
    first_author = str_to_lower(str_extract(paper_authors, "^[^,;]+"))
  ) |>
  filter(
    !str_ends(label_author, fixed(first_author)),
    !str_ends(first_author, fixed(label_author))
  ) |>
  select(.row, paper, paper_label, paper_authors)

# paper_authors should be "Last, I.; Last, I.": each author separated by a
# semicolon, with one comma between last name and initials
papers |>
  select(.row, paper, paper_label, paper_authors) |>
  mutate(author = paper_authors) |>
  separate_longer_delim(author, delim = ";") |>
  filter(str_count(author, ",") > 1 | str_detect(author, "&")) |>
  distinct(.row, paper, paper_label, paper_authors)

# Validation: Study-level ------------------------------------------------

check_duplicates(studies, paper, study)
check_duplicates_across(
  studies,
  study_preregistration_link,
  paper,
  na.rm = TRUE
)
check_duplicates_across(studies, study_data_link, paper, na.rm = TRUE)

check_formula_errors(paste0(url, url_id), "Study-level")

check_conditional_required(
  studies,
  study_preregistered == "yes",
  study_preregistration_link
)

check_conditional_required(
  studies,
  study_data_available == "yes",
  study_data_link
)

check_missing(studies)

# Validation: Condition-level --------------------------------------------

check_duplicates(conditions, paper, study, condition)

check_formula_errors(paste0(url, url_id), "Condition-level")

check_sequence(conditions, condition, paper, study)

check_missing(conditions)
check_missing(filter(conditions, condition_category == "intervention"))

conditions |>
  filter(condition_category == "intervention") |>
  filter(is.na(intervention_medium))

# Validation: Outcome-level ----------------------------------------------

check_duplicates(outcomes, paper, study, outcome, time)

check_formula_errors(paste0(url, url_id), "Outcome-level")

# Time within each outcome should sequence (allow negative baseline, skip 0)
check_sequence(outcomes, time, paper, study, outcome, skip_zero = TRUE)

# Distinct outcomes within each (paper, study) should sequence from 1
outcomes |>
  distinct(paper, study, outcome) |>
  check_sequence(outcome, paper, study)

check_missing(outcomes)

# Validation: Sample-level -----------------------------------------------

check_duplicates(samples, paper, study, sample)

check_formula_errors(paste0(url, url_id), "Sample-level")

check_orphans(
  distinct(studies, paper, study),
  filter(samples, str_starts(sample_label, "\\(total\\)")),
  by = c("paper", "study")
)

check_duplicates(
  filter(samples, str_starts(sample_label, "\\(total\\)")),
  paper,
  study
)

check_sequence(samples, sample, paper, study)

check_missing(samples)

# Validation: Statistics-level -------------------------------------------

check_duplicates(
  statistics,
  paper,
  statistics,
  statistic
)

check_formula_errors(paste0(url, url_id), "Statistics-level")

check_orphans(
  statistics |>
    filter(!is.na(sample)) |>
    select(paper, study, sample),
  select(samples, paper, study, sample),
  by = c("paper", "study", "sample")
)

# Check whether within each statistics group, the statistic values form sequences

check_sequence(
  statistics,
  statistic,
  paper,
  statistics
)

# Check whether percentages are between 0 and 100
statistics |>
  filter(
    statistic_name == "percentage",
    !is.na(statistic_value),
    statistic_value < 0 | statistic_value > 100
  )

# Within each statistics group that has a percentage, successes + failures = n
statistics |>
  filter(statistic_name %in% c("percentage", "successes", "failures", "n")) |>
  pivot_wider(
    id_cols = c(paper, paper_label, study, statistics),
    names_from = statistic_name,
    values_from = statistic_value,
    values_fn = \(x) if (length(x) == 1) x else NA_real_
  ) |>
  filter(!is.na(percentage)) |>
  filter(
    is.na(successes) | is.na(failures) | is.na(n) | successes + failures != n
  )

check_missing(statistics)

statistics |>
  filter(is.na(condition_category)) |>
  print(n = Inf)

statistics |>
  filter(is.na(sample)) |>
  print(n = Inf)

# Validation: Effects-level ----------------------------------------------

check_duplicates(
  effects,
  paper,
  study,
  outcome,
  intervention_condition,
  intervention_time_1,
  intervention_time_2,
  control_condition,
  control_time_1,
  control_time_2,
  effect
)

# Each comparison should have at most one effect that goes into the
# meta-analysis (e.g. a reported test and a recalculated effect, or an original
# d and a converted SMD, where only one has effect_exclude "no")
effects |>
  filter(effect_exclude %in% "no") |>
  check_duplicates(
    paper,
    study,
    outcome,
    intervention_condition,
    intervention_time_1,
    intervention_time_2,
    intervention_sample,
    control_condition,
    control_time_1,
    control_time_2,
    control_sample
  )

# Intervention and control should use different statistics groups, except for
# one-sample SMCC effects on change scores (no effect_r)
effects |>
  filter(
    intervention_statistics_1 == control_statistics_1,
    !(effect_size_name %in% "SMCC" & is.na(effect_r))
  ) |>
  select(
    paper,
    paper_label,
    effect,
    effect_size_name,
    intervention_statistics_1,
    control_statistics_1
  )

check_formula_errors(paste0(url, url_id), "Effects-level")

check_orphans(
  effects |>
    filter(effect_exclude == "no") |>
    select(paper, study, outcome, intervention_time_1),
  select(outcomes, paper, study, outcome, intervention_time_1 = time),
  by = c("paper", "study", "outcome", "intervention_time_1")
)
check_orphans(
  effects |>
    filter(effect_exclude == "no") |>
    select(paper, study, intervention_condition),
  conditions |>
    filter(condition_category == "intervention") |>
    select(paper, study, condition),
  by = c("paper", "study", "intervention_condition" = "condition")
)

check_sequence(effects, effect, paper, study, outcome)

check_missing(effects)

check_smd(effects, statistics)
check_or2dl(effects, statistics)
check_effect_direction(effects, statistics, outcomes)

# Check whether effects have sample sizes in the statistics level
n_statistics <- statistics |>
  filter(statistic_name == "n") |>
  select(paper, study, outcome, statistics)

check_orphans(
  effects |>
    filter(effect_exclude == "no") |>
    select(paper, study, outcome, intervention_statistics_1),
  n_statistics,
  by = c(
    "paper",
    "study",
    "outcome",
    "intervention_statistics_1" = "statistics"
  )
)

check_orphans(
  effects |>
    filter(effect_exclude == "no") |>
    select(paper, study, outcome, control_statistics_1),
  n_statistics,
  by = c("paper", "study", "outcome", "control_statistics_1" = "statistics")
)

# Validation: Paper status -----------------------------------------------

# Effects that still count towards a paper: "maybe" and missing are not
# exclusions, so only an explicit "yes" removes an effect from the pool
effects_kept <- effects |>
  filter(!(effect_exclude %in% "yes"))

# Papers marked "included" should be coded all the way down
check_status_missing_rows(papers, studies, "included")
check_status_missing_rows(papers, conditions, "included")
check_status_missing_rows(papers, outcomes, "included")
check_status_missing_rows(papers, effects_kept, "included")

# Coding of an included paper should be finished: no undecided effects left,
# and every effect that counts should have an effect size
check_status_unexpected_rows(
  effects,
  papers,
  "included",
  effect_exclude == "maybe"
)

check_status_unexpected_rows(
  effects_kept,
  papers,
  "included",
  is.na(effect_size) | is.na(effect_size_var)
)

# Papers marked "excluded" should have no effects left that still count
check_status_unexpected_rows(effects_kept, papers, "excluded")
