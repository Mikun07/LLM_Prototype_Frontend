export type WizardStep = 'upload' | 'configure' | 'run' | 'dashboard'

export type ModelName = 'claude' | 'chatgpt'

export type SmellType = 'ambiguity' | 'inconsistency'

export type RequirementType = 'FR' | 'NFR' | 'UNKNOWN'

export type SmellLabel = 'SMELL' | 'CLEAN'

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW'

export type AgreementStatus = 'AGREE' | 'DISAGREE'

export type PipelineKey =
  | 'claudeAmbiguity'
  | 'claudeInconsistency'
  | 'chatgptAmbiguity'
  | 'chatgptInconsistency'

export type PipelineStatus = 'queued' | 'running' | 'complete' | 'error'

export interface FileMetadata {
  name: string
  size: number
  rowCount: number
}

export interface RequirementRow {
  id: string
  text: string
  domain?: string
  type?: RequirementType | string
  project?: string
}

export interface ParsedFile {
  metadata: FileMetadata
  rows: RequirementRow[]
  detectedColumns: string[]
}

export interface RunConfig {
  temperature: number
  maxGroupSize: number
}

export interface PipelineProgress {
  percentage: number
  processed: number
  total: number
  status: PipelineStatus
  error: string | null
}

export interface BreakdownValue {
  name: string
  total: number
  smells: number
  clean: number
  smellRate: number
}

export interface ReportStats {
  total: number
  smells: number
  clean: number
  smellRate: number
  bySmellType: BreakdownValue[]
  byDomain: BreakdownValue[]
  byRequirementType: BreakdownValue[]
}

export interface AmbiguityResult {
  id: string
  text: string
  domain: string
  type: RequirementType | string
  label: SmellLabel
  confidence: ConfidenceLevel
  explanation: string
  suggestion: string
}

export interface InconsistencyResult {
  reqAId: string
  reqBId: string
  reqAText: string
  reqBText: string
  domain: string
  label: SmellLabel
  confidence: ConfidenceLevel
  explanation: string
  suggestion: string
}

export interface ModelReport {
  model: ModelName
  generatedAt: string
  fileName: string
  stats: ReportStats
  ambiguityResults: AmbiguityResult[]
  inconsistencyResults: InconsistencyResult[]
}

export interface ComparisonStats {
  fullAgreement: number
  claudeOnly: number
  chatgptOnly: number
  bothClean: number
  agreementRate: number
  bySmellType: BreakdownValue[]
  byDomain: BreakdownValue[]
}

export interface ComparisonRow {
  id: string
  text: string
  domain: string
  type: RequirementType | string
  smellType: SmellType
  claudeLabel: SmellLabel
  claudeConfidence: ConfidenceLevel
  chatgptLabel: SmellLabel
  chatgptConfidence: ConfidenceLevel
  agreementStatus: AgreementStatus
}

export interface ComparisonReport {
  generatedAt: string
  fileName: string
  stats: ComparisonStats
  rows: ComparisonRow[]
}

export interface AnalyseRequest {
  requirements: RequirementRow[]
  config: RunConfig
}

export interface UploadResponse {
  file: FileMetadata
  requirements: RequirementRow[]
  detectedColumns: string[]
}

export interface RunStatusResponse {
  runId: string
  progress: Record<PipelineKey, PipelineProgress>
  claudeReport: ModelReport | null
  chatgptReport: ModelReport | null
  comparison: ComparisonReport | null
}

