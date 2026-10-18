# Setup -------------------------------------------------------------------

library(tidyverse)
library(googlesheets4)
library(yaml)
library(btw)

source("r/effect-functions.r")

btw_mcp_session()

# Validation functions ----------------------------------------------------

# Find duplicates: rows with the same values in the given columns, e.g. two
# studies with the same paper and study number. With na.rm = TRUE, empty
# values don't count as duplicates of each other.
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

# Find values shared across groups: values of one column that appear under
# different values of another, e.g. the same data link in different papers.
# With na.rm = TRUE, empty values are left out.
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

# Find missing values that a condition requires: rows where a column should
# be filled but is empty, e.g. a study that was preregistered but has no
# preregistration link
check_conditional_required <- function(data, condition, required) {
  data |>
    filter({{ condition }}, is.na({{ required }}))
}

# Find orphans: rows of data with no matching row in ref, e.g. studies of a
# paper that isn't in Paper-level
check_orphans <- function(data, ref, by) {
  data |>
    anti_join(ref, by = by)
}

# Find papers that should be coded further: papers with a given status that
# have no rows in a lower-level sheet, e.g. an included paper without studies
check_status_missing_rows <- function(papers, ref, status) {
  papers |>
    filter(paper_status %in% status) |>
    select(paper, paper_label, paper_status) |>
    check_orphans(distinct(ref, paper), by = "paper")
}

# Find rows that a paper's status rules out: rows in a lower-level sheet of
# papers with a given status, optionally only those that meet a condition,
# e.g. effects of an excluded paper
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

# Find gaps in numbering: groups whose numbers don't run 1, 2, 3, ..., e.g.
# conditions 1, 2, 4 in a study. With skip_zero = TRUE, negative numbers
# (baseline measurements) come first and there's no 0: -1, 1, 2, ...
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

# Count missing values: the number of empty cells in each column
check_missing <- function(data) {
  data |>
    summarise(across(everything(), ~ sum(is.na(.x)))) |>
    pivot_longer(everything(), names_to = "column", values_to = "n_missing") |>
    filter(n_missing > 0) |>
    arrange(desc(n_missing))
}

# Find effects with the wrong sign: effects whose sign doesn't match the data,
# e.g. a positive effect size while the intervention's mean is lower than the
# control's
check_effect_direction <- function(effects, statistics, outcomes) {
  # In the sheet, a positive effect size means the intervention's mean (or
  # percentage, for effects like OR2DL) is higher than the control's;
  # meta-analysis.r flips it by outcome_expectation later. Groups with both a
  # mean and a percentage are compared on the mean.
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

  # Leave out difference-in-differences effects, which compare more than two
  # groups
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

# Codebook ----------------------------------------------------------------

# Read the codebook, which defines each sheet's columns and the values they
# allow
codebook <- read_yaml("codebook.yaml")

# List the sheet tabs in the codebook, with their columns and lookups
codebook_sheets <- tibble(
  sheet = names(codebook$sheets),
  definition = codebook$sheets
) |>
  unnest_wider(definition)

# List each sheet's columns in the order the codebook gives them, and mark
# those filled by a sheet formula (lookups)
codebook_sheet_columns <- codebook_sheets |>
  select(sheet, column = columns, lookups) |>
  unnest_longer(column) |>
  mutate(
    position = row_number(),
    lookup = map2_lgl(column, lookups, `%in%`),
    .by = sheet
  ) |>
  select(-lookups)

# Turn the codebook's column definitions into a table, so the checks below
# can look up each column's type, levels, range, and whether it's required.
# multiple and required are only in the yaml when true, so columns without
# them get NA; replace NA with FALSE instead.
codebook_columns <- tibble(
  column = names(codebook$columns),
  definition = codebook$columns
) |>
  unnest_wider(definition) |>
  mutate(multiple = multiple %in% TRUE, required = required %in% TRUE)

# Give every level the same shape, whether it's written as a plain string or
# with extra fields
level_as_map <- function(level) {
  if (is.list(level)) level else list(value = level)
}

# List the allowed values of each factor column, one row per value, e.g.
# study_design with "between", "within", "mixed", and "crossover"
codebook_levels <- codebook_columns |>
  select(column, level = levels) |>
  mutate(level = map(level, \(levels) map(as.list(levels), level_as_map))) |>
  unnest_longer(level) |>
  unnest_wider(level) |>
  mutate(value = as.character(value))

# List the requires rules: which level needs which level in another column,
# e.g. product_subtype "beef" needs product_type "meat". A level that allows
# several other levels gets one row for each.
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

# Read every cell of every sheet in the codebook, once
sheet_cells <- names(codebook$sheets) |>
  set_names() |>
  map(\(sheet) range_read_cells(paste0(url, url_id), sheet = sheet))

# Turn each sheet into a table. Each row gets its row number in the sheet
# (.row), so you can find a flagged problem there, and the empty rows at the
# bottom of each sheet are dropped.
sheets <- sheet_cells |>
  map(\(cells) {
    spread_sheet(cells, na = c("", "-")) |>
      mutate(.row = row_number() + 1, .before = 1) |>
      filter(!is.na(paper))
  })

# Collect the cells whose formula gives an error, such as #REF! or #N/A. In
# the tables above these are just empty, so they're kept here to check
# separately.
formula_errors <- sheet_cells |>
  list_rbind(names_to = "sheet") |>
  mutate(
    error = map_chr(
      cell,
      \(x) x$effectiveValue$errorValue$type %||% NA_character_
    )
  ) |>
  filter(!is.na(error)) |>
  select(sheet, .row = row, col, error)

rm(sheet_cells)

papers <- sheets$`Paper-level`
studies <- sheets$`Study-level`
samples <- sheets$`Sample-level`
conditions <- sheets$`Condition-level`
outcomes <- sheets$`Outcome-level`
statistics <- sheets$`Statistics-level`
effects <- sheets$`Effects-level`

# Read the reviews and meta-reviews that papers were found through
reviews <- read_sheet(
  paste0(url, url_id),
  sheet = "Meta-reviews & reviews",
  na = c("", "-", "NA")
)

# Validation: Codebook ---------------------------------------------------

# Find columns in the codebook but not in the sheet, and the other way round
sheet_columns <- sheets |>
  imap(\(data, sheet) {
    tibble(sheet = sheet, column = setdiff(names(data), ".row")) |>
      mutate(position = row_number())
  }) |>
  list_rbind()

anti_join(codebook_sheet_columns, sheet_columns, by = c("sheet", "column"))
anti_join(sheet_columns, codebook_sheet_columns, by = c("sheet", "column"))

# Find columns that both have, but in a different order
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

# Turn cell values into text, since a column can mix numbers and text
as_text <- function(x) {
  if (is.list(x)) {
    x <- map_chr(x, \(v) if (length(v) == 0) NA_character_ else as.character(v))
  }
  na_if(str_trim(as.character(x)), "")
}

# Put every hand-entered cell of every sheet in one table, next to the
# codebook rules for its column, so each check below can look at all sheets at
# once.
# Lookups (filled by sheet formulas) and draft columns are left out.
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

# Find required cells that are empty
cells |>
  filter(required, is.na(value)) |>
  select(sheet, .row, paper, column)

# Find number cells that aren't a number, aren't a whole number (for
# integers), or are outside the allowed range
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

# Find links that don't start with http(s)://
cells |>
  filter(type == "url", !is.na(value), !str_detect(value, "^https?://")) |>
  select(sheet, .row, paper, column, value)

# List the levels used in factor cells, one per row, so a cell with several
# comma-separated levels is checked level by level
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

# Find levels that aren't in the codebook
factor_cells |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  count(sheet, column, level, sort = TRUE)

factor_cells |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  select(sheet, .row, paper, column, value)

# Find levels whose requires rule isn't met, e.g. product subtype "beef"
# without product type "meat" in the same row
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

# Find included reviews that aren't a paper_in_paper level with the same
# reference, and the other way round. Meta-reviews led to reviews, not to
# papers, so they aren't levels.
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

# Find formula errors (#REF!, #N/A) in rows that have a paper. The empty rows
# at the bottom of each sheet always have them, so they're left out.
sheet_rows <- sheets |>
  map(\(data) select(data, .row, paper)) |>
  list_rbind(names_to = "sheet")

formula_errors |>
  inner_join(sheet_rows, by = c("sheet", ".row")) |>
  left_join(
    select(sheet_columns, sheet, col = position, column),
    by = c("sheet", "col")
  ) |>
  select(sheet, .row, paper, column, error)

# Validation: Paper-level ------------------------------------------------

check_duplicates(papers, paper)
check_duplicates(papers, paper_label)

# Find duplicate titles, ignoring case and punctuation
papers |>
  mutate(
    title = paper_title |>
      str_to_lower() |>
      str_remove_all("[^a-z0-9 ]") |>
      str_squish()
  ) |>
  check_duplicates(title, na.rm = TRUE) |>
  select(.row, paper, paper_label, paper_title)

# Find duplicate links, ignoring http(s), www, dx., case, and a trailing
# slash
papers |>
  mutate(
    link = paper_link |>
      str_to_lower() |>
      str_remove("^https?://(dx\\.)?(www\\.)?") |>
      str_remove("/$")
  ) |>
  check_duplicates(link, na.rm = TRUE) |>
  select(.row, paper, paper_label, paper_link)

# Find years after this year (the codebook checks the minimum)
papers |>
  filter(paper_year > year(today())) |>
  select(.row, paper, paper_label, paper_year)

# Find labels that don't look like "Author (2020)", "Author & Author (2020)",
# or "Author et al. (2020a)", with "&" rather than "and"
papers |>
  filter(
    !str_detect(paper_label, "^\\S.* \\((.+, )?\\d{4}[a-z]?\\)$") |
      str_detect(paper_label, " and |\\Set al\\.|et al(?!\\.)|et a\\.")
  ) |>
  select(.row, paper, paper_label)

# Find labels whose year isn't paper_year
papers |>
  mutate(
    label_year = as.numeric(str_extract(paper_label, "\\d{4}(?=[a-z]?\\)$)"))
  ) |>
  filter(label_year != paper_year) |>
  select(.row, paper, paper_label, paper_year)

# Find labels whose first author isn't the first author in paper_authors.
# Names with particles can be written either way round ("da Silva" vs
# "Rocha Possidónio da Silva"), so one may end with the other. Organisations
# as authors show up here too.
papers |>
  mutate(
    label_author = str_to_lower(str_extract(
      paper_label,
      "^.*?(?= et a| & | and | \\()"
    )),
    first_author = str_to_lower(str_extract(paper_authors, "^[^,;]+"))
  ) |>
  filter(
    !str_ends(label_author, fixed(first_author)),
    !str_ends(first_author, fixed(label_author))
  ) |>
  select(.row, paper, paper_label, paper_authors)

# Find paper_authors not written as "Last, I.; Last, I.": each author
# separated by a semicolon, with one comma between last name and initials
papers |>
  select(.row, paper, paper_label, paper_authors) |>
  mutate(author = paper_authors) |>
  separate_longer_delim(author, delim = ";") |>
  filter(str_count(author, ",") > 1 | str_detect(author, "&")) |>
  distinct(.row, paper, paper_label, paper_authors)

# Validation: Study-level ------------------------------------------------

check_duplicates(studies, paper, study)

# Find studies of a paper that isn't in Paper-level
check_orphans(studies, papers, by = "paper") |>
  select(.row, paper, paper_label, study)

# Find the same preregistration or data link in different papers
check_duplicates_across(
  studies,
  study_preregistration_link,
  paper,
  na.rm = TRUE
)
check_duplicates_across(studies, study_data_link, paper, na.rm = TRUE)

# Find preregistration and data links that are missing although the study
# says it was preregistered or its data are available, or that are there
# although it says not
check_conditional_required(
  studies,
  study_preregistered == "yes",
  study_preregistration_link
)

studies |>
  filter(study_preregistered == "no", !is.na(study_preregistration_link)) |>
  select(.row, paper, paper_label, study, study_preregistration_link)

check_conditional_required(
  studies,
  study_data_available == "yes",
  study_data_link
)

studies |>
  filter(study_data_available == "no", !is.na(study_data_link)) |>
  select(.row, paper, paper_label, study, study_data_link)

# Validation: Condition-level --------------------------------------------

check_duplicates(conditions, paper, study, condition)

check_sequence(conditions, condition, paper, study)

check_missing(conditions)
check_missing(filter(conditions, condition_category == "intervention"))

conditions |>
  filter(condition_category == "intervention") |>
  filter(is.na(intervention_medium))

# Validation: Outcome-level ----------------------------------------------

check_duplicates(outcomes, paper, study, outcome, time)

# Find outcomes whose times aren't numbered 1, 2, 3, ..., with negative
# numbers for baseline measurements and no 0
check_sequence(outcomes, time, paper, study, outcome, skip_zero = TRUE)

# Find studies whose outcomes aren't numbered 1, 2, 3, ...
outcomes |>
  distinct(paper, study, outcome) |>
  check_sequence(outcome, paper, study)

check_missing(outcomes)

# Validation: Sample-level -----------------------------------------------

check_duplicates(samples, paper, study, sample)

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

# Find statistics groups used for more than one combination of study,
# outcome, time, condition, and sample, e.g. for two outcomes
statistics |>
  filter(!is.na(statistics)) |>
  distinct(
    paper,
    paper_label,
    statistics,
    study,
    outcome,
    time_1,
    time_2,
    condition,
    sample
  ) |>
  check_duplicates(paper, statistics)

# Find statistics that appear more than once in a statistics group, e.g. two
# n's
statistics |>
  filter(!is.na(statistic_name)) |>
  check_duplicates(paper, statistics, statistic_name) |>
  select(
    .row,
    paper,
    paper_label,
    statistics,
    statistic,
    statistic_name,
    statistic_value
  )

check_orphans(
  statistics |>
    filter(!is.na(sample)) |>
    select(paper, study, sample),
  select(samples, paper, study, sample),
  by = c("paper", "study", "sample")
)

# Find statistics groups whose statistics aren't numbered 1, 2, 3, ...
check_sequence(
  statistics,
  statistic,
  paper,
  statistics
)

# Find percentages below 0 or above 100
statistics |>
  filter(
    statistic_name == "percentage",
    !is.na(statistic_value),
    statistic_value < 0 | statistic_value > 100
  )

# Find statistics groups with a percentage whose successes, failures, or n
# are missing, or where successes + failures isn't n
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

# Find comparisons with more than one effect that goes into the meta-analysis
# (e.g. a reported test and a recalculated effect, or an original d and a
# converted SMD, where only one should have effect_exclude "no")
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

# Find effects whose intervention and control use the same statistics group,
# except one-sample SMCC effects on change scores (no effect_r)
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

# Find effects that don't reproduce: effect sizes or variances that differ
# from a recalculation from the statistics with r/effect-functions.r. Effects
# it can't calculate, such as a reported d, are left out.
recalculated <- effects |>
  select(-.row) |>
  calculate_effects(statistics) |>
  select(
    paper,
    study,
    outcome,
    effect,
    effect_size_recalculated = effect_size,
    effect_size_var_recalculated = effect_size_var
  )

effects |>
  inner_join(recalculated, by = c("paper", "study", "outcome", "effect")) |>
  filter(
    abs(effect_size - effect_size_recalculated) > 0.001 |
      abs(effect_size_var - effect_size_var_recalculated) > 0.001
  ) |>
  select(
    .row,
    paper,
    paper_label,
    effect,
    effect_size_name,
    effect_size,
    effect_size_recalculated,
    effect_size_var,
    effect_size_var_recalculated
  )

# Find effects we calculated (effect_from_paper "no") that can't be
# recalculated, e.g. because a statistic is missing or appears twice in a group
effects |>
  filter(effect_from_paper == "no") |>
  inner_join(recalculated, by = c("paper", "study", "outcome", "effect")) |>
  filter(is.na(effect_size_recalculated)) |>
  select(
    .row,
    paper,
    paper_label,
    effect,
    effect_size_name,
    intervention_statistics_1,
    control_statistics_1
  )

check_effect_direction(effects, statistics, outcomes)

# Find effects that go into the meta-analysis without an n for the
# intervention or the control group
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

# Keep the effects that still count towards a paper: "maybe" and missing are
# not exclusions, so only an explicit "yes" removes an effect from the pool
effects_kept <- effects |>
  filter(!(effect_exclude %in% "yes"))

# Find included papers that aren't coded all the way down
check_status_missing_rows(papers, studies, "included")
check_status_missing_rows(papers, conditions, "included")
check_status_missing_rows(papers, outcomes, "included")
check_status_missing_rows(papers, effects_kept, "included")

# Find included papers whose coding isn't finished: effects still undecided
# (effect_exclude "maybe"), or effects that count without an effect size
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

# Find excluded papers that still have effects that count
check_status_unexpected_rows(effects_kept, papers, "excluded")
