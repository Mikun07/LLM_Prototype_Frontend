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

function formatProviderList(providers: string[]): string {
  if (providers.length === 0) {
    return 'Selected AI provider'
  }

  if (providers.length === 1) {
    return providers[0]
  }

  if (providers.length === 2) {
    return `${providers[0]} and ${providers[1]}`
  }

  const leadingProviders = providers.slice(0, -1).join(', ')
  const finalProvider = providers[providers.length - 1]
  return `${leadingProviders}, and ${finalProvider}`
}

export function getReadableRunErrorMessage(message: string): string {
  const normalized = message.toLowerCase()

  if (
    normalized.includes('anthropic') &&
    (normalized.includes('credit balance') ||
      normalized.includes('purchase credits') ||
      normalized.includes('billing'))
  ) {
    return 'Claude billing issue. Add credits or use mock mode.'
  }

  if (
    normalized.includes('openai') &&
    (normalized.includes('insufficient_quota') ||
      normalized.includes('current quota') ||
      normalized.includes('billing'))
  ) {
    return 'ChatGPT billing issue. Add credits or use mock mode.'
  }

  if (normalized.includes('rate limit') || normalized.includes('limit reached')) {
    if (normalized.includes('claude') || normalized.includes('anthropic')) {
      return 'Claude limit reached. Try again soon.'
    }

    if (normalized.includes('chatgpt') || normalized.includes('openai')) {
      return 'ChatGPT limit reached. Try again soon.'
    }

    return 'Provider limit reached. Try again soon.'
  }

  return message
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
  const code = typeof detail.code === 'string' ? detail.code : null

  if (code === 'provider_unavailable') {
    return `${formatProviderList(providers)} unavailable.`
  }

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
      return 'OpenAI quota exhausted. Check billing or use mock mode.'
    }

    return getReadableRunErrorMessage(detail)
  }

  if (error.response?.status === 429) {
    return 'Provider limit reached. Try again soon.'
  }

  if (error.response?.status === 503) {
    return 'Selected AI provider unavailable.'
  }

  if (error.response?.status === 404) {
    return 'Requested run was not found.'
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
