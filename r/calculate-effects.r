# Calculate effect sizes from the descriptive statistics in the sheet.
#
# Interactive: run the functions, then the "Run" section with `papers` set.
# Command line: Rscript r/calculate-effects.r [paper ...]
# Without papers, every pooled effect (effect_exclude "no") that has no effect
# size yet is calculated. Results are written to r/output/.

# Setup -------------------------------------------------------------------

library(tidyverse)
library(googlesheets4)
library(metafor)

# Statistics --------------------------------------------------------------

widen_statistics <- function(statistics) {
  statistics |>
    filter(!is.na(paper), !is.na(statistics), !is.na(statistic_name)) |>
    pivot_wider(
      id_cols = c(paper, statistics),
      names_from = statistic_name,
      values_from = statistic_value,
      values_fn = \(x) if (length(x) == 1) x else NA_real_
    ) |>
    mutate(SD = coalesce(SD, SE * sqrt(n))) |>
    select(paper, statistics, M, SD, n, successes, failures)
}

# Adds i1_*, c1_*, i2_*, c2_* columns (M, SD, n, successes, failures) for the
# intervention and control statistics groups of each effect
attach_statistics <- function(effects, statistics) {
  wide <- widen_statistics(statistics)

  join_group <- function(data, column, prefix) {
    group <- rename_with(
      wide,
      \(x) paste0(prefix, "_", x),
      -c(paper, statistics)
    )
    left_join(data, group, by = c("paper", set_names("statistics", column)))
  }

  effects |>
    join_group("intervention_statistics_1", "i1") |>
    join_group("control_statistics_1", "c1") |>
    join_group("intervention_statistics_2", "i2") |>
    join_group("control_statistics_2", "c2")
}

# Effect sizes ------------------------------------------------------------

effect_size_columns <- function(es) {
  s <- summary(es)
  tibble(
    effect_size = s$yi,
    effect_size_lower = s$ci.lb,
    effect_size_upper = s$ci.ub,
    effect_size_var = s$vi,
    effect_size_se = s$sei
  )
}

calculate_smd <- function(data) {
  es <- escalc(
    "SMD",
    m1i = data$i1_M,
    sd1i = data$i1_SD,
    n1i = data$i1_n,
    m2i = data$c1_M,
    sd2i = data$c1_SD,
    n2i = data$c1_n
  )

  v1 <- data$i1_SD^2 / data$i1_n
  v2 <- data$c1_SD^2 / data$c1_n
  t <- (data$i1_M - data$c1_M) / sqrt(v1 + v2)
  df <- (v1 + v2)^2 / (v1^2 / (data$i1_n - 1) + v2^2 / (data$c1_n - 1))

  effect_size_columns(es) |>
    mutate(
      effect_analysis = "Welch's two-sample t-test",
      effect_statistic_name = "t",
      effect_statistic_value = t,
      effect_df = df,
      effect_p = 2 * pt(-abs(t), df)
    )
}

# Positive = intervention has higher odds of success than control. escalc
# adds 1/2 to all cells when a cell is zero (Haldane-Anscombe).
calculate_or2dl <- function(data) {
  es <- escalc(
    "OR2DL",
    ai = data$i1_successes,
    bi = data$i1_failures,
    ci = data$c1_successes,
    di = data$c1_failures
  )

  p <- pmap_dbl(
    list(
      data$i1_successes,
      data$i1_failures,
      data$c1_successes,
      data$c1_failures
    ),
    \(a, b, c, d) {
      if (anyNA(c(a, b, c, d))) {
        return(NA_real_)
      }
      fisher.test(matrix(c(a, b, c, d), nrow = 2))$p.value
    }
  )

  effect_size_columns(es) |>
    mutate(
      effect_analysis = "Fisher's exact test",
      effect_statistic_name = NA_character_,
      effect_statistic_value = NA_real_,
      effect_df = NA_real_,
      effect_p = p
    )
}

# With effect_r: paired comparison of the intervention and control groups
# (e.g. post vs. pre). Without: one-sample test of the intervention group's
# change score against 0. Standardized by the SD of the change scores.
calculate_smcc <- function(data) {
  paired <- !is.na(data$effect_r)
  m2 <- if_else(paired, data$c1_M, 0)
  sd2 <- if_else(paired, data$c1_SD, 0)
  r <- if_else(paired, data$effect_r, 0)

  es <- escalc(
    "SMCC",
    m1i = data$i1_M,
    sd1i = data$i1_SD,
    m2i = m2,
    sd2i = sd2,
    ni = data$i1_n,
    ri = r
  )

  sd_change <- sqrt(data$i1_SD^2 + sd2^2 - 2 * r * data$i1_SD * sd2)
  t <- (data$i1_M - m2) / (sd_change / sqrt(data$i1_n))
  df <- data$i1_n - 1

  effect_size_columns(es) |>
    mutate(
      effect_analysis = if_else(
        paired,
        "Paired-sample t-test",
        "One-sample t-test"
      ),
      effect_statistic_name = "t",
      effect_statistic_value = t,
      effect_df = df,
      effect_p = 2 * pt(-abs(t), df)
    )
}

# Difference-in-differences on a 2x2 set of successes/failures:
# (log OR intervention _1 vs _2) - (log OR control _1 vs _2), converted from
# the logit scale to d with sqrt(3) / pi, tested with a Wald chi-squared.
calculate_did_logit <- function(data) {
  log_odds <- function(prefix) {
    data[[paste0(prefix, "_successes")]] / data[[paste0(prefix, "_failures")]]
  }
  cell_var <- function(prefix) {
    1 /
      data[[paste0(prefix, "_successes")]] +
      1 / data[[paste0(prefix, "_failures")]]
  }

  did <- (log(log_odds("i1")) - log(log_odds("i2"))) -
    (log(log_odds("c1")) - log(log_odds("c2")))
  v <- cell_var("i1") + cell_var("i2") + cell_var("c1") + cell_var("c2")
  k <- sqrt(3) / pi
  chi2 <- did^2 / v

  tibble(
    effect_size = did * k,
    effect_size_lower = (did - qnorm(0.975) * sqrt(v)) * k,
    effect_size_upper = (did + qnorm(0.975) * sqrt(v)) * k,
    effect_size_var = v * k^2,
    effect_size_se = sqrt(v) * k,
    effect_analysis = "Logistic regression",
    effect_statistic_name = "chi squared",
    effect_statistic_value = chi2,
    effect_df = 1,
    effect_p = pchisq(chi2, df = 1, lower.tail = FALSE)
  )
}

# Difference-in-differences on means (Morris, 2008, d_ppc2): the change in the
# intervention group (_1 minus _2) minus the change in the control group,
# divided by the pooled SD of the _2 groups and bias-corrected. The variance
# needs the correlation between _1 and _2 in effect_r.
calculate_did_smd <- function(data) {
  n_i <- data$i2_n
  n_c <- data$c2_n
  n <- n_i + n_c
  r <- data$effect_r
  sd_pooled <- sqrt(
    ((n_i - 1) * data$i2_SD^2 + (n_c - 1) * data$c2_SD^2) / (n - 2)
  )
  cp <- 1 - 3 / (4 * (n - 2) - 1)
  d <- cp * ((data$i1_M - data$i2_M) - (data$c1_M - data$c2_M)) / sd_pooled
  k <- 2 * (1 - r) * n / (n_i * n_c)
  v <- cp^2 * k * ((n - 2) / (n - 4)) * (1 + d^2 / k) - d^2
  z <- d / sqrt(v)

  tibble(
    effect_size = d,
    effect_size_lower = d - qnorm(0.975) * sqrt(v),
    effect_size_upper = d + qnorm(0.975) * sqrt(v),
    effect_size_var = v,
    effect_size_se = sqrt(v),
    effect_analysis = "ANOVA",
    effect_statistic_name = "z",
    effect_statistic_value = z,
    effect_df = NA_real_,
    effect_p = 2 * pnorm(-abs(z))
  )
}

# Converts effects reported as odds ratios with a 95% CI (effect_size_name
# "OR") to the logit-based d used for difference-in-differences effects:
# log(OR) * sqrt(3) / pi, with the SE of log(OR) recovered from the CI and an
# exact Wald z-test p-value. Returns new rows to pool; the original OR rows
# should get effect_exclude "yes".
convert_reported_or <- function(effects) {
  k <- sqrt(3) / pi
  effects |>
    filter(effect_size_name == "OR") |>
    mutate(
      log_or = log(effect_size),
      se_log_or = (log(effect_size_upper) - log(effect_size_lower)) /
        (2 * qnorm(0.975)),
      effect_size_name = "g",
      effect_size = log_or * k,
      effect_size_lower = log(effect_size_lower) * k,
      effect_size_upper = log(effect_size_upper) * k,
      effect_size_var = (se_log_or * k)^2,
      effect_size_se = se_log_or * k,
      effect_statistic_name = "z",
      effect_statistic_value = log_or / se_log_or,
      effect_df = NA_real_,
      effect_p = 2 * pnorm(-abs(log_or / se_log_or)),
      effect_from_paper = "no",
      effect_exclude = "no",
      effect_notes = "Converted from the reported odds ratio and 95% CI: log(OR) * sqrt(3) / pi; SE from the CI of log(OR); p from a Wald z-test."
    ) |>
    select(-log_or, -se_log_or)
}

# Calculate ---------------------------------------------------------------

calculate_effects <- function(effects, statistics) {
  methods <- list(
    smd = calculate_smd,
    or2dl = calculate_or2dl,
    smcc = calculate_smcc,
    did_logit = calculate_did_logit,
    did_smd = calculate_did_smd
  )

  data <- effects |>
    mutate(
      .row = row_number(),
      effect_p = suppressWarnings(as.numeric(map_chr(
        effect_p,
        \(x) if (length(x) == 0) NA_character_ else as.character(x)
      )))
    ) |>
    attach_statistics(statistics) |>
    mutate(
      .method = case_when(
        effect_size_name == "SMD" & !is.na(intervention_statistics_2) ~
          "did_smd",
        effect_size_name == "SMD" ~ "smd",
        effect_size_name == "OR2DL" ~ "or2dl",
        effect_size_name == "SMCC" ~ "smcc",
        effect_size_name == "g" &
          !is.na(intervention_statistics_2) &
          !is.na(i1_successes) ~ "did_logit"
      )
    )

  unsupported <- filter(data, is.na(.method))
  if (nrow(unsupported) > 0) {
    message("No calculation available for these effects (skipped):")
    unsupported |>
      select(paper, paper_label, effect, effect_size_name, effect_analysis) |>
      print(n = Inf)
  }

  results <- data |>
    filter(!is.na(.method)) |>
    group_by(.method) |>
    group_modify(\(d, key) {
      bind_cols(select(d, .row), methods[[key$.method]](d))
    }) |>
    ungroup() |>
    select(-.method)

  data |>
    select(names(effects), .row) |>
    rows_update(results, by = ".row") |>
    filter(.row %in% results$.row) |>
    mutate(effect_from_paper = "no") |>
    arrange(paper, study, outcome, effect) |>
    select(all_of(names(effects)))
}

write_effects <- function(
  results,
  path = file.path("r", "output", paste0("effects-", Sys.Date(), ".csv"))
) {
  dir.create(dirname(path), showWarnings = FALSE, recursive = TRUE)
  write_csv(results, path, na = "-")
  path
}

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
