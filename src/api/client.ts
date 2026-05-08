import axios from 'axios'
import type {
  AnalyseRequest,
  RunStatusResponse,
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

export async function startAnalysis(
  payload: AnalyseRequest,
): Promise<{ runId: string }> {
  const response = await api.post<{ runId: string }>('/analyse', payload)

  return response.data
}

export async function getRunStatus(
  runId: string,
): Promise<RunStatusResponse> {
  const response = await api.get<RunStatusResponse>(`/status/${runId}`)

  return response.data
}

