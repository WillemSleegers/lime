# Setup -------------------------------------------------------------------

library(tidyverse)
library(googlesheets4)
library(btw)

btw_mcp_session()

# Validation functions ----------------------------------------------------

check_factor_levels <- function(
  data,
  factor_levels,
  id_cols = c("paper", "paper_label")
) {
  data |>
    select(all_of(id_cols), unique(factor_levels$column)) |>
    pivot_longer(-all_of(id_cols), names_to = "column", values_to = "value") |>
    filter(!is.na(value)) |>
    anti_join(factor_levels, by = c("column", "value" = "allowed"))
}

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

check_year_range <- function(data, column, min = 1950, max = 2026) {
  data |>
    filter(!is.na({{ column }}), {{ column }} < min | {{ column }} > max)
}

check_url_format <- function(data, column) {
  data |>
    filter(!is.na({{ column }}), !str_detect({{ column }}, "^https?://"))
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

# Import data -------------------------------------------------------------

url <- "https://docs.google.com/spreadsheets/"
url_id <- "d/1asBfkq4AkTtdcb_yZTkN685LVeV5DYHNrO83g9N5HCU/"

papers <- read_sheet(
  paste0(url, url_id),
  sheet = "Paper-level",
  na = c("", "-")
)

studies <- read_sheet(
  paste0(url, url_id),
  sheet = "Study-level",
  na = c("", "-")
)

samples <- read_sheet(
  paste0(url, url_id),
  sheet = "Sample-level",
  na = c("", "-")
)

conditions <- read_sheet(
  paste0(url, url_id),
  sheet = "Condition-level",
  na = c("", "-")
)

outcomes <- read_sheet(
  paste0(url, url_id),
  sheet = "Outcome-level",
  na = c("", "-")
)

statistics <- read_sheet(
  paste0(url, url_id),
  sheet = "Statistics-level",
  na = c("", "-")
)

effects <- read_sheet(
  paste0(url, url_id),
  sheet = "Effects-level",
  na = c("", "-")
)

glimpse(papers)
glimpse(studies)
glimpse(samples)
glimpse(conditions)
glimpse(outcomes)
glimpse(statistics)
glimpse(effects)

# Validation: Paper-level ------------------------------------------------

paper_factor_levels <- list(
  paper_status = c(
    "included",
    "excluded",
    "contact authors",
    "calculate effect sizes",
    "analyze raw data",
    "unscreened",
    "ready to code",
    "add to website"
  ),
  paper_type = c(
    "peer reviewed paper",
    "report",
    "thesis",
    "unpublished manuscript",
    "preprint",
    "conference paper"
  ),
  paper_open_access = c("paywalled", "open access", "inaccessible"),
  paper_extracted_all_statistics = c("no", "yes")
) |>
  enframe(name = "column", value = "allowed") |>
  unnest(allowed)

check_factor_levels(papers, paper_factor_levels)

check_duplicates(papers, paper)
check_duplicates(papers, paper_label)
papers |>
  mutate(
    paper_title_normalized = str_to_lower(
      str_remove_all(paper_title, "[^a-z0-9 ]")
    )
  ) |>
  check_duplicates(paper_title_normalized)
check_duplicates(papers, paper_link) |> print(n = Inf)
check_duplicates(papers, paper_link, na.rm = TRUE)

check_year_range(papers, paper_year, min = 1950, max = 2026)

check_url_format(papers, paper_link)

check_missing(papers)

# Validation: Study-level ------------------------------------------------

study_factor_levels <- list(
  study_preregistered = c("yes", "no"),
  study_data_available = c("yes", "no"),
  study_design = c("between", "within", "mixed", "crossover"),
  study_condition_assignment = c("individual", "time point", "cluster"),
  study_randomization = c("yes", "no")
) |>
  enframe(name = "column", value = "allowed") |>
  unnest(allowed)

check_factor_levels(
  studies,
  study_factor_levels,
  id_cols = c("paper", "paper_label", "study")
)

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

check_url_format(studies, study_preregistration_link)
check_url_format(studies, study_data_link)

check_missing(studies)

# Validation: Condition-level --------------------------------------------

condition_factor_levels <- list(
  condition_category = c("control", "intervention"),
  intervention_multicomponent = c("yes", "no"),
  intervention_mechanism = c(
    "authority/role models",
    "choice architecture: availability/variety/size",
    "choice architecture: default",
    "choice architecture: visibility/salience/ease",
    "emotions: negative",
    "emotions: positive",
    "goal pursuit: cooking skills",
    "goal pursuit: efficacy/consequences/feedback",
    "goal pursuit: food provision",
    "goal pursuit: planning/pledge/reminder",
    "identity/reputation",
    "info: animal welfare",
    "info: environment",
    "info: health",
    "info: taste/disgust",
    "logical argument",
    "norms: descriptive",
    "norms: dynamic",
    "origin of animal product",
    "other",
    "perspective taking/individuation",
    "price",
    "priming",
    "taste"
  ),
  intervention_medium = c(
    "text",
    "presentation",
    "video",
    "3D video",
    "image",
    "choice architecture",
    "in-person",
    "label",
    "price",
    "other"
  )
) |>
  enframe(name = "column", value = "allowed") |>
  unnest(allowed)

check_factor_levels(
  conditions,
  filter(
    condition_factor_levels,
    column %in% c("condition_category", "intervention_multicomponent")
  ),
  id_cols = c("paper", "paper_label", "study", "condition")
)

# intervention_mechanism and intervention_medium are multi-value columns, so
# split comma-separated entries before checking against allowed factor levels
conditions |>
  select(
    paper,
    paper_label,
    study,
    condition,
    intervention_mechanism,
    intervention_medium
  ) |>
  pivot_longer(
    -c(paper, paper_label, study, condition),
    names_to = "column",
    values_to = "value"
  ) |>
  filter(!is.na(value)) |>
  separate_rows(value, sep = ", ") |>
  anti_join(
    filter(
      condition_factor_levels,
      column %in% c("intervention_mechanism", "intervention_medium")
    ),
    by = c("column", "value" = "allowed")
  )

check_duplicates(conditions, paper, study, condition)

check_formula_errors(paste0(url, url_id), "Condition-level")

check_sequence(conditions, condition, paper, study)

check_missing(conditions)
check_missing(filter(conditions, condition_category == "intervention"))

conditions |>
  filter(condition_category == "intervention") |>
  filter(is.na(intervention_medium))

# Validation: Outcome-level ----------------------------------------------

outcome_factor_levels <- list(
  outcome_expectation = c("increase", "decrease", "neither"),
  outcome_category = c("behavior", "attitudes/beliefs", "intentions"),
  outcome_measurement_type = c(
    "survey",
    "food diary",
    "sales data",
    "meal choice"
  ),
  outcome_subcategory = c(
    "animal attitude",
    "animal product consumption",
    "animal product intentions",
    "diet intentions",
    "dairy consumption",
    "diet",
    "donation",
    "egg consumption",
    "ethical consumption",
    "meat attitude",
    "meat belief",
    "meat commitment",
    "meat consumption",
    "meat consumption intentions",
    "meat hedonics",
    "moral judgment",
    "other",
    "signing a petition",
    "vegan consumption",
    "vegan hedonics",
    "vegan consumption intentions",
    "vegetarian attitude",
    "vegetarian consumption",
    "vegetarian consumption intentions",
    "vegetarian identity",
    "vegetarian hedonics"
  ),
  outcome_product_type = c("meat", "eggs", "dairy"),
  outcome_product_subtype = c(
    "red meat",
    "white meat",
    "pork",
    "processed meat",
    "poultry",
    "fish",
    "beef",
    "chicken",
    "turkey",
    "dairy",
    "lamb",
    "seafood",
    "red and processed meat",
    "shrimp",
    "cheese",
    "yoghurt",
    "milk"
  )
) |>
  enframe(name = "column", value = "allowed") |>
  unnest(allowed)

check_factor_levels(
  outcomes,
  filter(
    outcome_factor_levels,
    column %in%
      c(
        "outcome_expectation",
        "outcome_category",
        "outcome_subcategory",
        "outcome_measurement_type"
      )
  ),
  id_cols = c("paper", "paper_label", "study", "time", "outcome")
)

outcomes |>
  select(
    paper,
    paper_label,
    study,
    time,
    outcome,
    outcome_product_type,
    outcome_product_subtype
  ) |>
  pivot_longer(
    -c(paper, paper_label, study, time, outcome),
    names_to = "column",
    values_to = "value"
  ) |>
  filter(!is.na(value)) |>
  separate_rows(value, sep = ", ") |>
  anti_join(
    filter(
      outcome_factor_levels,
      column %in% c("outcome_product_type", "outcome_product_subtype")
    ),
    by = c("column", "value" = "allowed")
  )

# Flag subcategories assigned to more than one outcome category (e.g. "diet" under both "behavior" and "attitudes/beliefs")
outcomes |>
  distinct(outcome_subcategory, outcome_category) |>
  check_duplicates_across(outcome_subcategory, outcome_category, na.rm = TRUE)

check_duplicates(outcomes, paper, study, outcome, time)

check_formula_errors(paste0(url, url_id), "Outcome-level")

# Time within each outcome should sequence (allow negative baseline, skip 0)
check_sequence(outcomes, time, paper, study, outcome, skip_zero = TRUE)

# Distinct outcomes within each (paper, study) should sequence from 1
outcomes |>
  distinct(paper, study, outcome) |>
  check_sequence(outcome, paper, study)

check_missing(outcomes)

# TODO: Add check where certain values can only appear when another column has another value, Poultry as a subtype can only appear when type is meat, for example

# Validation: Sample-level -----------------------------------------------

sample_factor_levels <- list(
  sample_representative = c("yes", "no"),
  sample_type = c("public", "university", "children", "panel")
) |>
  enframe(name = "column", value = "allowed") |>
  unnest(allowed)

check_factor_levels(
  samples,
  filter(sample_factor_levels, column == "sample_representative"),
  id_cols = c("paper", "paper_label", "study", "sample")
)

samples |>
  select(paper, paper_label, study, sample, sample_type) |>
  pivot_longer(
    -c(paper, paper_label, study, sample),
    names_to = "column",
    values_to = "value"
  ) |>
  filter(!is.na(value)) |>
  separate_rows(value, sep = ", ") |>
  anti_join(
    filter(sample_factor_levels, column == "sample_type"),
    by = c("column", "value" = "allowed")
  )

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

statistic_factor_levels <- list(
  condition_category = c("control", "intervention"),
  statistic_name = c(
    "successes",
    "failures",
    "n",
    "percentage",
    "M",
    "SD",
    "SE",
    "beta"
  ),
  statistic_from_paper = c("yes", "no", "approx.")
) |>
  enframe(name = "column", value = "allowed") |>
  unnest(allowed)

check_factor_levels(
  statistics,
  statistic_factor_levels,
  id_cols = c(
    "paper",
    "paper_label",
    "study",
    "outcome",
    "time_1",
    "time_2",
    "sample",
    "sample_label",
    "condition",
    "statistic"
  )
)

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

effect_factor_levels <- list(
  effect_size_name = c(
    "SMD",
    "SMCC",
    "OR2DL",
    "OR",
    "g",
    "d",
    "eta squared",
    "partial eta squared"
  ),
  effect_analysis = c(
    "ANCOVA",
    "ANOVA",
    "Fisher's exact test",
    "Logistic regression",
    "MANCOVA",
    "Meta-analytic estimate",
    "Mixed regression model",
    "One-sample t-test",
    "Paired-sample t-test",
    "Pearson's Chi-squared test",
    "Planned contrast",
    "Welch's two-sample t-test"
  ),
  effect_statistic_name = c("t", "F", "chi squared", "z"),
  effect_from_paper = c("yes", "no"),
  effect_exclude = c("yes", "no", "maybe")
) |>
  enframe(name = "column", value = "allowed") |>
  unnest(allowed)

check_factor_levels(
  effects,
  effect_factor_levels,
  id_cols = c(
    "paper_label",
    "study",
    "outcome",
    "intervention_condition",
    "intervention_time",
    "control_condition",
    "control_time",
    "effect"
  )
)

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
  by = c("paper", "study", "outcome", "intervention_statistics_1" = "statistics")
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
