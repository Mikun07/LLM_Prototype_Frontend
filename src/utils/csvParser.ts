import Papa from 'papaparse'
import type {
  ColumnDetection,
  CsvParseResult,
  ParsedFile,
  RequirementRow,
  RequirementType,
} from '../types'

const columnAliases = {
  id: ['id', 'requirement id', 'requirement_id', 'req id', 'req_id'],
  text: ['text', 'requirement', 'requirement text', 'requirement_text'],
  domain: ['domain', 'area', 'module'],
  type: ['type', 'requirement type', 'requirement_type'],
  project: [
    'project',
    'project name',
    'project id',
    'group id',
    'system',
    'product',
  ],
}

type ColumnKey = keyof typeof columnAliases

function normaliseHeader(value: string): string {
  return value.trim().toLowerCase().replaceAll('_', ' ').replace(/\s+/g, ' ')
}

function findColumn(headers: string[], key: ColumnKey): string | null {
  const aliases = columnAliases[key]

  return (
    headers.find((header) => aliases.includes(normaliseHeader(header))) ?? null
  )
}

function detectColumns(headers: string[]): ColumnDetection {
  return {
    id: findColumn(headers, 'id') !== null,
    text: findColumn(headers, 'text') !== null,
    domain: findColumn(headers, 'domain') !== null,
    type: findColumn(headers, 'type') !== null,
    project: findColumn(headers, 'project') !== null,
  }
}

function readValue(
  row: Record<string, string | undefined>,
  column: string | null,
): string {
  if (column === null) {
    return ''
  }

  return row[column]?.trim() ?? ''
}

function normaliseRequirementType(value: string): RequirementType {
  const upper = value.trim().toUpperCase()

  if (upper === 'FR' || upper === 'FUNCTIONAL') {
    return 'FR'
  }

  if (upper === 'NFR' || upper === 'NON-FUNCTIONAL' || upper === 'NONFUNCTIONAL') {
    return 'NFR'
  }

  return value.trim() || 'UNKNOWN'
}

function hasCsvShape(file: File): boolean {
  return (
    file.name.toLowerCase().endsWith('.csv') ||
    file.type === 'text/csv' ||
    file.type === 'application/vnd.ms-excel'
  )
}

function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Unable to read the selected CSV file.'))
    reader.readAsText(file)
  })
}

export async function parseCsvFile(file: File): Promise<CsvParseResult> {
  if (!hasCsvShape(file)) {
    return {
      parsedFile: null,
      error: 'Upload a CSV file with a .csv extension.',
    }
  }

  const text = await readFileText(file)
  const result = Papa.parse<Record<string, string | undefined>>(text, {
    header: true,
    skipEmptyLines: true,
  })

  const fatalError = result.errors.find(
    (error) => error.code !== 'UndetectableDelimiter',
  )

  if (fatalError !== undefined) {
    return {
      parsedFile: null,
      error: fatalError.message ?? 'The selected file is not a valid CSV.',
    }
  }

  const headers = result.meta.fields ?? []
  const detection = detectColumns(headers)
  const textColumn = findColumn(headers, 'text')

  if (headers.length === 0 || textColumn === null) {
    return {
      parsedFile: null,
      error: 'The CSV must include a text column for requirement content.',
    }
  }

  const idColumn = findColumn(headers, 'id')
  const domainColumn = findColumn(headers, 'domain')
  const typeColumn = findColumn(headers, 'type')
  const projectColumn = findColumn(headers, 'project')

  const rows: RequirementRow[] = result.data
    .map((row, index): RequirementRow | null => {
      const requirementText = readValue(row, textColumn)

      if (requirementText.length === 0) {
        return null
      }

      return {
        id: readValue(row, idColumn) || `REQ-${String(index + 1).padStart(3, '0')}`,
        text: requirementText,
        domain: readValue(row, domainColumn) || 'General',
        type: normaliseRequirementType(readValue(row, typeColumn)),
        project: readValue(row, projectColumn) || 'Default',
      }
    })
    .filter((row): row is RequirementRow => row !== null)

  if (rows.length === 0) {
    return {
      parsedFile: null,
      error: 'The CSV has headers but no requirement rows with text.',
    }
  }

  const seenIds = new Set<string>()
  const duplicateIds = new Set<string>()
  rows.forEach((row) => {
    if (seenIds.has(row.id)) {
      duplicateIds.add(row.id)
    }
    seenIds.add(row.id)
  })

  if (duplicateIds.size > 0) {
    return {
      parsedFile: null,
      error: `Requirement IDs must be unique. Duplicate ID(s): ${Array.from(duplicateIds)
        .sort()
        .join(', ')}.`,
    }
  }

  const parsedFile: ParsedFile = {
    metadata: {
      name: file.name,
      size: file.size,
      rowCount: rows.length,
    },
    rows,
    detectedColumns: Object.entries(detection)
      .filter(([, isPresent]) => isPresent)
      .map(([name]) => name),
    detection,
  }

  return { parsedFile, error: null }
}
