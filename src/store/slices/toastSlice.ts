import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'

export type ToastTone = 'error' | 'info' | 'success' | 'warning'

export interface ToastMessage {
  id: string
  message: string
  title: string
  tone: ToastTone
}

type ToastInput = Omit<ToastMessage, 'id'>

interface ToastState {
  items: ToastMessage[]
}

const initialState: ToastState = {
  items: [],
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: {
      reducer(state, action: PayloadAction<ToastMessage>) {
        state.items.push(action.payload)

        if (state.items.length > 4) {
          state.items.shift()
        }
      },
      prepare(toast: ToastInput) {
        return {
          payload: {
            ...toast,
            id: nanoid(),
          },
        }
      },
    },
    clearToasts(state) {
      state.items = []
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.items = state.items.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { addToast, clearToasts, dismissToast } = toastSlice.actions
export const toastReducer = toastSlice.reducer
