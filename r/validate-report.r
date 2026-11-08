# Run r/validate.r from the command line and print only the checks that find
# something, each under the comment above it and its line in validate.r.
#
# Command line: Rscript r/validate-report.r [section ...]
# Sections are the names after "# Validation:" in validate.r, e.g.
# Rscript r/validate-report.r Study-level "Paper status"
# Without sections, every section runs. Setup, functions, codebook, and import
# always run.

# Setup -------------------------------------------------------------------

# Log in with the cached Google token and keep googlesheets4 quiet
options(
  gargle_oauth_email = "*@me.com",
  gargle_verbosity = "silent",
  googlesheets4_quiet = TRUE
)

sections <- commandArgs(trailingOnly = TRUE)

src <- readLines("r/validate.r")
exprs <- parse("r/validate.r", keep.source = TRUE)
first_line <- vapply(attr(exprs, "srcref"), \(s) s[1], integer(1))
last_line <- vapply(attr(exprs, "srcref"), \(s) s[3], integer(1))

# Find the section each expression is in: the last "# Validation:" header
# above it, or none for setup, functions, codebook, and import
headers <- grep("^# Validation: ", src)
header_names <- sub("^# Validation: (.+?) -+$", "\\1", src[headers])
section_of <- c(NA, header_names)[findInterval(first_line, headers) + 1]

unknown <- setdiff(sections, header_names)
if (length(unknown) > 0) {
  stop(
    "Unknown section: ", paste(unknown, collapse = ", "),
    "\nSections: ", paste(header_names, collapse = ", ")
  )
}

# Find what describes each check: the comment above it, which may also cover
# the checks right below it (no blank line in between), e.g. one comment for
# five check_status_missing_rows() calls. A check without a comment is
# described by its first line of code, e.g. check_spaces(...).
inside_code <- unlist(Map(seq, first_line, last_line))
comment_lines <- setdiff(grep("^#", src), c(inside_code, grep("-{4,}$", src)))

label_of <- function(line) {
  end <- line - 1
  while (end > 0 && nzchar(src[end]) && !end %in% comment_lines) end <- end - 1
  if (!end %in% comment_lines) return(src[line])
  start <- end
  while ((start - 1) %in% comment_lines) start <- start - 1
  paste(sub("^# ?", "", src[start:end]), collapse = "\n")
}

# Run ---------------------------------------------------------------------

# Run each expression in order, skipping sections that weren't asked for, and
# print the results of checks that find something. Tables are printed as CSV,
# so long text isn't cut off. A check that fails is reported, and the run goes
# on; a failure before the checks (e.g. in the import) stops it.
for (i in seq_along(exprs)) {
  in_section <- !is.na(section_of[i])
  if (in_section && length(sections) > 0 && !section_of[i] %in% sections) {
    next
  }

  result <- tryCatch(
    suppressPackageStartupMessages(withVisible(eval(exprs[[i]], globalenv()))),
    error = \(e) e
  )

  if (inherits(result, "error") && !in_section) stop(result)
  if (inherits(result, "error")) {
    cat("\n== ERROR,", section_of[i], "line", first_line[i], "==\n")
    cat(label_of(first_line[i]), "\n")
    cat(conditionMessage(result), "\n")
    next
  }

  value <- result$value
  if (!in_section || !result$visible || NROW(value) == 0) next

  cat("\n==", section_of[i], "line", first_line[i], "==\n")
  cat(label_of(first_line[i]), "\n")
  if (is.data.frame(value)) {
    cat(format_csv(value))
  } else {
    print(value)
  }
}
