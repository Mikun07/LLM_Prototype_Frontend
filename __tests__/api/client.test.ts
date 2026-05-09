import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it } from 'vitest'
import {
  getApiErrorMessage,
  getApiErrorStatus,
  getReadableRunErrorMessage,
} from '../../src/api/client'

function apiError(status: number, data: unknown): AxiosError {
  const config: InternalAxiosRequestConfig = {
    headers: new AxiosHeaders(),
  }

  return new AxiosError('Request failed', undefined, config, {}, {
    config,
    data,
    headers: new AxiosHeaders(),
    status,
    statusText: 'Error',
  })
}

describe('api error handling', () => {
  it('keeps provider unavailable messages short', () => {
    const error = apiError(503, {
      detail: {
        code: 'provider_unavailable',
        message: 'Selected AI provider unavailable.',
        providers: ['Claude'],
      },
    })

    expect(getApiErrorStatus(error)).toBe(503)
    expect(getApiErrorMessage(error)).toBe('Claude unavailable.')
  })

  it('formats multiple unavailable providers without implementation details', () => {
    const error = apiError(503, {
      detail: {
        code: 'provider_unavailable',
        message: 'Selected AI provider unavailable.',
        providers: ['Claude', 'ChatGPT'],
      },
    })

    expect(getApiErrorMessage(error)).toBe('Claude and ChatGPT unavailable.')
  })

  it('keeps OpenAI quota messages concise', () => {
    const error = apiError(429, {
      detail: 'OpenAI API quota is exhausted (429 insufficient_quota).',
    })

    expect(getApiErrorMessage(error)).toBe(
      'OpenAI quota exhausted. Check billing or use mock mode.',
    )
  })

  it('shortens verbose provider billing errors from run progress', () => {
    expect(
      getReadableRunErrorMessage(
        'Anthropic request failed: Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits.',
      ),
    ).toBe('Claude billing issue. Add credits or use mock mode.')

    expect(
      getReadableRunErrorMessage(
        'OpenAI request failed: You exceeded your current quota. insufficient_quota',
      ),
    ).toBe('ChatGPT billing issue. Add credits or use mock mode.')
  })

  it('uses concise status fallbacks', () => {
    expect(getApiErrorMessage(apiError(503, {}))).toBe(
      'Selected AI provider unavailable.',
    )
    expect(getApiErrorMessage(apiError(429, {}))).toBe(
      'Provider limit reached. Try again soon.',
    )
    expect(getApiErrorMessage(apiError(404, {}))).toBe(
      'Requested run was not found.',
    )
  })
})
