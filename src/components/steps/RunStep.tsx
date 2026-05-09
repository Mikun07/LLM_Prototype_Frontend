import { AlertTriangle, ArrowLeft, CheckCircle2, Clock, Cpu, Loader2, X } from 'lucide-react'
import { useAnalysisRun } from '../../hooks/useAnalysisRun'
import { pipelines } from '../../constants/pipelines'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setStep } from '../../store/slices/wizardSlice'
import { Button } from '../shared/Button'

const pipelineCardStyles: Record<string, { border: string; bg: string; accent: string }> = {
  claudeAmbiguity: { border: 'border-brand-200', bg: 'bg-brand-50', accent: 'text-brand-600' },
  claudeInconsistency: {
    border: 'border-accent-200',
    bg: 'bg-accent-50',
    accent: 'text-accent-600',
  },
  chatgptAmbiguity: { border: 'border-teal-200', bg: 'bg-teal-50', accent: 'text-teal-600' },
  chatgptInconsistency: {
    border: 'border-indigo-200',
    bg: 'bg-indigo-50',
    accent: 'text-indigo-600',
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
  const analysisError = useAppSelector((state) => state.analysis.error)
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
  const pipelineErrors = activePipelines
    .map((pipeline) => ({
      label: pipeline.label,
      error: progress[pipeline.key].error,
    }))
    .filter((item): item is { label: string; error: string } => item.error !== null)
  const anyError = analysisStatus === 'error' || pipelineErrors.length > 0

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
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={[
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              anyError ? 'bg-rose-100' : allDone ? 'bg-teal-100' : 'bg-brand-100',
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
            <p className="font-display text-base font-bold text-slate-800">{statusLabel}</p>
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

      {analysisError === null && pipelineErrors.length === 0 ? null : (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
          <p className="font-bold">The backend reported a problem.</p>
          {analysisError === null ? null : <p className="mt-1">{analysisError}</p>}
          {pipelineErrors.map((item) => (
            <p className="mt-1" key={item.label}>
              <span className="font-semibold">{item.label}:</span> {item.error}
            </p>
          ))}
        </div>
      )}

      <div className={['grid grid-cols-1 gap-4', activePipelines.length > 1 ? 'sm:grid-cols-2' : ''].join(' ')}>
        {activePipelines.map((pipeline) => {
          const pipelineProgress = progress[pipeline.key]
          const style = pipelineCardStyles[pipeline.key]

          return (
            <div
              className={['rounded-2xl border p-5 shadow-sm', style.border, style.bg].join(' ')}
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
                  {pipelineProgress.error}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button
          disabled={isRunning}
          icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />}
          onClick={() => dispatch(setStep('configure'))}
          variant="secondary"
        >
          Back
        </Button>
        {isRunning ? (
          <Button
            icon={<X aria-hidden="true" className="h-4 w-4" />}
            onClick={cancelRun}
            variant="secondary"
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </section>
  )
}
