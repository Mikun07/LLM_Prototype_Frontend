interface UseDownloadCsvReturn {
  download: (rows: object[], filename: string) => void
}

function escapeCell(value: unknown): string {
  const text = String(value ?? '')

  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

export function useDownloadCsv(): UseDownloadCsvReturn {
  function download(rows: object[], filename: string): void {
    if (rows.length === 0) {
      return
    }

    const records = rows.map((row) => row as Record<string, unknown>)
    const headers = Object.keys(records[0])
    const lines = [
      headers.join(','),
      ...records.map((row) => headers.map((header) => escapeCell(row[header])).join(',')),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return { download }
}
