import { useEffect, useRef, useState } from 'react'
import { getApiErrorMessage, getRunStatus, startAnalysis } from '../api/client'
import { pipelines } from '../constants/pipelines'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  completeRun,
  prepareRun,
  resetRun,
  startRun,
  setError,
  updateProgress,
} from '../store/slices/analysisSlice'
import { setStep } from '../store/slices/wizardSlice'
import type { PipelineKey, RunStatusResponse } from '../types'

interface UseAnalysisRunReturn {
  startInterfaceRun: () => void
  cancelRun: () => void
  isRunning: boolean
}

function progressFor(
  response: RunStatusResponse,
  pipeline: PipelineKey,
): string | null {
  return response.progress[pipeline].error
}

export function useAnalysisRun(): UseAnalysisRunReturn {
  const dispatch = useAppDispatch()
  const { requirements, file, config } = useAppSelector((state) => state.wizard)
  const isRunning = useAppSelector((state) => state.analysis.status === 'running')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelledRef = useRef(false)
  const [localRunning, setLocalRunning] = useState(false)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        globalThis.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function waitForNextPoll(): Promise<void> {
    return new Promise((resolve) => {
      timeoutRef.current = globalThis.setTimeout(() => {
        timeoutRef.current = null
        resolve()
      }, 1200)
    })
  }

  function applyRunStatus(response: RunStatusResponse): void {
    pipelines.forEach((pipeline) => {
      dispatch(
        updateProgress({
          pipeline: pipeline.key,
          progress: response.progress[pipeline.key],
        }),
      )
    })
  }

  function firstRunError(response: RunStatusResponse): string {
    const errors = pipelines
      .map((pipeline) => progressFor(response, pipeline.key))
      .filter((error): error is string => error !== null && error.trim() !== '')

    return errors[0] ?? 'The analysis run ended with an error.'
  }

  async function pollRun(runId: string): Promise<void> {
    while (!cancelledRef.current) {
      const response = await getRunStatus(runId)
      applyRunStatus(response)

      if (response.status === 'complete') {
        dispatch(
          completeRun({
            status: 'complete',
            claudeReport: response.claudeReport,
            chatgptReport: response.chatgptReport,
            comparison: response.comparison,
          }),
        )
        dispatch(setStep('dashboard'))
        return
      }

      if (response.status === 'error') {
        const message = firstRunError(response)

        dispatch(
          completeRun({
            status: 'error',
            claudeReport: response.claudeReport,
            chatgptReport: response.chatgptReport,
            comparison: response.comparison,
            error: message,
          }),
        )
        return
      }

      await waitForNextPoll()
    }
  }

  async function startBackendRun(): Promise<void> {
    if (requirements.length === 0 || file === null || localRunning) {
      return
    }

    if (timeoutRef.current !== null) {
      globalThis.clearTimeout(timeoutRef.current)
    }

    cancelledRef.current = false
    setLocalRunning(true)
    dispatch(prepareRun())
    dispatch(setStep('run'))

    try {
      const started = await startAnalysis({
        requirements,
        config,
        fileName: file.name,
      })

      if (!cancelledRef.current) {
        dispatch(startRun({ runId: started.runId }))
        await pollRun(started.runId)
      }
    } catch (error) {
      if (!cancelledRef.current) {
        const message = getApiErrorMessage(error)

        dispatch(setError(message))
      }
    } finally {
      setLocalRunning(false)
    }
  }

  function startInterfaceRun(): void {
    void startBackendRun()
  }

  function cancelRun(): void {
    cancelledRef.current = true
    if (timeoutRef.current !== null) {
      globalThis.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setLocalRunning(false)
    dispatch(resetRun())
    dispatch(setStep('configure'))
  }

  return { startInterfaceRun, cancelRun, isRunning: isRunning || localRunning }
}
