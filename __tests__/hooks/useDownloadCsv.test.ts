import { describe, expect, it } from 'vitest'
import { escapeCell, rowsToCsv } from '../../src/hooks/useDownloadCsv'

describe('CSV export helpers', () => {
  it('quotes cells containing delimiters', () => {
    expect(escapeCell('Needs review, then approval')).toBe('"Needs review, then approval"')
  })

  it('neutralises spreadsheet formula prefixes', () => {
    expect(escapeCell('=IMPORTXML("https://example.com")')).toBe(
      '"\'=IMPORTXML(""https://example.com"")"',
    )
    expect(escapeCell(' @SUM(A1:A2)')).toBe("' @SUM(A1:A2)")
  })

  it('serialises rows to CSV with headers', () => {
    expect(rowsToCsv([{ id: 'REQ-1', text: 'The system shall export CSV' }])).toBe(
      'id,text\nREQ-1,The system shall export CSV',
    )
  })
})
