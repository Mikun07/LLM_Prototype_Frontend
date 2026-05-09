import type {
  AmbiguityResult,
  BreakdownValue,
  ColumnDetection,
  ComparisonReport,
  ComparisonRow,
  ConfidenceLevel,
  FileMetadata,
  InconsistencyResult,
  ModelName,
  ModelReport,
  RequirementRow,
  RequirementType,
  SmellLabel,
} from '../types'

const generatedAt = '2026-05-09T20:34:09.000Z'
const fileName = 'Requirement RESULT.pdf'

export const sampleDashboardFile: FileMetadata = {
  name: fileName,
  size: 128_040,
  rowCount: 11,
}

export const sampleDashboardDetection: ColumnDetection = {
  id: true,
  text: true,
  domain: true,
  type: true,
  project: true,
}

export const sampleDashboardRequirements: RequirementRow[] = [
  {
    id: 'R1',
    text: 'The system shall allow users to create orders quickly upon request.',
    domain: 'Orders',
    type: 'FR',
    project: 'Requirement Result Preview',
  },
  {
    id: 'R2',
    text: 'The system shall allow only admins to authenticate new users.',
    domain: 'Access Control',
    type: 'FR',
    project: 'Requirement Result Preview',
  },
  {
    id: 'R3',
    text: 'The system shall allow the new users to authenticate themselves.',
    domain: 'Access Control',
    type: 'FR',
    project: 'Requirement Result Preview',
  },
  {
    id: 'R4',
    text: 'The system shall provide adequate functionality to generate data.',
    domain: 'Data Generation',
    type: 'FR',
    project: 'Requirement Result Preview',
  },
  {
    id: 'R5',
    text: 'The system shall provide only admins with the functionality to generate reports.',
    domain: 'Reporting',
    type: 'FR',
    project: 'Requirement Result Preview',
  },
  {
    id: 'R6',
    text: 'The users shall be able to view accounts.',
    domain: 'Accounts',
    type: 'FR',
    project: 'Requirement Result Preview',
  },
  {
    id: 'R7',
    text: 'The system should have an easy-to-use interface.',
    domain: 'Usability',
    type: 'NFR',
    project: 'Requirement Result Preview',
  },
  {
    id: 'R8',
    text: 'The system shall create a daily backup of the database at 02:00 GMT.',
    domain: 'Backup',
    type: 'NFR',
    project: 'Requirement Result Preview',
  },
  {
    id: 'R9',
    text: 'The system shall encrypt stored user passwords.',
    domain: 'Security',
    type: 'NFR',
    project: 'Requirement Result Preview',
  },
  {
    id: 'R10',
    text: 'The system shall automatically create transactions.',
    domain: 'Transactions',
    type: 'FR',
    project: 'Requirement Result Preview',
  },
  {
    id: 'R11',
    text: 'The system shall create transactions after an order is placed.',
    domain: 'Transactions',
    type: 'FR',
    project: 'Requirement Result Preview',
  },
]

interface AmbiguitySample {
  id: string
  label: SmellLabel
  confidence: ConfidenceLevel
  explanation: string
  suggestion: string
}

interface PairSample {
  reqAId: string
  reqBId: string
  domain: string
  label: SmellLabel
  confidence: ConfidenceLevel
  explanation: string
  suggestion: string
}

const claudeAmbiguitySamples: AmbiguitySample[] = [
  {
    id: 'R1',
    label: 'SMELL',
    confidence: 'HIGH',
    explanation: 'The terms "quickly" and "upon request" are subjective and do not define a measurable response time.',
    suggestion: 'The system shall create an order within 2 seconds after the user submits a valid order request.',
  },
  {
    id: 'R2',
    label: 'SMELL',
    confidence: 'MEDIUM',
    explanation: 'The phrase "authenticate new users" is unclear because admins usually approve or activate accounts rather than authenticate as users.',
    suggestion: 'The system shall allow only administrators to approve and activate newly registered user accounts.',
  },
  {
    id: 'R3',
    label: 'SMELL',
    confidence: 'MEDIUM',
    explanation: 'The phrase "authenticate themselves" is unclear and overlaps with the account activation rule in R2.',
    suggestion: 'New users shall log in with their own credentials after an administrator activates the account.',
  },
  {
    id: 'R4',
    label: 'SMELL',
    confidence: 'HIGH',
    explanation: 'The phrase "adequate functionality" is subjective and the required data type is not specified.',
    suggestion: 'The system shall generate sales and user activity data for reporting and analytics.',
  },
  {
    id: 'R5',
    label: 'SMELL',
    confidence: 'MEDIUM',
    explanation: 'The action "generate reports" could mean create, view, export, or schedule reports.',
    suggestion: 'The system shall allow only administrators to create and export system reports.',
  },
  {
    id: 'R6',
    label: 'SMELL',
    confidence: 'MEDIUM',
    explanation: 'The actor "users" and the scope of "accounts" are too broad.',
    suggestion: 'Authenticated users shall be able to view only their own account details.',
  },
  {
    id: 'R7',
    label: 'SMELL',
    confidence: 'HIGH',
    explanation: 'The phrase "easy-to-use" is subjective and "should" weakens the requirement.',
    suggestion: 'The interface shall let users complete each core task without training and in no more than three interaction steps.',
  },
  {
    id: 'R8',
    label: 'CLEAN',
    confidence: 'HIGH',
    explanation: 'The backup frequency and exact time are stated clearly.',
    suggestion: '',
  },
  {
    id: 'R9',
    label: 'SMELL',
    confidence: 'HIGH',
    explanation: 'The word "encrypt" is imprecise for passwords because stored passwords should normally be hashed and salted.',
    suggestion: 'The system shall store user passwords using a salted one-way cryptographic hash.',
  },
  {
    id: 'R10',
    label: 'SMELL',
    confidence: 'MEDIUM',
    explanation: 'The term "transactions" is undefined and the trigger for automatic creation is missing.',
    suggestion: 'The system shall create a transaction record for each completed order.',
  },
  {
    id: 'R11',
    label: 'SMELL',
    confidence: 'MEDIUM',
    explanation: 'The requirement does not define whether the transaction is financial, operational, or audit related.',
    suggestion: 'The system shall create a financial transaction record immediately after an order is confirmed.',
  },
]

const chatgptAmbiguitySamples: AmbiguitySample[] = [
  claudeAmbiguitySamples[0],
  {
    id: 'R2',
    label: 'CLEAN',
    confidence: 'MEDIUM',
    explanation: 'This result treats the admin action as account approval rather than user login.',
    suggestion: '',
  },
  claudeAmbiguitySamples[2],
  claudeAmbiguitySamples[3],
  claudeAmbiguitySamples[4],
  {
    id: 'R6',
    label: 'CLEAN',
    confidence: 'MEDIUM',
    explanation: 'This result assumes "users" means authenticated application users and "accounts" means their own profile records.',
    suggestion: '',
  },
  claudeAmbiguitySamples[6],
  claudeAmbiguitySamples[7],
  claudeAmbiguitySamples[8],
  {
    id: 'R10',
    label: 'CLEAN',
    confidence: 'LOW',
    explanation: 'This result interprets transaction creation as a normal order-processing action.',
    suggestion: '',
  },
  claudeAmbiguitySamples[10],
]

const claudeInconsistencySamples: PairSample[] = [
  {
    reqAId: 'R2',
    reqBId: 'R3',
    domain: 'Access Control',
    label: 'SMELL',
    confidence: 'HIGH',
    explanation: 'R2 assigns new-user authentication to admins while R3 says new users authenticate themselves.',
    suggestion: 'Separate administrator account activation from user login authentication.',
  },
  {
    reqAId: 'R4',
    reqBId: 'R5',
    domain: 'Reporting',
    label: 'CLEAN',
    confidence: 'MEDIUM',
    explanation: 'Data generation and report generation can be separate capabilities.',
    suggestion: '',
  },
  {
    reqAId: 'R10',
    reqBId: 'R11',
    domain: 'Transactions',
    label: 'SMELL',
    confidence: 'MEDIUM',
    explanation: 'R10 says transactions are created automatically, while R11 narrows the trigger to after order placement.',
    suggestion: 'Use one transaction rule that names the trigger, timing, and transaction type.',
  },
]

const chatgptInconsistencySamples: PairSample[] = [
  claudeInconsistencySamples[0],
  claudeInconsistencySamples[1],
  {
    reqAId: 'R10',
    reqBId: 'R11',
    domain: 'Transactions',
    label: 'CLEAN',
    confidence: 'MEDIUM',
    explanation: 'This result treats R11 as a clarification of the automatic behavior in R10.',
    suggestion: '',
  },
]

function percentage(part: number, total: number): number {
  return total === 0 ? 0 : Number(((part / total) * 100).toFixed(1))
}

function createBreakdowns(
  rows: readonly { name: string; label: SmellLabel }[],
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

function findRequirement(id: string): RequirementRow {
  const requirement = sampleDashboardRequirements.find((row) => row.id === id)

  if (requirement === undefined) {
    throw new Error(`Missing sample requirement ${id}`)
  }

  return requirement
}

function asDomain(row: RequirementRow): string {
  return row.domain ?? 'General'
}

function asType(row: RequirementRow): RequirementType {
  return row.type ?? 'UNKNOWN'
}

function buildAmbiguityRows(samples: readonly AmbiguitySample[]): AmbiguityResult[] {
  return samples.map((sample) => {
    const requirement = findRequirement(sample.id)

    return {
      id: requirement.id,
      text: requirement.text,
      domain: asDomain(requirement),
      type: asType(requirement),
      label: sample.label,
      confidence: sample.confidence,
      explanation: sample.explanation,
      suggestion: sample.suggestion,
    }
  })
}

function buildInconsistencyRows(samples: readonly PairSample[]): InconsistencyResult[] {
  return samples.map((sample) => {
    const first = findRequirement(sample.reqAId)
    const second = findRequirement(sample.reqBId)

    return {
      reqAId: first.id,
      reqBId: second.id,
      reqAText: first.text,
      reqBText: second.text,
      domain: sample.domain,
      label: sample.label,
      confidence: sample.confidence,
      explanation: sample.explanation,
      suggestion: sample.suggestion,
    }
  })
}

function buildStats(
  ambiguityResults: readonly AmbiguityResult[],
  inconsistencyResults: readonly InconsistencyResult[],
) {
  const rows = [
    ...ambiguityResults.map((row) => ({
      smellType: 'Ambiguity',
      domain: row.domain,
      requirementType: String(row.type),
      label: row.label,
    })),
    ...inconsistencyResults.map((row) => ({
      smellType: 'Inconsistency',
      domain: row.domain,
      requirementType: 'Pair',
      label: row.label,
    })),
  ]
  const total = rows.length
  const smells = rows.filter((row) => row.label === 'SMELL').length

  return {
    total,
    smells,
    clean: total - smells,
    smellRate: percentage(smells, total),
    bySmellType: createBreakdowns(
      rows.map((row) => ({ name: row.smellType, label: row.label })),
    ),
    byDomain: createBreakdowns(
      rows.map((row) => ({ name: row.domain, label: row.label })),
    ),
    byRequirementType: createBreakdowns(
      rows.map((row) => ({ name: row.requirementType, label: row.label })),
    ),
  }
}

function buildModelReport(
  model: ModelName,
  ambiguitySamples: readonly AmbiguitySample[],
  inconsistencySamples: readonly PairSample[],
): ModelReport {
  const ambiguityResults = buildAmbiguityRows(ambiguitySamples)
  const inconsistencyResults = buildInconsistencyRows(inconsistencySamples)

  return {
    model,
    generatedAt,
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
      agreementStatus: claudeRow.label === chatgptRow.label ? 'AGREE' : 'DISAGREE',
    }
  })
}

function buildComparisonReport(
  claudeReport: ModelReport,
  chatgptReport: ModelReport,
): ComparisonReport {
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
    generatedAt,
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
  }
}

const claudeReport = buildModelReport(
  'claude',
  claudeAmbiguitySamples,
  claudeInconsistencySamples,
)
const chatgptReport = buildModelReport(
  'chatgpt',
  chatgptAmbiguitySamples,
  chatgptInconsistencySamples,
)

export const sampleDashboardResult = {
  claudeReport,
  chatgptReport,
  comparison: buildComparisonReport(claudeReport, chatgptReport),
}
