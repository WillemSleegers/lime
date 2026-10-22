# Setup -------------------------------------------------------------------

library(tidyverse)
library(googlesheets4)
library(yaml)
library(btw)

source("r/effect-functions.r")

btw_mcp_session()

# Functions ---------------------------------------------------------------

# Turn cell values into text, since a column can mix numbers and text
as_text <- function(x) {
  if (is.list(x)) {
    x <- map_chr(x, \(v) if (length(v) == 0) NA_character_ else as.character(v))
  }
  na_if(str_trim(as.character(x)), "")
}

# Turn a sheet's cells into a table. Each row gets its row number in the sheet
# (.row), so you can find a flagged problem there, and the empty rows at the
# bottom of the sheet are dropped.
sheet_table <- function(cells) {
  spread_sheet(cells, na = c("", "-")) |>
    mutate(.row = row_number() + 1, .before = 1) |>
    filter(!is.na(paper))
}

# Put every hand-entered cell of a sheet in one table, next to the codebook
# rules for its column, so the codebook checks can look at all its columns at
# once. Lookups (filled by sheet formulas) and draft columns are left out.
# Number cells also get their value as a number, or NA if it isn't one.
codebook_cells <- function(data, sheet_name) {
  data |>
    mutate(across(-c(.row, paper), as_text)) |>
    pivot_longer(-c(.row, paper), names_to = "column", values_to = "value") |>
    semi_join(
      filter(codebook_sheet_columns, sheet == sheet_name, !lookup),
      by = "column"
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
    filter(!status %in% "draft") |>
    mutate(
      number = if_else(
        type %in% c("integer", "number"),
        suppressWarnings(as.numeric(value)),
        NA_real_
      )
    )
}

# List the levels used in factor cells, one per row, so a cell with several
# comma-separated levels is checked level by level
factor_levels <- function(cells) {
  bind_rows(
    cells |>
      filter(type == "factor", !multiple, !is.na(value)) |>
      mutate(level = value),
    cells |>
      filter(type == "factor", multiple, !is.na(value)) |>
      mutate(level = value) |>
      separate_longer_delim(level, delim = ",")
  ) |>
    mutate(level = str_trim(level))
}

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
      distinct(outcomes, paper, study, outcome, outcome_expectation),
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

# Find formula errors, such as #REF! or #N/A, in rows that have a paper. In a
# sheet's table these are just empty, so they're found in its cells. The empty
# rows at the bottom of each sheet always have them, so they're left out.
check_formula_errors <- function(cells, data) {
  columns <- tibble(column = setdiff(names(data), ".row")) |>
    mutate(col = row_number())

  cells |>
    mutate(
      error = map_chr(
        cell,
        \(x) x$effectiveValue$errorValue$type %||% NA_character_
      )
    ) |>
    filter(!is.na(error)) |>
    select(.row = row, col, error) |>
    inner_join(select(data, .row, paper), by = ".row") |>
    left_join(columns, by = "col") |>
    select(.row, paper, column, error)
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

# List the allowed values of each factor column, one row per value, e.g.
# study_design with "between", "within", "mixed", and "crossover". A level
# can be a plain string or have extra fields, so plain ones are turned into
# the same shape first.
codebook_levels <- codebook_columns |>
  select(column, level = levels) |>
  mutate(level = map(level, as.list)) |>
  unnest_longer(level) |>
  mutate(level = map(level, \(x) if (is.list(x)) x else list(value = x))) |>
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
sheet_url <- paste0(url, url_id)

# Read every cell of each sheet. The cells are kept, because formula errors
# (#REF!, #N/A) only show up there.
paper_sheet <- range_read_cells(sheet_url, sheet = "Paper-level")
study_sheet <- range_read_cells(sheet_url, sheet = "Study-level")
condition_sheet <- range_read_cells(sheet_url, sheet = "Condition-level")
outcome_sheet <- range_read_cells(sheet_url, sheet = "Outcome-level")
sample_sheet <- range_read_cells(sheet_url, sheet = "Sample-level")
statistics_sheet <- range_read_cells(sheet_url, sheet = "Statistics-level")
effects_sheet <- range_read_cells(sheet_url, sheet = "Effects-level")

# Turn each sheet into a table
papers <- sheet_table(paper_sheet)
studies <- sheet_table(study_sheet)
conditions <- sheet_table(condition_sheet)
outcomes <- sheet_table(outcome_sheet)
samples <- sheet_table(sample_sheet)
statistics <- sheet_table(statistics_sheet)
effects <- sheet_table(effects_sheet)

# Read the reviews and meta-reviews that papers were found through
reviews <- read_sheet(
  sheet_url,
  sheet = "Meta-reviews & reviews",
  na = c("", "-", "NA")
)

# Validation: Paper-level ------------------------------------------------

# Find columns in the codebook but not in the sheet, and the other way around
paper_columns <- tibble(column = setdiff(names(papers), ".row")) |>
  mutate(position = row_number())
paper_codebook_columns <- codebook_sheet_columns |>
  filter(sheet == "Paper-level") |>
  select(column, position)

anti_join(paper_codebook_columns, paper_columns, by = "column")
anti_join(paper_columns, paper_codebook_columns, by = "column")

# Find columns that both have, but in a different order
inner_join(
  paper_columns,
  paper_codebook_columns,
  by = "column",
  suffix = c("_sheet", "_codebook")
) |>
  filter(rank(position_sheet) != rank(position_codebook))

check_formula_errors(paper_sheet, papers)

paper_cells <- codebook_cells(papers, "Paper-level")
paper_factors <- factor_levels(paper_cells)

# Find required cells that are empty
paper_cells |>
  filter(required, is.na(value)) |>
  select(.row, paper, column)

# Find number cells that aren't a number, aren't a whole number (for
# integers), or are outside the allowed range
paper_cells |>
  filter(type %in% c("integer", "number"), !is.na(value), is.na(number)) |>
  select(.row, paper, column, value)

paper_cells |>
  filter(type == "integer", number %% 1 != 0) |>
  select(.row, paper, column, value)

paper_cells |>
  filter(number < min | number > max) |>
  select(.row, paper, column, value, min, max)

# Find links that don't start with http(s)://
paper_cells |>
  filter(type == "url", !is.na(value), !str_detect(value, "^https?://")) |>
  select(.row, paper, column, value)

# Find levels that aren't in the codebook
paper_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  count(column, level, sort = TRUE)

paper_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  select(.row, paper, column, value)

# Find levels whose requires rule isn't met, e.g. product subtype "beef"
# without product type "meat" in the same row
paper_factors |>
  select(.row, paper, column, level) |>
  inner_join(
    codebook_requires,
    by = c("column", "level" = "value"),
    relationship = "many-to-many"
  ) |>
  left_join(
    paper_factors |>
      select(.row, other_column = column, other_level = level) |>
      mutate(found = TRUE),
    by = c(".row", "other_column", "other_level")
  ) |>
  summarise(
    ok = any(found %in% TRUE),
    allowed = paste(other_level, collapse = " or "),
    .by = c(.row, paper, column, level, other_column)
  ) |>
  filter(!ok) |>
  left_join(
    select(paper_cells, .row, other_column = column, other_value = value),
    by = c(".row", "other_column")
  ) |>
  select(-ok)

# Find included reviews that aren't a paper_in_paper level with the same
# reference, and the other way around. Meta-reviews led to reviews, not to
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

# Find titles in Title Case rather than sentence case: most longer words after
# the first start with a capital. Text in parentheses is left out, since it's
# often a spelled-out acronym. Titles full of names (projects, reports) show
# up here too. Paper 109's title starts with the name of the center that
# published it; it's skipped for as long as the title stays the same.
papers |>
  filter(
    !(paper == 109 &
      paper_title %in%
        "The Johns Hopkins Center for a Livable Future: Sodexo Meatless Monday survey results")
  ) |>
  select(.row, paper, paper_label, paper_title) |>
  mutate(
    word = paper_title |>
      str_remove_all("\\([^)]*\\)") |>
      str_remove("^\\S+\\s*")
  ) |>
  separate_longer_delim(word, delim = " ") |>
  mutate(word = str_remove_all(word, "^[^\\p{L}]+|[^\\p{L}]+$")) |>
  filter(str_length(word) > 3) |>
  summarise(
    words = n(),
    capitalized = mean(str_detect(word, "^\\p{Lu}")),
    .by = c(.row, paper, paper_label, paper_title)
  ) |>
  filter(words >= 3, capitalized >= 0.8)

# Find titles that end with a period (except abbreviations like "U.K."), have
# a lowercase word after a colon, or use curly quotes
papers |>
  filter(
    str_detect(paper_title, "(?<!\\b\\p{Lu})\\.$") |
      str_detect(paper_title, ": \\p{Ll}") |
      str_detect(paper_title, "[‘’“”]")
  ) |>
  select(.row, paper, paper_label, paper_title)

# Find titles with spacing problems: a space before punctuation
# ("Hochschulmensa : Fleisch"), a double space, or no space after a sentence
# ("intake.\"Five") or a comma
papers |>
  filter(
    str_detect(paper_title, " [:;,?!.]|  ") |
      str_detect(paper_title, "\\p{Ll}{2}[.?!:;](\\p{L}|[\"']\\p{L})|,\\p{L}")
  ) |>
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

# Find links with a DOI that aren't written as "https://doi.org/10.xxxx/...",
# e.g. dx.doi.org, a publisher's page, or a tracking suffix like ?urlappend=
papers |>
  filter(
    str_detect(paper_link, "10\\.\\d{4,9}/"),
    !str_detect(paper_link, "^https://doi\\.org/10\\.\\d{4,9}/[^?#\\s]+$")
  ) |>
  select(.row, paper, paper_label, paper_link)

# Find years after this year (the codebook checks the minimum)
papers |>
  filter(paper_year > year(today())) |>
  select(.row, paper, paper_label, paper_year)

# Find labels that don't look like "Author (2020)", "Author & Author (2020)",
# or "Author et al. (2020a)", with "&" rather than "and"
papers |>
  filter(
    !str_detect(paper_label, "^\\S.* \\(\\d{4}[a-z]?\\)$") |
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
# "Rocha Possidónio da Silva"), so one may end with the other. Organizations
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

# Find paper_authors not written as "Last, F. M.; Last, F.": each author
# separated by "; ", with a comma between last name and initials, and an
# optional Jr. or Sr. Authors with the same last name and initials get their
# first name in brackets, as APA does: "Ahmed, S. [Saifuddin]". Organizations
# are names without a comma, but not ones that end in initials ("Lea E").
# Truncated lists ("et al.", "…") show up too.
papers |>
  select(.row, paper, paper_label, paper_authors) |>
  mutate(author = paper_authors) |>
  separate_longer_delim(author, delim = "; ") |>
  mutate(
    person = str_detect(
      author,
      "^\\S[^,;&]*, \\p{Lu}\\.(-\\p{Lu}\\.)?( \\p{Lu}\\.(-\\p{Lu}\\.)?)*( \\[[^\\]]+\\])?(, (Jr|Sr)\\.)?$"
    ),
    organization = str_detect(author, "^\\p{L}[^,;&]*\\S$") &
      !str_detect(author, "\\s(\\p{Lu}\\.?-?){1,3}$|et al|…")
  ) |>
  filter(!person, !organization) |>
  distinct(.row, paper, paper_label, paper_authors)

# Find authors listed twice in the same paper
papers |>
  select(.row, paper, paper_label, paper_authors) |>
  mutate(author = paper_authors) |>
  separate_longer_delim(author, delim = "; ") |>
  filter(n() > 1, .by = c(.row, author)) |>
  distinct(.row, paper, paper_label, paper_authors)

# Find garbled characters in authors and titles, such as a loose diaeresis
# ("Ma¨ kela¨"), "€" for "ö", or a ligature ("ﬀ") from copying out of a PDF
papers |>
  filter(
    str_detect(paper_authors, "[¨´`€\\x{FB00}-\\x{FB06}\\x{FFFD}]") |
      str_detect(paper_title, "[¨´`€\\x{FB00}-\\x{FB06}\\x{FFFD}]")
  ) |>
  select(.row, paper, paper_label, paper_authors, paper_title)

# Validation: Study-level ------------------------------------------------

# Find columns in the codebook but not in the sheet, and the other way around
study_columns <- tibble(column = setdiff(names(studies), ".row")) |>
  mutate(position = row_number())
study_codebook_columns <- codebook_sheet_columns |>
  filter(sheet == "Study-level") |>
  select(column, position)

anti_join(study_codebook_columns, study_columns, by = "column")
anti_join(study_columns, study_codebook_columns, by = "column")

# Find columns that both have, but in a different order
inner_join(
  study_columns,
  study_codebook_columns,
  by = "column",
  suffix = c("_sheet", "_codebook")
) |>
  filter(rank(position_sheet) != rank(position_codebook))

check_formula_errors(study_sheet, studies)

study_cells <- codebook_cells(studies, "Study-level")
study_factors <- factor_levels(study_cells)

# Find required cells that are empty
study_cells |>
  filter(required, is.na(value)) |>
  select(.row, paper, column)

# Find number cells that aren't a number, aren't a whole number (for
# integers), or are outside the allowed range
study_cells |>
  filter(type %in% c("integer", "number"), !is.na(value), is.na(number)) |>
  select(.row, paper, column, value)

study_cells |>
  filter(type == "integer", number %% 1 != 0) |>
  select(.row, paper, column, value)

study_cells |>
  filter(number < min | number > max) |>
  select(.row, paper, column, value, min, max)

# Find links that don't start with http(s)://
study_cells |>
  filter(type == "url", !is.na(value), !str_detect(value, "^https?://")) |>
  select(.row, paper, column, value)

# Find levels that aren't in the codebook
study_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  count(column, level, sort = TRUE)

study_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  select(.row, paper, column, value)

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

# Find columns in the codebook but not in the sheet, and the other way around
condition_columns <- tibble(column = setdiff(names(conditions), ".row")) |>
  mutate(position = row_number())
condition_codebook_columns <- codebook_sheet_columns |>
  filter(sheet == "Condition-level") |>
  select(column, position)

anti_join(condition_codebook_columns, condition_columns, by = "column")
anti_join(condition_columns, condition_codebook_columns, by = "column")

# Find columns that both have, but in a different order
inner_join(
  condition_columns,
  condition_codebook_columns,
  by = "column",
  suffix = c("_sheet", "_codebook")
) |>
  filter(rank(position_sheet) != rank(position_codebook))

check_formula_errors(condition_sheet, conditions)

condition_cells <- codebook_cells(conditions, "Condition-level")
condition_factors <- factor_levels(condition_cells)

# Find required cells that are empty
condition_cells |>
  filter(required, is.na(value)) |>
  select(.row, paper, column)

# Find number cells that aren't a number, aren't a whole number (for
# integers), or are outside the allowed range
condition_cells |>
  filter(type %in% c("integer", "number"), !is.na(value), is.na(number)) |>
  select(.row, paper, column, value)

condition_cells |>
  filter(type == "integer", number %% 1 != 0) |>
  select(.row, paper, column, value)

condition_cells |>
  filter(number < min | number > max) |>
  select(.row, paper, column, value, min, max)

# Find levels that aren't in the codebook
condition_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  count(column, level, sort = TRUE)

condition_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  select(.row, paper, column, value)

check_duplicates(conditions, paper, study, condition)

# Find conditions of a study that isn't in Study-level
check_orphans(conditions, studies, by = c("paper", "study")) |>
  select(.row, paper, paper_label, study, condition)

# Find studies whose conditions aren't numbered 1, 2, 3, ...
check_sequence(conditions, condition, paper, study) |>
  select(.row, paper, paper_label, study, condition)

# Find conditions with the same label in a study, which makes them hard to
# tell apart in Statistics-level, Effects-level, and the app
check_duplicates(conditions, paper, study, condition_label) |>
  select(.row, paper, paper_label, study, condition, condition_label)

# Find interventions without a number of interventions, components,
# duration, mechanism, or medium
conditions |>
  filter(
    condition_category == "intervention",
    is.na(intervention_count) |
      is.na(intervention_multicomponent) |
      is.na(intervention_duration) |
      is.na(intervention_mechanism) |
      is.na(intervention_medium)
  ) |>
  select(
    .row,
    paper,
    paper_label,
    study,
    condition,
    intervention_count,
    intervention_multicomponent,
    intervention_duration,
    intervention_mechanism,
    intervention_medium
  )

# Find interventions whose components don't match their mechanisms: "yes"
# (multicomponent) with one mechanism, or "no" with more than one
conditions |>
  mutate(n_mechanisms = str_count(intervention_mechanism, ",") + 1) |>
  filter(
    intervention_multicomponent == "yes" &
      n_mechanisms == 1 |
      intervention_multicomponent == "no" & n_mechanisms > 1
  ) |>
  select(
    .row,
    paper,
    paper_label,
    study,
    condition,
    condition_label,
    intervention_multicomponent,
    intervention_mechanism
  )

# Find controls with intervention details, which only interventions have
conditions |>
  filter(
    condition_category == "control",
    !is.na(intervention_count) |
      !is.na(intervention_multicomponent) |
      !is.na(intervention_duration) |
      !is.na(intervention_mechanism) |
      !is.na(intervention_medium)
  ) |>
  select(
    .row,
    paper,
    paper_label,
    study,
    condition,
    condition_label,
    intervention_count,
    intervention_multicomponent,
    intervention_duration,
    intervention_mechanism,
    intervention_medium
  )

# Find study designs that differ from the study's design in Study-level,
# e.g. because the lookup formula was typed over
conditions |>
  left_join(
    select(studies, paper, study, study_design_study = study_design),
    by = c("paper", "study")
  ) |>
  filter(!is.na(study_design_study), study_design != study_design_study) |>
  select(.row, paper, paper_label, study, study_design, study_design_study)

# Validation: Outcome-level ----------------------------------------------

# Find columns in the codebook but not in the sheet, and the other way around
outcome_columns <- tibble(column = setdiff(names(outcomes), ".row")) |>
  mutate(position = row_number())
outcome_codebook_columns <- codebook_sheet_columns |>
  filter(sheet == "Outcome-level") |>
  select(column, position)

anti_join(outcome_codebook_columns, outcome_columns, by = "column")
anti_join(outcome_columns, outcome_codebook_columns, by = "column")

# Find columns that both have, but in a different order
inner_join(
  outcome_columns,
  outcome_codebook_columns,
  by = "column",
  suffix = c("_sheet", "_codebook")
) |>
  filter(rank(position_sheet) != rank(position_codebook))

check_formula_errors(outcome_sheet, outcomes)

outcome_cells <- codebook_cells(outcomes, "Outcome-level")
outcome_factors <- factor_levels(outcome_cells)

# Find required cells that are empty
outcome_cells |>
  filter(required, is.na(value)) |>
  select(.row, paper, column)

# Find number cells that aren't a number, aren't a whole number (for
# integers), or are outside the allowed range
outcome_cells |>
  filter(type %in% c("integer", "number"), !is.na(value), is.na(number)) |>
  select(.row, paper, column, value)

outcome_cells |>
  filter(type == "integer", number %% 1 != 0) |>
  select(.row, paper, column, value)

outcome_cells |>
  filter(number < min | number > max) |>
  select(.row, paper, column, value, min, max)

# Find levels that aren't in the codebook
outcome_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  count(column, level, sort = TRUE)

outcome_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  select(.row, paper, column, value)

# Find levels whose requires rule isn't met, e.g. product subtype "beef"
# without product type "meat" in the same row
outcome_factors |>
  select(.row, paper, column, level) |>
  inner_join(
    codebook_requires,
    by = c("column", "level" = "value"),
    relationship = "many-to-many"
  ) |>
  left_join(
    outcome_factors |>
      select(.row, other_column = column, other_level = level) |>
      mutate(found = TRUE),
    by = c(".row", "other_column", "other_level")
  ) |>
  summarise(
    ok = any(found %in% TRUE),
    allowed = paste(other_level, collapse = " or "),
    .by = c(.row, paper, column, level, other_column)
  ) |>
  filter(!ok) |>
  left_join(
    select(outcome_cells, .row, other_column = column, other_value = value),
    by = c(".row", "other_column")
  ) |>
  select(-ok)

check_duplicates(outcomes, paper, study, outcome, time)

# Find outcomes of a study that isn't in Study-level
check_orphans(outcomes, studies, by = c("paper", "study")) |>
  select(.row, paper, paper_label, study, outcome, time)

# Find outcomes whose times aren't numbered 1, 2, 3, ..., with negative
# numbers for baseline measurements and no 0
check_sequence(outcomes, time, paper, study, outcome, skip_zero = TRUE) |>
  select(.row, paper, paper_label, study, outcome, time, time_label)

# Find studies whose outcomes aren't numbered 1, 2, 3, ...
outcomes |>
  distinct(paper, paper_label, study, outcome) |>
  check_sequence(outcome, paper, study)

# Find outcomes with the same label in a study, which makes them hard to tell
# apart in Statistics-level, Effects-level, and the app
outcomes |>
  distinct(paper, paper_label, study, outcome, outcome_label) |>
  check_duplicates(paper, study, outcome_label)

# Find outcomes coded differently at different times, e.g. a different
# category at baseline than at follow-up. The description can differ, e.g. to
# say how a follow-up was measured.
outcomes |>
  select(
    paper,
    paper_label,
    study,
    outcome,
    outcome_label,
    outcome_expectation,
    outcome_category,
    outcome_subcategory,
    outcome_measurement_type,
    outcome_product_type,
    outcome_product_subtype,
    outcome_is_suboutcome,
    outcome_scale
  ) |>
  pivot_longer(
    -c(paper, paper_label, study, outcome),
    names_to = "column",
    values_transform = as.character
  ) |>
  summarise(
    values = paste(unique(value), collapse = " | "),
    n_values = n_distinct(value),
    .by = c(paper, paper_label, study, outcome, column)
  ) |>
  filter(n_values > 1) |>
  select(-n_values)

# Find days since the intervention where the minimum is above the maximum, or
# that don't match the time: baseline measurements (negative times) can't be
# after the intervention, and follow-ups (positive times) can't be before it
outcomes |>
  filter(
    outcome_days_since_intervention_min > outcome_days_since_intervention_max |
      time < 0 &
        (outcome_days_since_intervention_min > 0 |
          outcome_days_since_intervention_max > 0) |
      time > 0 &
        (outcome_days_since_intervention_min < 0 |
          outcome_days_since_intervention_max < 0)
  ) |>
  select(
    .row,
    paper,
    paper_label,
    outcome,
    time,
    time_label,
    outcome_days_since_intervention_min,
    outcome_days_since_intervention_max
  )

# Validation: Sample-level -----------------------------------------------

# Find columns in the codebook but not in the sheet, and the other way around
sample_columns <- tibble(column = setdiff(names(samples), ".row")) |>
  mutate(position = row_number())
sample_codebook_columns <- codebook_sheet_columns |>
  filter(sheet == "Sample-level") |>
  select(column, position)

anti_join(sample_codebook_columns, sample_columns, by = "column")
anti_join(sample_columns, sample_codebook_columns, by = "column")

# Find columns that both have, but in a different order
inner_join(
  sample_columns,
  sample_codebook_columns,
  by = "column",
  suffix = c("_sheet", "_codebook")
) |>
  filter(rank(position_sheet) != rank(position_codebook))

check_formula_errors(sample_sheet, samples)

sample_cells <- codebook_cells(samples, "Sample-level")
sample_factors <- factor_levels(sample_cells)

# Find required cells that are empty
sample_cells |>
  filter(required, is.na(value)) |>
  select(.row, paper, column)

# Find number cells that aren't a number, aren't a whole number (for
# integers), or are outside the allowed range
sample_cells |>
  filter(type %in% c("integer", "number"), !is.na(value), is.na(number)) |>
  select(.row, paper, column, value)

sample_cells |>
  filter(type == "integer", number %% 1 != 0) |>
  select(.row, paper, column, value)

sample_cells |>
  filter(number < min | number > max) |>
  select(.row, paper, column, value, min, max)

# Find levels that aren't in the codebook
sample_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  count(column, level, sort = TRUE)

sample_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  select(.row, paper, column, value)

check_duplicates(samples, paper, study, sample)

# Find samples of a study that isn't in Study-level
check_orphans(samples, studies, by = c("paper", "study")) |>
  select(.row, paper, paper_label, study, sample)

# Find studies without a "(total)" sample
check_orphans(
  distinct(studies, paper, paper_label, study),
  filter(samples, str_starts(sample_label, "\\(total\\)")),
  by = c("paper", "study")
)

# Find studies whose samples aren't numbered 1, 2, 3, ...
check_sequence(samples, sample, paper, study) |>
  select(.row, paper, paper_label, study, sample, sample_label)

# Find samples with the same label in a study, e.g. two "(total)" samples
# where one should be "(total) - follow-up"
check_duplicates(samples, paper, study, sample_label) |>
  select(.row, paper, paper_label, study, sample, sample_label)

# Read ages and gender percentages as numbers. Text like "60+" can't be
# compared and is already reported by the codebook checks.
samples_numbers <- samples |>
  mutate(
    across(
      c(starts_with("sample_age"), starts_with("sample_gender")),
      \(x) suppressWarnings(as.numeric(as_text(x)))
    )
  )

# Find ages where the minimum is above the mean or the maximum, or the mean
# above the maximum
samples_numbers |>
  filter(
    sample_age_min > sample_age_max |
      sample_age_mean < sample_age_min |
      sample_age_mean > sample_age_max
  ) |>
  select(
    .row,
    paper,
    paper_label,
    sample,
    sample_age_mean,
    sample_age_min,
    sample_age_max
  )

# Find samples whose gender percentages add up to more than 100, or whose
# gender counts add up to more than sample_n. Rounding can add up to 1.
samples_numbers |>
  mutate(
    gender_pct = rowSums(
      pick(sample_gender_f_pct, sample_gender_m_pct, sample_gender_other_pct),
      na.rm = TRUE
    ),
    gender_n = rowSums(
      pick(sample_gender_f_n, sample_gender_m_n, sample_gender_other_n),
      na.rm = TRUE
    )
  ) |>
  filter(gender_pct > 101 | gender_n > sample_n + 1) |>
  select(
    .row,
    paper,
    paper_label,
    sample,
    sample_n,
    starts_with("sample_gender"),
    gender_pct,
    gender_n
  )

# Find gender counts and percentages that don't match, e.g. 59 men out of 319
# (18.5%) coded as 22.7% men. Rounding can add up to 1 percentage point.
samples_numbers |>
  select(
    .row,
    paper,
    paper_label,
    sample,
    sample_n,
    starts_with("sample_gender")
  ) |>
  pivot_longer(
    starts_with("sample_gender"),
    names_to = c("gender", ".value"),
    names_pattern = "sample_gender_(.+)_(n|pct)"
  ) |>
  mutate(pct_from_n = n / sample_n * 100) |>
  filter(abs(pct_from_n - pct) > 1)

# Validation: Statistics-level -------------------------------------------

# Find columns in the codebook but not in the sheet, and the other way around
statistics_columns <- tibble(column = setdiff(names(statistics), ".row")) |>
  mutate(position = row_number())
statistics_codebook_columns <- codebook_sheet_columns |>
  filter(sheet == "Statistics-level") |>
  select(column, position)

anti_join(statistics_codebook_columns, statistics_columns, by = "column")
anti_join(statistics_columns, statistics_codebook_columns, by = "column")

# Find columns that both have, but in a different order
inner_join(
  statistics_columns,
  statistics_codebook_columns,
  by = "column",
  suffix = c("_sheet", "_codebook")
) |>
  filter(rank(position_sheet) != rank(position_codebook))

check_formula_errors(statistics_sheet, statistics)

statistics_cells <- codebook_cells(statistics, "Statistics-level")
statistics_factors <- factor_levels(statistics_cells)

# Find required cells that are empty
statistics_cells |>
  filter(required, is.na(value)) |>
  select(.row, paper, column)

# Find number cells that aren't a number, aren't a whole number (for
# integers), or are outside the allowed range
statistics_cells |>
  filter(type %in% c("integer", "number"), !is.na(value), is.na(number)) |>
  select(.row, paper, column, value)

statistics_cells |>
  filter(type == "integer", number %% 1 != 0) |>
  select(.row, paper, column, value)

statistics_cells |>
  filter(number < min | number > max) |>
  select(.row, paper, column, value, min, max)

# Find levels that aren't in the codebook
statistics_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  count(column, level, sort = TRUE)

statistics_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  select(.row, paper, column, value)

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

# Find statistics whose study, condition, sample, or outcome and time isn't in
# the sheet for that level. Empty ones are reported by the codebook checks.
check_orphans(statistics, studies, by = c("paper", "study")) |>
  select(.row, paper, paper_label, study, statistics)

check_orphans(
  filter(statistics, !is.na(condition)),
  conditions,
  by = c("paper", "study", "condition")
) |>
  select(.row, paper, paper_label, study, statistics, condition)

check_orphans(
  filter(statistics, !is.na(sample)),
  samples,
  by = c("paper", "study", "sample")
) |>
  select(.row, paper, paper_label, study, statistics, sample)

check_orphans(
  filter(statistics, !is.na(outcome), !is.na(time_1)),
  outcomes,
  by = c("paper", "study", "outcome", "time_1" = "time")
) |>
  select(.row, paper, paper_label, study, statistics, outcome, time_1)

check_orphans(
  filter(statistics, !is.na(time_2)),
  outcomes,
  by = c("paper", "study", "outcome", "time_2" = "time")
) |>
  select(.row, paper, paper_label, study, statistics, outcome, time_2)

# Find change scores whose baseline (time_2) isn't before time_1
statistics |>
  filter(time_2 >= time_1) |>
  select(.row, paper, paper_label, statistics, outcome, time_1, time_2)

# Find papers whose statistics groups aren't numbered 1, 2, 3, ...
statistics |>
  distinct(paper, paper_label, statistics) |>
  filter(!is.na(statistics)) |>
  check_sequence(statistics, paper)

# Find statistics groups whose statistics aren't numbered 1, 2, 3, ...
check_sequence(statistics, statistic, paper, statistics) |>
  select(.row, paper, paper_label, statistics, statistic)

# Find percentages below 0 or above 100
statistics |>
  filter(
    statistic_name == "percentage",
    statistic_value < 0 | statistic_value > 100
  ) |>
  select(.row, paper, paper_label, statistics, statistic_value)

# Find counts from the paper (n, successes, failures) that aren't whole
# numbers. Calculated or estimated counts can have decimals, but then
# statistic_from_paper should be "no" or "approx.".
statistics |>
  filter(
    statistic_name %in% c("n", "successes", "failures"),
    statistic_from_paper == "yes",
    statistic_value %% 1 != 0
  ) |>
  select(.row, paper, paper_label, statistics, statistic_name, statistic_value)

# Find statistics groups with a mean that lack n or an SD or SE, or with an
# SD or SE but no mean or regression coefficient (beta)
statistics |>
  filter(!is.na(statistic_name)) |>
  summarise(
    statistic_names = paste(sort(statistic_name), collapse = ", "),
    has_m = "M" %in% statistic_name,
    has_n = "n" %in% statistic_name,
    has_spread = any(c("SD", "SE") %in% statistic_name),
    has_beta = "beta" %in% statistic_name,
    .by = c(paper, paper_label, study, statistics)
  ) |>
  filter(has_m & (!has_n | !has_spread) | has_spread & !has_m & !has_beta) |>
  select(paper, paper_label, study, statistics, statistic_names)

# Find statistics groups with successes, failures, or a percentage that lack
# one of the four (successes, failures, n, percentage), or where they don't
# add up: successes + failures should be n, and successes / n the percentage.
# Rounding can add up to 0.5 to the count and 1 to the percentage, e.g. when
# successes were calculated from a reported percentage.
statistics |>
  filter(statistic_name %in% c("percentage", "successes", "failures", "n")) |>
  pivot_wider(
    id_cols = c(paper, paper_label, study, statistics),
    names_from = statistic_name,
    values_from = statistic_value,
    values_fn = \(x) if (length(x) == 1) x else NA_real_
  ) |>
  filter(!is.na(percentage) | !is.na(successes) | !is.na(failures)) |>
  filter(
    is.na(successes) |
      is.na(failures) |
      is.na(n) |
      is.na(percentage) |
      abs(successes + failures - n) > 0.5 |
      abs(successes / n * 100 - percentage) > 1
  )

# Find statistics groups with an estimated value (statistic_from_paper
# "approx.") but no note in the group that says how it was estimated
statistics |>
  filter(
    any(statistic_from_paper %in% "approx."),
    all(is.na(statistic_notes)),
    .by = c(paper, statistics)
  ) |>
  distinct(paper, paper_label, study, statistics)

# Validation: Effects-level ----------------------------------------------

# Find columns in the codebook but not in the sheet, and the other way around
effects_columns <- tibble(column = setdiff(names(effects), ".row")) |>
  mutate(position = row_number())
effects_codebook_columns <- codebook_sheet_columns |>
  filter(sheet == "Effects-level") |>
  select(column, position)

anti_join(effects_codebook_columns, effects_columns, by = "column")
anti_join(effects_columns, effects_codebook_columns, by = "column")

# Find columns that both have, but in a different order
inner_join(
  effects_columns,
  effects_codebook_columns,
  by = "column",
  suffix = c("_sheet", "_codebook")
) |>
  filter(rank(position_sheet) != rank(position_codebook))

check_formula_errors(effects_sheet, effects)

effects_cells <- codebook_cells(effects, "Effects-level")
effects_factors <- factor_levels(effects_cells)

# Find required cells that are empty
effects_cells |>
  filter(required, is.na(value)) |>
  select(.row, paper, column)

# Find number cells that aren't a number, aren't a whole number (for
# integers), or are outside the allowed range
effects_cells |>
  filter(type %in% c("integer", "number"), !is.na(value), is.na(number)) |>
  select(.row, paper, column, value)

effects_cells |>
  filter(type == "integer", number %% 1 != 0) |>
  select(.row, paper, column, value)

effects_cells |>
  filter(number < min | number > max) |>
  select(.row, paper, column, value, min, max)

# Find levels that aren't in the codebook
effects_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  count(column, level, sort = TRUE)

effects_factors |>
  anti_join(codebook_levels, by = c("column", "level" = "value")) |>
  select(.row, paper, column, value)

check_duplicates(effects, paper, effect) |>
  select(.row, paper, paper_label, effect)

# Find papers whose effects aren't numbered 1, 2, 3, ...
effects |>
  distinct(paper, paper_label, effect) |>
  check_sequence(effect, paper)

# Find effects that refer to a statistics group that isn't in
# Statistics-level
effects |>
  select(
    .row,
    paper,
    paper_label,
    effect,
    intervention_statistics_1,
    intervention_statistics_2,
    control_statistics_1,
    control_statistics_2
  ) |>
  pivot_longer(
    -c(.row, paper, paper_label, effect),
    names_to = "column",
    values_to = "statistics",
    values_drop_na = TRUE
  ) |>
  check_orphans(statistics, by = c("paper", "statistics"))

# Find effects whose study, outcome, conditions, times, or samples differ from
# those of their statistics groups (intervention_statistics_1 and
# control_statistics_1), e.g. because a lookup formula was typed over
statistics_groups <- statistics |>
  distinct(paper, statistics, study, outcome, time_1, condition, sample)

effects |>
  left_join(
    rename_with(statistics_groups, \(x) paste0(x, "_i"), -paper),
    by = c("paper", "intervention_statistics_1" = "statistics_i")
  ) |>
  left_join(
    rename_with(statistics_groups, \(x) paste0(x, "_c"), -paper),
    by = c("paper", "control_statistics_1" = "statistics_c")
  ) |>
  filter(
    study != study_i |
      study != study_c |
      outcome != outcome_i |
      outcome != outcome_c |
      intervention_condition != condition_i |
      intervention_time_1 != time_1_i |
      intervention_sample != sample_i |
      control_condition != condition_c |
      control_time_1 != time_1_c |
      control_sample != sample_c
  ) |>
  select(
    .row,
    paper,
    paper_label,
    effect,
    intervention_statistics_1,
    control_statistics_1,
    study,
    study_i,
    study_c,
    outcome,
    outcome_i,
    outcome_c,
    intervention_condition,
    condition_i,
    control_condition,
    condition_c,
    intervention_time_1,
    time_1_i,
    control_time_1,
    time_1_c,
    intervention_sample,
    sample_i,
    control_sample,
    sample_c
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
    .row,
    paper,
    paper_label,
    effect,
    effect_size_name,
    intervention_statistics_1,
    control_statistics_1
  )

# Find effects in the meta-analysis whose intervention side isn't an
# intervention condition
effects |>
  filter(effect_exclude == "no") |>
  check_orphans(
    filter(conditions, condition_category == "intervention"),
    by = c("paper", "study", "intervention_condition" = "condition")
  ) |>
  select(.row, paper, paper_label, effect, intervention_condition)

# Find effects in the meta-analysis of a kind it doesn't use: only OR2DL,
# OR2DL DiD, SMCC, SMD, SMD DiD, and g are pooled
effects |>
  filter(
    effect_exclude == "no",
    !effect_size_name %in%
      c("OR2DL", "OR2DL DiD", "SMCC", "SMD", "SMD DiD", "g")
  ) |>
  select(.row, paper, paper_label, effect, effect_size_name)

# Find excluded effects without a note that says why
effects |>
  filter(effect_exclude == "yes", is.na(effect_notes)) |>
  select(.row, paper, paper_label, effect, effect_size_name)

# Find effect sizes outside their confidence interval, or intervals whose
# lower bound is above the upper bound
effects |>
  filter(
    effect_size < effect_size_lower |
      effect_size > effect_size_upper |
      effect_size_lower > effect_size_upper
  ) |>
  select(
    .row,
    paper,
    paper_label,
    effect,
    effect_size,
    effect_size_lower,
    effect_size_upper
  )

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
  distinct(paper, statistics)

effects |>
  filter(effect_exclude == "no") |>
  check_orphans(
    n_statistics,
    by = c("paper", "intervention_statistics_1" = "statistics")
  ) |>
  select(.row, paper, paper_label, effect, intervention_statistics_1)

effects |>
  filter(effect_exclude == "no") |>
  check_orphans(
    n_statistics,
    by = c("paper", "control_statistics_1" = "statistics")
  ) |>
  select(.row, paper, paper_label, effect, control_statistics_1)

# Validation: Paper status -----------------------------------------------

# Keep the effects that still count towards a paper: "maybe" and missing are
# not exclusions, so only an explicit "yes" removes an effect from the pool
effects_kept <- effects |>
  filter(!(effect_exclude %in% "yes"))

# Find included papers that aren't coded all the way down
check_status_missing_rows(papers, studies, "included")
check_status_missing_rows(papers, samples, "included")
check_status_missing_rows(papers, conditions, "included")
check_status_missing_rows(papers, outcomes, "included")
check_status_missing_rows(papers, statistics, "included")
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
