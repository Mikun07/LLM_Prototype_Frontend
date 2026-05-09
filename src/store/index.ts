import { configureStore } from '@reduxjs/toolkit'
import { analysisReducer } from './slices/analysisSlice'
import { wizardReducer } from './slices/wizardSlice'

export const store = configureStore({
  reducer: {
    wizard: wizardReducer,
    analysis: analysisReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
