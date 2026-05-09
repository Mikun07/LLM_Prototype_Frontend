import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  ComparisonReport,
  ModelReport,
  PipelineKey,
  PipelineProgress,
} from '../../types'

type AnalysisStatus = 'idle' | 'running' | 'complete' | 'error'

interface AnalysisState {
  runId: string | null
  status: AnalysisStatus
  progress: Record<PipelineKey, PipelineProgress>
  claudeReport: ModelReport | null
  chatgptReport: ModelReport | null
  comparison: ComparisonReport | null
  error: string | null
}

const createPipelineProgress = (): PipelineProgress => ({
  percentage: 0,
  processed: 0,
  total: 0,
  status: 'queued',
  error: null,
})

const createProgressState = (): Record<PipelineKey, PipelineProgress> => ({
  claudeAmbiguity: createPipelineProgress(),
  claudeInconsistency: createPipelineProgress(),
  chatgptAmbiguity: createPipelineProgress(),
  chatgptInconsistency: createPipelineProgress(),
})

const initialState: AnalysisState = {
  runId: null,
  status: 'idle',
  progress: createProgressState(),
  claudeReport: null,
  chatgptReport: null,
  comparison: null,
  error: null,
}

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    startRun(state, action: PayloadAction<{ runId: string }>) {
      state.runId = action.payload.runId
      state.status = 'running'
      state.error = null
      state.claudeReport = null
      state.chatgptReport = null
      state.comparison = null
      state.progress = createProgressState()
    },
    prepareRun(state) {
      state.runId = null
      state.status = 'running'
      state.error = null
      state.claudeReport = null
      state.chatgptReport = null
      state.comparison = null
      state.progress = createProgressState()
    },
    updateProgress(
      state,
      action: PayloadAction<{
        pipeline: PipelineKey
        progress: PipelineProgress
      }>,
    ) {
      state.progress[action.payload.pipeline] = action.payload.progress
    },
    completeRun(
      state,
      action: PayloadAction<{
        status?: AnalysisStatus
        claudeReport: ModelReport | null
        chatgptReport: ModelReport | null
        comparison: ComparisonReport | null
        error?: string | null
      }>,
    ) {
      state.status = action.payload.status ?? 'complete'
      state.claudeReport = action.payload.claudeReport
      state.chatgptReport = action.payload.chatgptReport
      state.comparison = action.payload.comparison
      state.error = action.payload.error ?? null
    },
    setPipelineError(
      state,
      action: PayloadAction<{ pipeline: PipelineKey; error: string }>,
    ) {
      const progress = state.progress[action.payload.pipeline]
      state.progress[action.payload.pipeline] = {
        ...progress,
        status: 'error',
        error: action.payload.error,
      }
    },
    setError(state, action: PayloadAction<string>) {
      state.status = 'error'
      state.error = action.payload
    },
    resetRun() {
      return initialState
    },
  },
})

export const {
  prepareRun,
  startRun,
  updateProgress,
  completeRun,
  setPipelineError,
  setError,
  resetRun,
} = analysisSlice.actions

export const analysisReducer = analysisSlice.reducer
