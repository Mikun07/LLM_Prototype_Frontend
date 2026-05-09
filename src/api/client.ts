import axios from 'axios'
import type {
  AnalyseRequest,
  RunStatusResponse,
  StartRunResponse,
  UploadResponse,
} from '../types'

const api = axios.create({
  baseURL: '/api',
})

export async function uploadCsv(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function detailToMessage(detail: unknown): string | null {
  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (isRecord(item) && typeof item.msg === 'string' ? item.msg : null))
      .filter((item): item is string => item !== null)

    return messages.length > 0 ? messages.join(' ') : null
  }

  if (!isRecord(detail)) {
    return null
  }

  const message = typeof detail.message === 'string' ? detail.message : null
  const providers = Array.isArray(detail.providers)
    ? detail.providers.filter((item): item is string => typeof item === 'string')
    : []

  if (message !== null && providers.length > 0) {
    return `${message} ${providers.join(' ')}`
  }

  return message
}

export function getApiErrorStatus(error: unknown): number | null {
  return axios.isAxiosError(error) ? error.response?.status ?? null : null
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Unexpected application error.'
  }

  const data = error.response?.data
  const detail = isRecord(data) ? detailToMessage(data.detail) : null

  if (detail !== null) {
    if (detail.includes('429') && detail.includes('insufficient_quota')) {
      return (
        'OpenAI API quota is exhausted. Check OpenAI Platform billing and usage, ' +
        'add API credits, or switch the backend to mock mode.'
      )
    }

    return detail
  }

  if (error.response?.status === 429) {
    return 'The provider rate limit or quota was reached. Wait and retry, or check API billing.'
  }

  if (error.response?.status === 503) {
    return 'The selected model provider is currently unavailable.'
  }

  return error.message
}

export async function startAnalysis(payload: AnalyseRequest): Promise<StartRunResponse> {
  const response = await api.post<StartRunResponse>('/analyse', payload)

  return response.data
}

export async function getRunStatus(
  runId: string,
): Promise<RunStatusResponse> {
  const response = await api.get<RunStatusResponse>(`/status/${runId}`)

  return response.data
}
