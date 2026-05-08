import { describe, expect, it } from 'vitest'
import type { RequirementRow } from '../../src/types'
import { buildInterfaceReports } from '../../src/utils/reportFactory'

const requirements: RequirementRow[] = [
  {
    id: 'REQ-1',
    text: 'The system may allow users to reset passwords.',
    domain: 'Auth',
    type: 'FR',
    project: 'Portal',
  },
  {
    id: 'REQ-2',
    text: 'The system shall not expose account recovery tokens.',
    domain: 'Auth',
    type: 'NFR',
    project: 'Portal',
  },
]

describe('buildInterfaceReports', () => {
  it('creates model and comparison reports from uploaded rows', () => {
    const reports = buildInterfaceReports(requirements, 'requirements.csv')

    expect(reports.claudeReport.ambiguityResults).toHaveLength(2)
    expect(reports.chatgptReport.ambiguityResults).toHaveLength(2)
    expect(reports.comparison.rows).toHaveLength(2)
    expect(reports.claudeReport.stats.total).toBeGreaterThan(0)
    expect(reports.comparison.fileName).toBe('requirements.csv')
  })
})

