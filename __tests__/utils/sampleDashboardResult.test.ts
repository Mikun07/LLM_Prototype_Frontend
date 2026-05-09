import { describe, expect, it } from 'vitest'
import {
  sampleDashboardFile,
  sampleDashboardRequirements,
  sampleDashboardResult,
} from '../../src/utils/sampleDashboardResult'

describe('sampleDashboardResult', () => {
  it('loads the Requirement RESULT preview into dashboard-ready reports', () => {
    expect(sampleDashboardFile.name).toBe('Requirement RESULT.pdf')
    expect(sampleDashboardRequirements).toHaveLength(11)
    expect(sampleDashboardResult.claudeReport.ambiguityResults).toHaveLength(11)
    expect(sampleDashboardResult.chatgptReport.ambiguityResults).toHaveLength(11)
    expect(sampleDashboardResult.comparison.rows).toHaveLength(11)
  })

  it('keeps model and comparison statistics in sync with the sample labels', () => {
    expect(sampleDashboardResult.claudeReport.stats.total).toBe(14)
    expect(sampleDashboardResult.claudeReport.stats.smells).toBe(12)
    expect(sampleDashboardResult.chatgptReport.stats.total).toBe(14)
    expect(sampleDashboardResult.chatgptReport.stats.smells).toBe(8)
    expect(sampleDashboardResult.comparison.stats.fullAgreement).toBe(8)
    expect(sampleDashboardResult.comparison.stats.claudeOnly).toBe(3)
    expect(sampleDashboardResult.comparison.stats.chatgptOnly).toBe(0)
  })
})
