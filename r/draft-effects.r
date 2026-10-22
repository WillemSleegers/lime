# Draft new Effects-level rows for a paper whose statistics are coded but whose
# effects aren't yet. See .claude/skills/draft-effects/SKILL.md.
#
# Command line:
#   Rscript r/draft-effects.r <paper>
#     lists the paper's statistics groups, to decide which ones to compare
#   Rscript r/draft-effects.r <paper> <comparisons.csv>
#     also calculates the effects in comparisons.csv and writes them to
#     r/output/<paper>-effects.csv
#
# comparisons.csv has one row per effect with effect,
# intervention_statistics_1, control_statistics_1, and effect_size_name, and
# where needed intervention_statistics_2, control_statistics_2, effect_r,
# effect_exclude, and effect_notes. A reported effect (effect_from_paper "yes")
# also has the effect_* values the paper gives.

# Setup -------------------------------------------------------------------

library(tidyverse)
library(googlesheets4)

source("r/effect-functions.r")

args <- commandArgs(trailingOnly = TRUE)
paper_number <- as.numeric(args[1])
comparisons_path <- args[2]

# Read the sheet ----------------------------------------------------------

gs4_auth(email = "*@me.com")

url <- "https://docs.google.com/spreadsheets/"
url_id <- "d/1asBfkq4AkTtdcb_yZTkN685LVeV5DYHNrO83g9N5HCU/"

studies <- read_sheet(
  paste0(url, url_id),
  sheet = "Study-level",
  na = c("", "-")
) |>
  filter(!is.na(paper))

statistics <- read_sheet(
  paste0(url, url_id),
  sheet = "Statistics-level",
  na = c("", "-")
) |>
  filter(!is.na(paper))

effects <- read_sheet(
  paste0(url, url_id),
  sheet = "Effects-level",
  na = c("", "-")
) |>
  filter(!is.na(paper))

# List the statistics groups ----------------------------------------------

# Show each study's design, which decides the kind of comparison
studies |>
  filter(paper == paper_number) |>
  select(study, study_n, study_design, study_condition_assignment) |>
  print(width = Inf)

# Show one row per statistics group with the statistics it holds, e.g.
# "n, successes, failures" or "n, M, SD"
statistics |>
  filter(paper == paper_number) |>
  summarise(
    statistic_names = paste(statistic_name, collapse = ", "),
    n = statistic_value[statistic_name == "n"][1],
    .by = c(
      statistics,
      study,
      outcome,
      outcome_label,
      time_1,
      time_1_label,
      condition,
      condition_label,
      condition_category,
      sample
    )
  ) |>
  print(n = Inf, width = Inf)

# Find effects the paper already has, which the new rows would have to fit
# around
effects |>
  filter(paper == paper_number) |>
  select(effect, intervention_statistics_1, control_statistics_1) |>
  print(n = Inf)

if (is.na(comparisons_path)) {
  quit(save = "no")
}

# Calculate the comparisons -----------------------------------------------

comparisons <- read_csv(comparisons_path, show_col_types = FALSE)

# Take study and outcome from the intervention's statistics group, and add the
# remaining Effects-level columns empty, so the output pastes straight in. The
# formula columns (outcome_label up to control_sample) stay empty too.
drafted <- comparisons |>
  mutate(paper = paper_number) |>
  left_join(
    distinct(statistics, paper, statistics, study, outcome),
    by = c("paper", "intervention_statistics_1" = "statistics")
  ) |>
  mutate(across(any_of("effect_p"), as.character))
drafted <- effects[0, ] |>
  mutate(effect_p = character()) |>
  bind_rows(drafted) |>
  mutate(
    effect_from_paper = coalesce(effect_from_paper, "no"),
    effect_exclude = coalesce(effect_exclude, "no")
  )

calculated <- calculate_effects(drafted, statistics) |>
  mutate(effect_p = as.character(effect_p))

# Keep the rows that can't be calculated from statistics as given, e.g. a
# reported d
results <- drafted |>
  anti_join(calculated, by = "effect") |>
  bind_rows(calculated)

# Add a converted g for each reported odds ratio, and pool that one instead of
# the odds ratio
converted <- results |>
  convert_reported_or() |>
  mutate(
    effect = max(results$effect) + row_number(),
    effect_p = as.character(effect_p)
  )
results <- results |>
  mutate(
    effect_exclude = if_else(effect_size_name == "OR", "yes", effect_exclude),
    effect_notes = if_else(
      effect_size_name == "OR",
      "Converted to g, which is pooled instead",
      effect_notes
    )
  ) |>
  bind_rows(converted) |>
  arrange(effect)

results |>
  select(
    effect,
    intervention_statistics_1,
    intervention_statistics_2,
    control_statistics_1,
    control_statistics_2,
    effect_size_name,
    effect_size,
    effect_size_lower,
    effect_size_upper,
    effect_analysis,
    effect_p,
    effect_exclude
  ) |>
  print(n = Inf, width = Inf)

# Find effects that have no effect size, e.g. because a statistics group lacks
# the SD or the failures
results |>
  filter(is.na(effect_size)) |>
  select(effect, effect_size_name, intervention_statistics_1, control_statistics_1) |>
  print(n = Inf)

# Find effects that compare a statistics group with itself
results |>
  filter(intervention_statistics_1 == control_statistics_1) |>
  select(effect, intervention_statistics_1, control_statistics_1) |>
  print(n = Inf)

write_effects(
  results,
  file.path("r", "output", paste0(paper_number, "-effects.csv"))
)
