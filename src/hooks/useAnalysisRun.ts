import { useEffect, useRef, useState } from 'react'
import { pipelines } from '../constants/pipelines'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  completeRun,
  resetRun,
  startRun,
  updateProgress,
} from '../store/slices/analysisSlice'
import { setStep } from '../store/slices/wizardSlice'
import type { PipelineKey, PipelineProgress } from '../types'
import { buildInterfaceReports } from '../utils/reportFactory'

interface UseAnalysisRunReturn {
  startInterfaceRun: () => void
  cancelRun: () => void
  isRunning: boolean
}

function progressFor(
  pipeline: PipelineKey,
  percentage: number,
  total: number,
): PipelineProgress {
  const processed = Math.round((percentage / 100) * total)

  return {
    percentage,
    processed,
    total,
    status: percentage >= 100 ? 'complete' : 'running',
    error: null,
  }
}

export function useAnalysisRun(): UseAnalysisRunReturn {
  const dispatch = useAppDispatch()
  const { requirements, file, config } = useAppSelector((state) => state.wizard)
  const isRunning = useAppSelector((state) => state.analysis.status === 'running')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [localRunning, setLocalRunning] = useState(false)

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        globalThis.clearInterval(intervalRef.current)
      }
    }
  }, [])

  function startInterfaceRun(): void {
    if (requirements.length === 0 || file === null || localRunning) {
      return
    }

    if (intervalRef.current !== null) {
      globalThis.clearInterval(intervalRef.current)
    }

    const activePipelines = pipelines.filter(
      (p) => config.selectedModels.includes(p.model) && config.selectedSmellTypes.includes(p.smellType),
    )

    setLocalRunning(true)
    dispatch(startRun({ runId: `interface-${Date.now()}` }))
    dispatch(setStep('run'))

    let tick = 0
    const total = Math.max(requirements.length, 1)

    intervalRef.current = globalThis.setInterval(() => {
      tick += 1
      const base = Math.min(100, tick * 12)

      activePipelines.forEach((pipeline, index) => {
        const percentage = Math.min(100, Math.max(5, base - index * 8))
        dispatch(
          updateProgress({
            pipeline: pipeline.key,
            progress: progressFor(pipeline.key, percentage, total),
          }),
        )
      })

      if (base >= 124) {
        if (intervalRef.current !== null) {
          globalThis.clearInterval(intervalRef.current)
          intervalRef.current = null
        }

        const reports = buildInterfaceReports(requirements, file.name)
        dispatch(completeRun(reports))
        dispatch(setStep('dashboard'))
        setLocalRunning(false)
      }
    }, 450)
  }

  function cancelRun(): void {
    if (intervalRef.current !== null) {
      globalThis.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setLocalRunning(false)
    dispatch(resetRun())
    dispatch(setStep('configure'))
  }

  return { startInterfaceRun, cancelRun, isRunning: isRunning || localRunning }
}
