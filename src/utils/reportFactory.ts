import type {
  AmbiguityResult,
  BreakdownValue,
  ComparisonReport,
  ComparisonRow,
  ConfidenceLevel,
  InconsistencyResult,
  ModelName,
  ModelReport,
  RequirementRow,
  RequirementType,
  SmellLabel,
} from '../types'

const ambiguitySignals = [' or ', ' may ', ' should ', ' could ', ' fast ', ' easy ']
const inconsistencySignals = ['must not', 'shall not', 'never', 'only if']

function confidenceFor(index: number, model: ModelName): ConfidenceLevel {
  const offset = model === 'claude' ? 0 : 1
  const value = (index + offset) % 3

  if (value === 0) {
    return 'HIGH'
  }

  if (value === 1) {
    return 'MEDIUM'
  }

  return 'LOW'
}

function labelForText(text: string, index: number, model: ModelName): SmellLabel {
  const normalised = ` ${text.toLowerCase()} `
  const signalHit = ambiguitySignals.some((signal) => normalised.includes(signal))
  const cadence = model === 'claude' ? index % 3 === 0 : index % 4 === 0

  return signalHit || cadence ? 'SMELL' : 'CLEAN'
}

function pairLabel(
  first: RequirementRow,
  second: RequirementRow,
  index: number,
  model: ModelName,
): SmellLabel {
  const combined = `${first.text} ${second.text}`.toLowerCase()
  const signalHit = inconsistencySignals.some((signal) => combined.includes(signal))
  const sameDomain = (first.domain ?? 'General') === (second.domain ?? 'General')
  const cadence = model === 'claude' ? index % 2 === 0 : index % 3 === 0

  return signalHit || (sameDomain && cadence) ? 'SMELL' : 'CLEAN'
}

function asDomain(row: RequirementRow): string {
  return row.domain?.trim() || 'General'
}

function asType(row: RequirementRow): RequirementType | string {
  return row.type ?? 'UNKNOWN'
}

function percentage(part: number, total: number): number {
  return total === 0 ? 0 : Number(((part / total) * 100).toFixed(1))
}

function createBreakdowns(
  rows: { name: string; label: SmellLabel }[],
): BreakdownValue[] {
  const grouped = rows.reduce<Record<string, { total: number; smells: number }>>(
    (accumulator, row) => {
      const current = accumulator[row.name] ?? { total: 0, smells: 0 }
      current.total += 1
      current.smells += row.label === 'SMELL' ? 1 : 0
      accumulator[row.name] = current

      return accumulator
    },
    {},
  )

  return Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      total: value.total,
      smells: value.smells,
      clean: value.total - value.smells,
      smellRate: percentage(value.smells, value.total),
    }))
    .sort((first, second) => first.name.localeCompare(second.name))
}

function buildAmbiguityRows(
  requirements: RequirementRow[],
  model: ModelName,
): AmbiguityResult[] {
  return requirements.map((row, index) => {
    const label = labelForText(row.text, index, model)

    return {
      id: row.id,
      text: row.text,
      domain: asDomain(row),
      type: asType(row),
      label,
      confidence: confidenceFor(index, model),
      explanation:
        label === 'SMELL'
          ? 'Interface preview result: this requirement is marked for analyst review.'
          : 'Interface preview result: this requirement is currently shown as clean.',
      suggestion:
        label === 'SMELL'
          ? 'Rewrite the requirement with one measurable interpretation and explicit acceptance criteria.'
          : '',
    }
  })
}

function buildInconsistencyRows(
  requirements: RequirementRow[],
  model: ModelName,
): InconsistencyResult[] {
  return requirements.slice(0, Math.max(0, requirements.length - 1)).map((row, index) => {
    const next = requirements[index + 1]
    const label = pairLabel(row, next, index, model)

    return {
      reqAId: row.id,
      reqBId: next.id,
      reqAText: row.text,
      reqBText: next.text,
      domain: asDomain(row),
      label,
      confidence: confidenceFor(index + 1, model),
      explanation:
        label === 'SMELL'
          ? 'Interface preview result: this pair is marked for consistency review.'
          : 'Interface preview result: this pair is currently shown as aligned.',
      suggestion:
        label === 'SMELL'
          ? 'Compare both constraints and decide which requirement owns the final rule.'
          : '',
    }
  })
}

function buildStats(
  ambiguityResults: AmbiguityResult[],
  inconsistencyResults: InconsistencyResult[],
) {
  const allRows = [
    ...ambiguityResults.map((row) => ({
      name: 'Ambiguity',
      domain: row.domain,
      type: String(row.type),
      label: row.label,
    })),
    ...inconsistencyResults.map((row) => ({
      name: 'Inconsistency',
      domain: row.domain,
      type: 'Pair',
      label: row.label,
    })),
  ]
  const total = allRows.length
  const smells = allRows.filter((row) => row.label === 'SMELL').length

  return {
    total,
    smells,
    clean: total - smells,
    smellRate: percentage(smells, total),
    bySmellType: createBreakdowns(
      allRows.map((row) => ({ name: row.name, label: row.label })),
    ),
    byDomain: createBreakdowns(
      allRows.map((row) => ({ name: row.domain, label: row.label })),
    ),
    byRequirementType: createBreakdowns(
      allRows.map((row) => ({ name: row.type, label: row.label })),
    ),
  }
}

function buildModelReport(
  requirements: RequirementRow[],
  fileName: string,
  model: ModelName,
): ModelReport {
  const ambiguityResults = buildAmbiguityRows(requirements, model)
  const inconsistencyResults = buildInconsistencyRows(requirements, model)

  return {
    model,
    generatedAt: new Date().toISOString(),
    fileName,
    stats: buildStats(ambiguityResults, inconsistencyResults),
    ambiguityResults,
    inconsistencyResults,
  }
}

function buildComparisonRows(
  claudeReport: ModelReport,
  chatgptReport: ModelReport,
): ComparisonRow[] {
  return claudeReport.ambiguityResults.map((claudeRow, index) => {
    const chatgptRow = chatgptReport.ambiguityResults[index]
    const agreementStatus =
      claudeRow.label === chatgptRow.label ? 'AGREE' : 'DISAGREE'

    return {
      id: claudeRow.id,
      text: claudeRow.text,
      domain: claudeRow.domain,
      type: claudeRow.type,
      smellType: 'ambiguity',
      claudeLabel: claudeRow.label,
      claudeConfidence: claudeRow.confidence,
      chatgptLabel: chatgptRow.label,
      chatgptConfidence: chatgptRow.confidence,
      agreementStatus,
    }
  })
}

export function buildInterfaceReports(
  requirements: RequirementRow[],
  fileName: string,
): {
  claudeReport: ModelReport
  chatgptReport: ModelReport
  comparison: ComparisonReport
} {
  const claudeReport = buildModelReport(requirements, fileName, 'claude')
  const chatgptReport = buildModelReport(requirements, fileName, 'chatgpt')
  const rows = buildComparisonRows(claudeReport, chatgptReport)
  const fullAgreement = rows.filter((row) => row.agreementStatus === 'AGREE').length
  const bothClean = rows.filter(
    (row) => row.claudeLabel === 'CLEAN' && row.chatgptLabel === 'CLEAN',
  ).length
  const claudeOnly = rows.filter(
    (row) => row.claudeLabel === 'SMELL' && row.chatgptLabel === 'CLEAN',
  ).length
  const chatgptOnly = rows.filter(
    (row) => row.claudeLabel === 'CLEAN' && row.chatgptLabel === 'SMELL',
  ).length

  return {
    claudeReport,
    chatgptReport,
    comparison: {
      generatedAt: new Date().toISOString(),
      fileName,
      stats: {
        fullAgreement,
        claudeOnly,
        chatgptOnly,
        bothClean,
        agreementRate: percentage(fullAgreement, rows.length),
        bySmellType: createBreakdowns(
          rows.map((row) => ({
            name: row.smellType,
            label: row.agreementStatus === 'AGREE' ? 'CLEAN' : 'SMELL',
          })),
        ),
        byDomain: createBreakdowns(
          rows.map((row) => ({
            name: row.domain,
            label: row.agreementStatus === 'AGREE' ? 'CLEAN' : 'SMELL',
          })),
        ),
      },
      rows,
    },
  }
}

