/**
 * Utility functions for CSV export functionality
 */

export interface CSVExportOptions {
  excludeKeys?: string[]
  customHeaders?: Record<string, string>
}

/**
 * Exports data as CSV file
 * @param data Array of objects to export
 * @param filename Name of the downloaded file (without .csv extension)
 * @param options Optional configuration for export
 */
export const exportToCSV = <T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  options: CSVExportOptions = {}
): void => {
  if (!data || data.length === 0) {
    console.warn("No data to download")
    return
  }

  const { excludeKeys = [], customHeaders = {} } = options

  // Extract all unique column names from the data
  const columnNames: string[] = []
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!columnNames.includes(key) && !excludeKeys.includes(key)) {
        columnNames.push(key)
      }
    })
  })

  // Use custom headers if provided, otherwise use column names
  const headers = columnNames.map(col => customHeaders[col] || col)

  // Process each row of data
  const rowsData: string[] = []
  data.forEach((row: Record<string, unknown>) => {
    const rowData: string[] = []
    columnNames.forEach((columnName: string) => {
      const value = String(row[columnName] || "")
      // Properly escape CSV values (handle commas, quotes, and newlines)
      const escapedValue =
        value.includes(",") || value.includes('"') || value.includes("\n")
          ? `"${value.replace(/"/g, '""')}"`
          : value
      rowData.push(escapedValue)
    })
    rowsData.push(rowData.join(","))
  })

  // Combine headers and data
  const csvContent = headers.join(",") + "\n" + rowsData.join("\n")

  // Create and trigger download
  const element = document.createElement("a")
  element.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
  )
  element.setAttribute("download", `${filename}.csv`)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}