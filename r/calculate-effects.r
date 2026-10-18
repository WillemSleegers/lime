# Calculate effect sizes from the descriptive statistics in the sheet.
#
# Interactive: run Setup, then the "Run" section with `papers` set. The
# calculations themselves are in r/effect-functions.r.
# Command line: Rscript r/calculate-effects.r [paper ...]
# Without papers, every pooled effect (effect_exclude "no") that has no effect
# size yet is calculated. Results are written to r/output/.

# Setup -------------------------------------------------------------------

library(tidyverse)
library(googlesheets4)

source("r/effect-functions.r")

# Run ---------------------------------------------------------------------

gs4_auth(email = "*@me.com")

url <- "https://docs.google.com/spreadsheets/"
url_id <- "d/1asBfkq4AkTtdcb_yZTkN685LVeV5DYHNrO83g9N5HCU/"

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

papers <- as.numeric(commandArgs(trailingOnly = TRUE))

to_calculate <- if (length(papers) > 0) {
  filter(effects, paper %in% papers)
} else {
  filter(effects, !is.na(paper), is.na(effect_size), effect_exclude %in% "no")
}

results <- calculate_effects(to_calculate, statistics)
print(results, n = Inf, width = Inf)
write_effects(results)

# Effects that none of the functions can calculate, e.g. a reported d or eta
# squared
to_calculate |>
  anti_join(results, by = c("paper", "study", "outcome", "effect")) |>
  select(paper, paper_label, effect, effect_size_name, effect_analysis) |>
  print(n = Inf)
