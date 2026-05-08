import { describe, expect, it } from 'vitest'
import { parseCsvFile } from '../../src/utils/csvParser'

function csvFile(content: string, name = 'requirements.csv'): File {
  return new File([content], name, { type: 'text/csv' })
}

describe('parseCsvFile', () => {
  it('parses valid requirements and detects canonical columns', async () => {
    const result = await parseCsvFile(
      csvFile('id,text,domain,type,project\nREQ-1,The system shall respond fast,Auth,FR,Portal'),
    )

    expect(result.error).toBeNull()
    expect(result.parsedFile?.metadata.rowCount).toBe(1)
    expect(result.parsedFile?.detection).toEqual({
      id: true,
      text: true,
      domain: true,
      type: true,
      project: true,
    })
    expect(result.parsedFile?.rows[0]).toMatchObject({
      id: 'REQ-1',
      domain: 'Auth',
      type: 'FR',
      project: 'Portal',
    })
  })

  it('returns an actionable error when no text column exists', async () => {
    const result = await parseCsvFile(csvFile('id,description\nREQ-1,Missing required text'))

    expect(result.parsedFile).toBeNull()
    expect(result.error).toContain('text column')
  })

  it('generates sequential IDs when the id column is absent', async () => {
    const result = await parseCsvFile(csvFile('text\nUsers may reset passwords'))

    expect(result.error).toBeNull()
    expect(result.parsedFile?.rows[0]?.id).toBe('REQ-001')
  })
})

