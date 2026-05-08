import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  FileMetadata,
  RequirementRow,
  RunConfig,
  WizardStep,
} from '../../types'

interface WizardState {
  step: WizardStep
  file: FileMetadata | null
  requirements: RequirementRow[]
  config: RunConfig
}

const initialState: WizardState = {
  step: 'upload',
  file: null,
  requirements: [],
  config: {
    temperature: 0.1,
    maxGroupSize: 20,
  },
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
    setConfig(state, action: PayloadAction<Partial<RunConfig>>) {
      state.config = { ...state.config, ...action.payload }
    },
    reset() {
      return initialState
    },
  },
})

export const { setStep, setFile, setRequirements, setConfig, reset } =
  wizardSlice.actions

export const wizardReducer = wizardSlice.reducer

