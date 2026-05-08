import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  ColumnDetection,
  FileMetadata,
  RequirementRow,
  RunConfig,
  WizardStep,
} from '../../types'

interface WizardState {
  step: WizardStep
  file: FileMetadata | null
  requirements: RequirementRow[]
  detectedColumns: ColumnDetection
  config: RunConfig
  configReviewed: boolean
}

const initialState: WizardState = {
  step: 'upload',
  file: null,
  requirements: [],
  detectedColumns: {
    id: false,
    text: false,
    domain: false,
    type: false,
    project: false,
  },
  config: {
    temperature: 0.1,
    maxGroupSize: 20,
    selectedModels: ['claude', 'chatgpt'],
    selectedSmellTypes: ['ambiguity', 'inconsistency'],
  },
  configReviewed: false,
}

const wizardSlice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<WizardStep>) {
      state.step = action.payload
    },
    setFile(state, action: PayloadAction<FileMetadata | null>) {
      state.file = action.payload
    },
    setRequirements(state, action: PayloadAction<RequirementRow[]>) {
      state.requirements = action.payload
    },
    setDetectedColumns(state, action: PayloadAction<ColumnDetection>) {
      state.detectedColumns = action.payload
    },
    setConfig(state, action: PayloadAction<Partial<RunConfig>>) {
      state.config = { ...state.config, ...action.payload }
    },
    setConfigReviewed(state, action: PayloadAction<boolean>) {
      state.configReviewed = action.payload
    },
    reset() {
      return initialState
    },
  },
})

export const {
  setStep,
  setFile,
  setRequirements,
  setDetectedColumns,
  setConfig,
  setConfigReviewed,
  reset,
} = wizardSlice.actions

export const wizardReducer = wizardSlice.reducer
