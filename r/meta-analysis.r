# Setup -------------------------------------------------------------------

library(tidyverse)
library(googlesheets4)
library(metafor)
library(clubSandwich)
library(jsonlite)
library(btw)

btw_mcp_session()

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

codebook <- read_sheet(
  paste0(url, url_id),
  sheet = "Codebook",
  na = c("", "-")
)

# Prepare data ------------------------------------------------------------

effect_sizes <- effects |>
  filter(effect_size_name %in% c("OR2DL", "SMCC", "SMD", "g")) |>
  filter(effect_exclude == "no") |>
  select(
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
    control_sample,
    effect,
    intervention_statistics_1,
    control_statistics_1,
    effect_size_name,
    effect_size,
    effect_size_lower,
    effect_size_upper,
    effect_size_var,
    effect_size_se
  )

# Some studies have the same effect across different times
# Only include the effects with the longest time between the intervention
# and outcome measurement
effect_sizes <- effect_sizes |>
  group_by(paper, study, outcome) |>
  filter(intervention_time_1 == max(intervention_time_1)) |>
  ungroup()

# Add outcome information
effect_sizes <- outcomes |>
  select(
    paper,
    study,
    outcome,
    outcome_label,
    outcome_description,
    time,
    outcome_expectation,
    outcome_category,
    outcome_subcategory,
    outcome_measurement_type
  ) |>
  rename(intervention_time_1 = time) |>
  right_join(
    effect_sizes,
    by = join_by(paper, study, outcome, intervention_time_1),
    relationship = "one-to-many"
  )

# Flip the effect sizes depending on the expected outcome direction
effect_sizes <- mutate(
  effect_sizes,
  effect_size = if_else(
    outcome_expectation == "decrease",
    effect_size * -1,
    effect_size
  ),
  temp = if_else(
    outcome_expectation == "decrease",
    effect_size_upper * -1,
    effect_size_lower
  ),
  effect_size_upper = if_else(
    outcome_expectation == "decrease",
    effect_size_lower * -1,
    effect_size_upper
  ),
  effect_size_lower = temp,
  temp = NULL
)

# Add paper information
effect_sizes <- papers |>
  select(
    paper,
    paper_label,
    paper_authors,
    paper_year,
    paper_title,
    paper_type,
    paper_source,
    paper_link,
    paper_open_access
  ) |>
  right_join(effect_sizes, by = join_by(paper))

# Add study information
effect_sizes <- studies |>
  select(
    paper,
    study,
    study_n,
    study_preregistered,
    study_preregistration_link,
    study_data_available,
    study_data_link,
    study_design,
    study_condition_assignment,
    study_randomization
  ) |>
  right_join(effect_sizes, by = join_by(paper, study))

# Add effect sample size information
sample_sizes <- statistics |>
  filter(statistic_name == "n") |>
  select(paper, statistics, statistic_value)

effect_sizes <- effect_sizes |>
  left_join(
    sample_sizes,
    by = join_by(paper, control_statistics_1 == statistics)
  ) |>
  rename(effect_control_n = statistic_value) |>
  left_join(
    sample_sizes,
    by = join_by(paper, intervention_statistics_1 == statistics)
  ) |>
  rename(effect_intervention_n = statistic_value)

# Add conditions information
conditions <- conditions |>
  mutate(
    intervention_mechanism_multicomponent = if_else(
      str_detect(intervention_mechanism, ","),
      "yes",
      "no"
    ),
    intervention_medium_multicomponent = if_else(
      str_detect(intervention_medium, ","),
      "yes",
      "no"
    )
  )

interventions <- conditions |>
  filter(condition_category == "intervention") |>
  select(
    paper,
    study,
    condition,
    intervention_mechanism,
    intervention_mechanism_multicomponent,
    intervention_medium,
    intervention_medium_multicomponent,
    condition_description
  ) |>
  rename(intervention_description = condition_description)

# Check for missing interventions
interventions |>
  filter(is.na(intervention_mechanism)) |>
  select(paper, study, condition, intervention_description)

# Create dummy variables for each intervention mechanism (including subtypes)
mechanism_dummies <- interventions |>
  select(paper, study, condition, intervention_mechanism) |>
  mutate(category = str_split(intervention_mechanism, ",\\s*")) |>
  unnest(category) |>
  mutate(
    category = str_trim(category) |>
      str_replace_all("[: /]+", "_") |>
      str_to_lower(),
    value = 1L
  ) |>
  distinct(paper, study, condition, category, value) |>
  pivot_wider(
    id_cols = c(paper, study, condition),
    names_from = category,
    names_prefix = "has_mechanism_",
    values_from = value,
    values_fill = 0L
  )

interventions <- interventions |>
  left_join(mechanism_dummies, by = join_by(paper, study, condition))

# Check for missing medium
interventions |>
  filter(is.na(intervention_medium)) |>
  select(paper, study, condition, intervention_description)

# Create dummy variables for each intervention medium
medium_dummies <- interventions |>
  select(paper, study, condition, intervention_medium) |>
  mutate(category = str_split(intervention_medium, ",\\s*")) |>
  unnest(category) |>
  mutate(
    category = str_trim(category) |>
      str_replace_all("[ /-]", "_") |>
      str_to_lower(),
    value = 1L
  ) |>
  distinct(paper, study, condition, category, value) |>
  pivot_wider(
    id_cols = c(paper, study, condition),
    names_from = category,
    names_prefix = "has_medium_",
    values_from = value,
    values_fill = 0L
  )

interventions <- interventions |>
  left_join(medium_dummies, by = join_by(paper, study, condition))

effect_sizes <- effect_sizes |>
  left_join(
    interventions,
    by = join_by(
      paper,
      study,
      intervention_condition == condition
    )
  )

# Add control conditions information
controls <- conditions |>
  filter(condition_category == "control") |>
  select(
    paper,
    study,
    condition,
    condition_description
  ) |>
  rename(control_description = condition_description)

effect_sizes <- effect_sizes |>
  left_join(
    controls,
    by = join_by(
      paper,
      study,
      control_condition == condition
    )
  )

# Show sample_country values that combine multiple countries, then collapse
# them into a single "Multiple countries" category.
samples |>
  filter(str_detect(sample_country, ",")) |>
  count(sample_country)

samples <- samples |>
  mutate(
    sample_country = if_else(
      str_detect(sample_country, ","),
      "Multiple countries",
      sample_country
    )
  )

# Add sample information per intervention and control condition
sample_info <- samples |>
  select(
    paper,
    study,
    sample,
    sample_n,
    sample_country,
    sample_type,
    sample_representative,
    sample_description
  )

effect_sizes <- effect_sizes |>
  left_join(
    sample_info |>
      rename_with(
        ~ paste0("intervention_", .x),
        c(
          sample_n,
          sample_country,
          sample_type,
          sample_representative,
          sample_description
        )
      ),
    by = join_by(paper, study, intervention_sample == sample)
  ) |>
  left_join(
    sample_info |>
      rename_with(
        ~ paste0("control_", .x),
        c(
          sample_n,
          sample_country,
          sample_type,
          sample_representative,
          sample_description
        )
      ),
    by = join_by(paper, study, control_sample == sample)
  )

# Check whether intervention and control samples differ on country, type,
# representativeness, and description. If they don't differ, we can collapse
# the prefixed columns back into single sample_* columns.
sample_comparison <- effect_sizes |>
  select(
    paper,
    study,
    intervention_sample,
    control_sample,
    intervention_sample_country,
    intervention_sample_type,
    intervention_sample_representative,
    intervention_sample_description,
    control_sample_country,
    control_sample_type,
    control_sample_representative,
    control_sample_description
  ) |>
  mutate(row = row_number()) |>
  pivot_longer(
    cols = c(
      intervention_sample_country,
      intervention_sample_type,
      intervention_sample_representative,
      intervention_sample_description,
      control_sample_country,
      control_sample_type,
      control_sample_representative,
      control_sample_description
    ),
    names_to = c("condition", "attribute"),
    names_pattern = "(intervention|control)_(sample_.*)"
  ) |>
  pivot_wider(names_from = condition, values_from = value)

sample_comparison |>
  group_by(attribute) |>
  summarise(
    n_both_present = sum(!is.na(intervention) & !is.na(control)),
    n_identical = sum(
      !is.na(intervention) & !is.na(control) & intervention == control
    ),
    n_different = sum(
      !is.na(intervention) & !is.na(control) & intervention != control
    ),
  )

sample_comparison |>
  filter(!is.na(intervention), !is.na(control), intervention != control) |>
  select(-row)

# Collapse sample_country, sample_type, and sample_representative into single
# columns (they don't differ between intervention and control). Keep
# sample_n and sample_description per condition since those can differ.
effect_sizes <- effect_sizes |>
  mutate(
    sample_country = coalesce(
      intervention_sample_country,
      control_sample_country
    ),
    sample_type = coalesce(intervention_sample_type, control_sample_type),
    sample_representative = coalesce(
      intervention_sample_representative,
      control_sample_representative
    ),
    intervention_sample_country = NULL,
    control_sample_country = NULL,
    intervention_sample_type = NULL,
    control_sample_type = NULL,
    intervention_sample_representative = NULL,
    control_sample_representative = NULL
  )

# Add a column identifying each unique study by combining the paper and study
# information; this will be used to construct the variance-covariance matrix
effect_sizes <- mutate(
  effect_sizes,
  paper_study = paste(paper, "-", study),
)

# Conditions are only uniquely defined together with their sample, and SMCC
# pre/post effects compare the same condition+sample across time. Include
# sample and time in the keys so vcalc can uniquely identify each group.
# For SMCC effects the keys collide (same group on both sides); set control_key
# to NA so vcalc treats them as single-group effects with no shared control arm.
effect_sizes <- mutate(
  effect_sizes,
  intervention_key = paste(
    intervention_condition,
    intervention_sample,
    intervention_time_1,
    intervention_time_2,
    sep = "-"
  ),
  control_key = paste(
    control_condition,
    control_sample,
    control_time_1,
    control_time_2,
    sep = "-"
  ),
  control_key = if_else(intervention_key == control_key, "", control_key)
)

# Reorder columns
effect_sizes <- effect_sizes |>
  select(
    starts_with("paper"),
    starts_with("study"),
    starts_with("intervention"),
    starts_with("control"),
    starts_with("outcome"),
    starts_with("sample"),
    everything()
  )

backup <- effect_sizes

# Write files ------------------------------------------------------------

write_json(effect_sizes, "assets/data/data.json", pretty = TRUE, digits = NA)

papers |>
  semi_join(effect_sizes, by = "paper") |>
  select(
    paper,
    paper_label,
    paper_title,
    paper_authors,
    paper_year,
    paper_type,
    paper_source,
    paper_link,
    paper_open_access
  ) |>
  write_json("assets/data/papers.json", pretty = TRUE, digits = NA)

studies |>
  semi_join(effect_sizes, by = c("paper", "study")) |>
  select(
    paper,
    paper_label,
    study,
    study_n,
    study_preregistered,
    study_preregistration_link,
    study_data_available,
    study_data_link,
    study_design,
    study_condition_assignment,
    study_randomization
  ) |>
  write_json("assets/data/studies.json", pretty = TRUE, digits = NA)

used_samples <- bind_rows(
  effect_sizes |>
    select(paper, study, sample = intervention_sample),
  effect_sizes |>
    select(paper, study, sample = control_sample)
) |>
  distinct()

samples |>
  semi_join(used_samples, by = c("paper", "study", "sample")) |>
  select(
    paper,
    paper_label,
    study,
    sample,
    sample_n,
    sample_country,
    sample_type,
    sample_representative,
    sample_description
  ) |>
  write_json("assets/data/samples.json", pretty = TRUE, digits = NA)

conditions |>
  semi_join(
    effect_sizes,
    by = c("paper", "study", "condition" = "intervention_condition")
  ) |>
  filter(condition_category == "intervention") |>
  select(
    paper,
    paper_label,
    study,
    condition,
    intervention_description = condition_description,
    intervention_mechanism,
    intervention_mechanism_multicomponent,
    intervention_medium,
    intervention_medium_multicomponent
  ) |>
  write_json("assets/data/interventions.json", pretty = TRUE, digits = NA)

outcomes |>
  semi_join(
    effect_sizes,
    by = c("paper", "study", "outcome", "time" = "intervention_time_1")
  ) |>
  select(
    paper,
    paper_label,
    study,
    outcome,
    outcome_label,
    outcome_description,
    outcome_category,
    outcome_subcategory,
    outcome_measurement_type
  ) |>
  write_json("assets/data/outcomes.json", pretty = TRUE, digits = NA)

effect_sizes |>
  select(
    paper,
    paper_label,
    study,
    outcome,
    effect,
    effect_size_name,
    effect_size,
    effect_size_lower,
    effect_size_upper,
    effect_size_var,
    effect_intervention_n,
    effect_control_n
  ) |>
  write_json("assets/data/effects.json", pretty = TRUE, digits = NA)

count_papers <- effect_sizes |>
  pull(paper) |>
  unique() |>
  length()

count_studies <- effect_sizes |>
  mutate(study = paste(paper, study)) |>
  pull(study) |>
  unique() |>
  length()

count_effects <- nrow(effect_sizes)

count_observations <- effect_sizes |>
  group_by(paper, study) |>
  summarize(study_n = first(study_n), .groups = "drop") |>
  pull(study_n) |>
  round() |>
  sum()

counts <- list(
  papers = count_papers,
  studies = count_studies,
  effects = count_effects,
  observations = count_observations
)

write_json(
  counts,
  "assets/data/counts.json",
  auto_unbox = TRUE,
  pretty = TRUE,
  digits = NA
)

# Create the codebook
#codebook <- codebook |>
#  select(-sheet, -level) |>
#  distinct() |>
#  full_join(
#    tibble(variable = names(effect_sizes)),
#    by = join_by(column == variable)
#  )
#
#write_json(codebook, "Data/codebook.json", pretty = TRUE)

# Create nested structure
nested_interventions <- effect_sizes |>
  select(
    paper,
    study,
    intervention_condition,
    intervention_description,
    intervention_mechanism,
    intervention_mechanism_multicomponent,
    intervention_medium,
    intervention_medium_multicomponent,
    control_description
  ) |>
  group_by(paper, study) |>
  distinct() |>
  nest(
    interventions = c(
      intervention_condition,
      intervention_description,
      intervention_mechanism,
      intervention_mechanism_multicomponent,
      intervention_medium,
      intervention_medium_multicomponent,
      control_description
    )
  )

nested_outcomes <- effect_sizes |>
  select(
    paper,
    study,
    outcome,
    outcome_description
  ) |>
  group_by(paper, study) |>
  distinct() |>
  nest(
    outcomes = c(outcome, outcome_description)
  )

nested_studies <- effect_sizes |>
  select(paper, study, study_n) |>
  distinct() |>
  left_join(nested_interventions, by = join_by(paper, study)) |>
  left_join(nested_outcomes, by = join_by(paper, study)) |>
  group_by(paper) |>
  nest(studies = c(study, study_n, interventions, outcomes))

nested <- effect_sizes |>
  select(
    paper,
    paper_label,
    paper_authors,
    paper_title,
    paper_year,
    paper_link
  ) |>
  distinct() |>
  left_join(nested_studies, by = join_by(paper))

write_json(nested, "assets/data/data-nested.json", pretty = TRUE, digits = NA)

# Meta-analysis -----------------------------------------------------------

V <- vcalc(
  vi = effect_size_var,
  cluster = paper_study,
  subgroup = outcome,
  grp1 = intervention_key,
  grp2 = control_key,
  w1 = effect_intervention_n,
  w2 = effect_control_n,
  data = effect_sizes
)

# fit multivariate/multilevel model with appropriate fixed/random effects
res <- rma.mv(
  yi = effect_size,
  V = V,
  random = ~ 1 | paper / study / outcome,
  data = effect_sizes
)
res

# apply cluster-robust inference methods (robust variance estimation)
# note: use the improved methods from the clubSandwich package
sav <- robust(res, cluster = paper, clubSandwich = TRUE)
sav
sav$b
sav$ci.lb
sav$ci.ub

# compute predicted outcomes (with corresponding CIs) as needed
pred <- predict(sav)
pred

pred$pred
pred$ci.lb
pred$ci.ub
pred$pi.lb
pred$pi.ub

res$sigma2

# test sets of coefficients / linear combinations as needed
anova(sav)

# Convert the effect size and effect size variance to other measures for the
# funnel plots and Egger's test
effect_sizes <- mutate(
  effect_sizes,
  effect_size_se_inverse = 1 / effect_size_se
)

res_egger <- rma.mv(
  yi = effect_size,
  V = V,
  mods = ~effect_size_se,
  random = ~ 1 | paper / study / outcome,
  data = effect_sizes
)
res_egger

sav_egger <- robust(res_egger, cluster = paper, clubSandwich = TRUE)
sav_egger

sav_egger$b[2]
sav_egger$se[2]
sav_egger$zval[2]
sav_egger$pval[2]


# Moderator --------------------------------------------------------------

res_mod <- rma.mv(
  yi = effect_size,
  V = V,
  random = ~ 1 | paper / study / outcome,
  mods = ~ factor(study_preregistered) - 1,
  data = effect_sizes
)
res_mod

# apply cluster-robust inference methods (robust variance estimation)
# note: use the improved methods from the clubSandwich package
sav_mod <- robust(res_mod, cluster = paper, clubSandwich = TRUE)
sav_mod

# Intervention mechanism moderators

# Univariable: effect of a single mechanism in isolation
res_mod_mechanism <- rma.mv(
  yi = effect_size,
  V = V,
  random = ~ 1 | paper / study / outcome,
  mods = ~has_mechanism_choice_architecture_default,
  data = effect_sizes
)
res_mod_mechanism

sav_mod_mechanism <- robust(
  res_mod_mechanism,
  cluster = paper,
  clubSandwich = TRUE
)
sav_mod_mechanism

# Filter: drop mechanism levels with < 10 effects and has_mechanism_other;
# drop rows with rare covariate levels (< 10 observations)
mechanism_cols_all <- grep("^has_mechanism_", names(effect_sizes), value = TRUE)

mechanism_cols <- mechanism_cols_all[
  colSums(effect_sizes[mechanism_cols_all]) >= 10
] |>
  setdiff("has_mechanism_other")

effect_sizes_filtered <- effect_sizes |>
  filter(
    outcome_category %in% names(which(table(outcome_category) >= 10)),
    study_design %in% names(which(table(study_design) >= 10))
  )

V_filtered <- vcalc(
  vi = effect_size_var,
  cluster = paper_study,
  subgroup = outcome,
  grp1 = intervention_key,
  grp2 = control_key,
  w1 = effect_intervention_n,
  w2 = effect_control_n,
  data = effect_sizes_filtered
)

# Multivariable: each coefficient is the unique effect of that mechanism,
# controlling for the presence of the others
res_mod_mechanisms <- rma.mv(
  yi = effect_size,
  V = V_filtered,
  random = ~ 1 | paper / study / outcome,
  mods = reformulate(
    c(
      mechanism_cols,
      "factor(outcome_category)",
      "factor(study_design)",
      "factor(study_preregistered)",
      "factor(intervention_mechanism_multicomponent)"
    )
  ),
  data = effect_sizes_filtered
)
res_mod_mechanisms

sav_mod_mechanisms <- robust(
  res_mod_mechanisms,
  cluster = paper,
  clubSandwich = TRUE
)
sav_mod_mechanisms

# Predicted effect for each mechanism in isolation:
#   - focal mechanism = 1, all other mechanisms = 0
#   - multicomponent = "no" (single-mechanism intervention)
#   - covariates averaged equally across their levels (1/k per level)
# mechanism_cols already defined above from the filter step

# Build a base newmods row from the model matrix column names
mm_cols <- colnames(model.matrix(res_mod_mechanisms))[-1]
newmods_base <- setNames(rep(0, length(mm_cols)), mm_cols)

# Set covariate dummies to equal weights across levels (1/k),
# derived dynamically so the count reflects whatever levels survived filtering
set_equal_weights <- function(base, cols, pattern) {
  idx <- grep(pattern, cols)
  base[idx] <- 1 / (length(idx) + 1) # +1 for the reference level
  base
}

newmods_base <- newmods_base |>
  set_equal_weights(mm_cols, "factor\\(outcome_category\\)") |>
  set_equal_weights(mm_cols, "factor\\(study_design\\)") |>
  set_equal_weights(mm_cols, "factor\\(study_preregistered\\)")
# multicomponent stays 0 ("no")

# Predict for each mechanism
mechanism_predictions <- map_dfr(mechanism_cols, function(focal) {
  newmods <- newmods_base
  newmods[focal] <- 1

  pred <- predict(res_mod_mechanisms, newmods = matrix(newmods, nrow = 1))

  tibble(
    mechanism = focal,
    estimate = pred$pred,
    ci_lb = pred$ci.lb,
    ci_ub = pred$ci.ub,
    pi_lb = pred$pi.lb,
    pi_ub = pred$pi.ub
  )
})

mechanism_predictions |>
  arrange(estimate) |>
  print(n = Inf)

# Data visualization ------------------------------------------------------

forest(res)
funnel(res)

glimpse(effect_sizes)

yend <- effect_sizes |>
  pull(effect_size_se) |>
  max() *
  -1

ggplot(effect_sizes, aes(x = yi, y = se * -1)) +
  geom_segment(
    yend = yend,
    x = x,
    y = 0,
    linetype = "dashed",
    color = "gray60"
  ) +
  geom_segment(
    x = x,
    y = 0,
    xend = x + yend * 1.96,
    yend = yend,
    linetype = "dashed",
    color = "gray60"
  ) +
  geom_segment(
    x = x,
    y = 0,
    xend = x - yend * 1.96,
    yend = yend,
    linetype = "dashed",
    color = "gray60"
  ) +
  geom_point() +
  scale_y_continuous(limits = c(yend, 0))

effect_sizes |>
  mutate(
    y = effect_size / sqrt(effect_size_var),
    x = 1 / sqrt(effect_size_var)
  ) |>
  glm(y ~ x, data = _) |>
  summary()

lm(effect_size ~ effect_size_se * -1, data = effect_sizes) |>
  summary()

# Test eggers test
temp <- effect_sizes |>
  group_by(paper) |>
  slice_head(n = 1) |>
  select(paper, effect_size, effect_size_var, effect_size_se) |>
  mutate(
    yi = effect_size / effect_size_se,
    sei = 1 / effect_size_se
  )

model <- rma(effect_size, effect_size_var, data = temp)
regtest(model, model = "lm", predictor = "sei")

lm(yi ~ sei, data = temp) |>
  summary()

# Paper-level flow chart -------------------------------------------------

papers <- papers |>
  filter(!is.na(paper_label))

# Demo: does predictor coding affect predicted values? --------------------
#
# Question: if a categorical predictor is coded differently (dummy/treatment
# vs. sum/effects vs. Helmert contrasts), do predicted means from predict()
# or marginaleffects change? Below shows they don't -- coding only changes
# how coefficients are parameterized, not the fitted model or its
# predictions. This matters for the mechanism_predictions code above, where
# newmods is built by hand from model.matrix(): that approach IS
# coding-dependent, since you have to supply the right contrast values
# yourself instead of letting predict()/marginaleffects handle it.

library(marginaleffects)

set.seed(2026)
n <- 300

arm_true_effects <- list(control = 0, low = 2, high = -1)

demo_data <- tibble(
  x = rnorm(n, mean = 50, sd = 10),
  arm = sample(names(arm_true_effects), n, replace = TRUE)
) |>
  left_join(
    arm_true_effects |>
      enframe(name = "arm", value = "true_effect") |>
      unnest(true_effect),
    by = "arm"
  ) |>
  mutate(
    arm = factor(arm, levels = c("control", "low", "high")),
    y = 5 + 0.3 * x + true_effect + rnorm(n, sd = 3),
    true_effect = NULL
  )

# Fit the same model with three different contrast codings for `arm`,
# kept as separate objects so each summary() can be inspected on its own
fit_treatment <- lm(
  y ~ x + arm,
  data = demo_data,
  contrasts = list(arm = contr.treatment)
)
summary(fit_treatment)

fit_sum <- lm(
  y ~ x + arm,
  data = demo_data,
  contrasts = list(arm = contr.sum)
)
summary(fit_sum)

fit_helmert <- lm(
  y ~ x + arm,
  data = demo_data,
  contrasts = list(arm = contr.helmert)
)
summary(fit_helmert)

demo_fits <- list(
  treatment = fit_treatment,
  sum = fit_sum,
  helmert = fit_helmert
)

# Predicted means per arm (x held at its mean) are identical across
# codings when using predict()
demo_newdata <- demo_data |>
  distinct(arm) |>
  mutate(x = mean(demo_data$x))

predict(fit_treatment, newdata = demo_newdata) |> round(4)
predict(fit_sum, newdata = demo_newdata) |> round(4)
predict(fit_helmert, newdata = demo_newdata) |> round(4)

# Same check with marginaleffects, averaging predictions over the observed
# x distribution instead of holding x at its mean
demo_fits |>
  map(\(fit) avg_predictions(fit, by = "arm") |> select(arm, estimate))
