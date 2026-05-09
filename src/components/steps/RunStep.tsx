import { AlertTriangle, ArrowLeft, BarChart3, CheckCircle2, Clock, Cpu, Loader2, X } from 'lucide-react'
import { getReadableRunErrorMessage } from '../../api/client'
import { useAnalysisRun } from '../../hooks/useAnalysisRun'
import { pipelines } from '../../constants/pipelines'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setStep } from '../../store/slices/wizardSlice'
import { Button } from '../shared/Button'

const pipelineCardStyles: Record<string, { accent: string; strip: string }> = {
  claudeAmbiguity: { accent: 'text-brand-600', strip: 'from-brand-400 to-fuchsia-500' },
  claudeInconsistency: {
    accent: 'text-accent-600',
    strip: 'from-amber-400 to-fuchsia-500',
  },
  chatgptAmbiguity: { accent: 'text-teal-600', strip: 'from-teal-400 to-emerald-500' },
  chatgptInconsistency: {
    accent: 'text-indigo-600',
    strip: 'from-sky-400 to-indigo-500',
  },
}

function StatusIcon({ status }: { readonly status: string }) {
  if (status === 'complete') {
    return <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-teal-500" />
  }

  if (status === 'error') {
    return <AlertTriangle aria-hidden="true" className="h-5 w-5 text-rose-500" />
  }

  if (status === 'running') {
    return <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin text-brand-500" />
  }

  return <Clock aria-hidden="true" className="h-5 w-5 text-slate-300" />
}

export function RunStep() {
  const dispatch = useAppDispatch()
  const { cancelRun, isRunning } = useAnalysisRun()
  const analysisStatus = useAppSelector((state) => state.analysis.status)
  const progress = useAppSelector((state) => state.analysis.progress)
  const { selectedModels, selectedSmellTypes } = useAppSelector((state) => state.wizard.config)
  const requirements = useAppSelector((state) => state.wizard.requirements)

  const activePipelines = pipelines.filter(
    (pipeline) =>
      selectedModels.includes(pipeline.model) &&
      selectedSmellTypes.includes(pipeline.smellType),
  )

  const overall =
    activePipelines.length === 0
      ? 0
      : Math.round(
          activePipelines.reduce((sum, pipeline) => sum + progress[pipeline.key].percentage, 0) /
            activePipelines.length,
        )

  const allDone =
    activePipelines.length > 0 &&
    activePipelines.every((pipeline) => progress[pipeline.key].status === 'complete')
  const anyRunning = activePipelines.some(
    (pipeline) => progress[pipeline.key].status === 'running',
  )
  const hasPipelineError = activePipelines.some(
    (pipeline) =>
      progress[pipeline.key].status === 'error' || progress[pipeline.key].error !== null,
  )
  const anyError = analysisStatus === 'error' || hasPipelineError

  let statusLabel: string
  if (anyError) {
    statusLabel = 'Analysis needs attention'
  } else if (allDone) {
    statusLabel = 'Analysis complete'
  } else if (anyRunning) {
    statusLabel = 'Analysis running...'
  } else {
    statusLabel = 'Preparing pipelines...'
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-sky-50/60 to-fuchsia-50/70 p-5 shadow-[0_18px_42px_-30px_rgba(79,70,229,0.55)]">
        <div className="flex items-center gap-3">
          <div
            className={[
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm',
              anyError ? 'bg-rose-100' : allDone ? 'bg-teal-100' : 'bg-white/85',
            ].join(' ')}
          >
            {anyError ? (
              <AlertTriangle aria-hidden="true" className="h-5 w-5 text-rose-600" />
            ) : allDone ? (
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-teal-600" />
            ) : (
              <Cpu
                aria-hidden="true"
                className={[
                  'h-5 w-5 text-brand-600',
                  anyRunning ? 'animate-pulse' : '',
                ].join(' ')}
              />
            )}
          </div>
          <div>
            <p className="font-display text-base font-bold text-slate-900">{statusLabel}</p>
            <p className="text-sm text-slate-500">
              {activePipelines.length} pipeline
              {activePipelines.length === 1 ? '' : 's'} - {requirements.length} requirement
              {requirements.length === 1 ? '' : 's'}
            </p>
          </div>
          <p className="ml-auto font-mono text-3xl font-bold text-brand-600">{overall}%</p>
        </div>

        <div className="mt-4">
          <progress
            aria-label="Overall progress"
            className="progress-gradient h-2 w-full overflow-hidden rounded-full"
            max={100}
            value={overall}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activePipelines.map((pipeline) => {
          const pipelineProgress = progress[pipeline.key]
          const style = pipelineCardStyles[pipeline.key]

          return (
            <div
              className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-sky-50/60 to-fuchsia-50/70 p-5 shadow-[0_18px_42px_-30px_rgba(79,70,229,0.55)]"
              key={pipeline.key}
            >
              <div className="mb-4 flex items-center gap-3">
                <StatusIcon status={pipelineProgress.status} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold text-slate-800">
                    {pipeline.label}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{pipelineProgress.status}</p>
                </div>
                <span className={['font-mono text-lg font-bold', style.accent].join(' ')}>
                  {pipelineProgress.percentage}%
                </span>
              </div>

              <progress
                aria-label={`${pipeline.label} progress`}
                className="progress-gradient h-1.5 w-full overflow-hidden rounded-full"
                max={100}
                value={pipelineProgress.percentage}
              />

              <p className="mt-3 font-mono text-xs text-slate-500">
                {pipelineProgress.processed} / {pipelineProgress.total} requirements processed
              </p>
              {pipelineProgress.error === null ? null : (
                <p className="mt-2 text-xs font-medium text-rose-700">
                  {getReadableRunErrorMessage(pipelineProgress.error)}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          disabled={isRunning}
          icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />}
          onClick={() => dispatch(setStep('configure'))}
          variant="secondary"
        >
          Back
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row">
          {isRunning ? (
            <Button
              icon={<X aria-hidden="true" className="h-4 w-4" />}
              onClick={cancelRun}
              variant="secondary"
            >
              Cancel
            </Button>
          ) : null}
          {allDone ? (
            <Button
              icon={<BarChart3 aria-hidden="true" className="h-4 w-4" />}
              onClick={() => dispatch(setStep('dashboard'))}
            >
              View Results
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
