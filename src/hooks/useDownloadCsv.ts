function toText(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  return typeof value === 'string' ? value : ''
}

export function neutraliseCsvFormula(value: string): string {
  const trimmedStart = value.trimStart()
  const firstCharacter = trimmedStart[0]

  if (
    firstCharacter === '=' ||
    firstCharacter === '+' ||
    firstCharacter === '-' ||
    firstCharacter === '@'
  ) {
    return `'${value}`
  }

  return value
}

export function escapeCell(value: unknown): string {
  const text = neutraliseCsvFormula(toText(value))

  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replaceAll('"', '""')}"`
  }

  return text
}

export function rowsToCsv(rows: object[]): string {
  if (rows.length === 0) {
    return ''
  }

  const records = rows.map((row) => row as Record<string, unknown>)
  const first = records[0]
  if (first === undefined) return ''
  const headers = Object.keys(first)
  const lines = [
    headers.join(','),
    ...records.map((row) => headers.map((header) => escapeCell(row[header])).join(',')),
  ]

  return lines.join('\n')
}

function download(rows: object[], filename: string): void {
  const csv = rowsToCsv(rows)
  if (csv === '') {
    return
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function useDownloadCsv(): { download: (rows: object[], filename: string) => void } {
  return { download }
}
