import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RunStatusResponse } from '../../src/types'

const apiMocks = vi.hoisted(() => ({
  create: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    create: apiMocks.create,
    isAxiosError: vi.fn(() => false),
  },
}))

describe('api client requests', () => {
  beforeEach(() => {
    vi.resetModules()
    apiMocks.create.mockReset()
    apiMocks.get.mockReset()
    apiMocks.post.mockReset()
    apiMocks.create.mockReturnValue({
      get: apiMocks.get,
      post: apiMocks.post,
    })
  })

  it('posts to the backend cancel endpoint', async () => {
    const response: RunStatusResponse = {
      runId: 'run_123',
      status: 'cancelled',
      progress: {
        claudeAmbiguity: {
          percentage: 0,
          processed: 0,
          total: 0,
          status: 'cancelled',
          error: null,
        },
        claudeInconsistency: {
          percentage: 0,
          processed: 0,
          total: 0,
          status: 'cancelled',
          error: null,
        },
        chatgptAmbiguity: {
          percentage: 0,
          processed: 0,
          total: 0,
          status: 'cancelled',
          error: null,
        },
        chatgptInconsistency: {
          percentage: 0,
          processed: 0,
          total: 0,
          status: 'cancelled',
          error: null,
        },
      },
      claudeReport: null,
      chatgptReport: null,
      comparison: null,
    }
    apiMocks.post.mockResolvedValue({ data: response })

    const { cancelAnalysis } = await import('../../src/api/client')
    const result = await cancelAnalysis('run_123')

    expect(apiMocks.create).toHaveBeenCalledWith({ baseURL: '/api' })
    expect(apiMocks.post).toHaveBeenCalledWith('/cancel/run_123')
    expect(result).toBe(response)
  })
})
