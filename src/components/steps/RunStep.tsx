import { ArrowLeft, CheckCircle2, Clock, Cpu, Loader2, X } from 'lucide-react'
import { pipelines } from '../../constants/pipelines'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setStep } from '../../store/slices/wizardSlice'
import { useAnalysisRun } from '../../hooks/useAnalysisRun'
import { Button } from '../shared/Button'

const pipelineCardStyles: Record<string, { border: string; bg: string; accent: string }> = {
  claudeAmbiguity:      { border: 'border-brand-200',  bg: 'bg-brand-50',  accent: 'text-brand-600' },
  claudeInconsistency:  { border: 'border-accent-200', bg: 'bg-accent-50', accent: 'text-accent-600' },
  chatgptAmbiguity:     { border: 'border-teal-200',   bg: 'bg-teal-50',   accent: 'text-teal-600' },
  chatgptInconsistency: { border: 'border-indigo-200', bg: 'bg-indigo-50', accent: 'text-indigo-600' },
}


function StatusIcon({ status }: { readonly status: string }) {
  if (status === 'complete') {
    return <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-teal-500" />
  }
  if (status === 'running') {
    return <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin text-brand-500" />
  }
  return <Clock aria-hidden="true" className="h-5 w-5 text-slate-300" />
}

export function RunStep() {
  const dispatch = useAppDispatch()
  const { cancelRun, isRunning } = useAnalysisRun()
  const progress = useAppSelector((state) => state.analysis.progress)
  const { selectedModels, selectedSmellTypes } = useAppSelector((state) => state.wizard.config)
  const requirements = useAppSelector((state) => state.wizard.requirements)

  const activePipelines = pipelines.filter(
    (p) => selectedModels.includes(p.model) && selectedSmellTypes.includes(p.smellType),
  )

  const overall = activePipelines.length === 0 ? 0 : Math.round(
    activePipelines.reduce((sum, p) => sum + progress[p.key].percentage, 0) / activePipelines.length,
  )

  const allDone = activePipelines.length > 0 && activePipelines.every((p) => progress[p.key].status === 'complete')
  const anyRunning = activePipelines.some((p) => progress[p.key].status === 'running')

  let statusLabel: string
  if (allDone) {
    statusLabel = 'Analysis complete'
  } else if (anyRunning) {
    statusLabel = 'Analysis running…'
  } else {
    statusLabel = 'Preparing pipelines…'
  }

  return (
    <section className="flex flex-col gap-6">

      {/* Header summary */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={['flex h-10 w-10 shrink-0 items-center justify-center rounded-full', allDone ? 'bg-teal-100' : 'bg-brand-100'].join(' ')}>
            {allDone
              ? <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-teal-600" />
              : <Cpu aria-hidden="true" className={['h-5 w-5 text-brand-600', anyRunning ? 'animate-pulse' : ''].join(' ')} />
            }
          </div>
          <div>
            <p className="font-display text-base font-bold text-slate-800">
              {statusLabel}
            </p>
            <p className="text-sm text-slate-500">
              {activePipelines.length} pipeline{activePipelines.length === 1 ? '' : 's'} · {requirements.length} requirement{requirements.length === 1 ? '' : 's'}
            </p>
          </div>
          <p className="ml-auto font-mono text-3xl font-bold text-brand-600">{overall}%</p>
        </div>

        {/* Overall progress track */}
        <div className="mt-4">
          <progress
            className="progress-gradient h-2 w-full overflow-hidden rounded-full"
            max={100}
            value={overall}
            aria-label="Overall progress"
          />
        </div>
      </div>

      {/* Pipeline cards */}
      <div className={['grid grid-cols-1 gap-4', activePipelines.length > 1 ? 'sm:grid-cols-2' : ''].join(' ')}>
        {activePipelines.map((pipeline) => {
          const p = progress[pipeline.key]
          const style = pipelineCardStyles[pipeline.key]

          return (
            <div
              key={pipeline.key}
              className={['rounded-2xl border p-5 shadow-sm', style.border, style.bg].join(' ')}
            >
              <div className="mb-4 flex items-center gap-3">
                <StatusIcon status={p.status} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold text-slate-800">{pipeline.label}</p>
                  <p className="text-xs text-slate-500 capitalize">{p.status}</p>
                </div>
                <span className={['font-mono text-lg font-bold', style.accent].join(' ')}>{p.percentage}%</span>
              </div>

              <progress
                className="progress-gradient h-1.5 w-full overflow-hidden rounded-full"
                max={100}
                value={p.percentage}
                aria-label={`${pipeline.label} progress`}
              />

              <p className="mt-3 font-mono text-xs text-slate-500">
                {p.processed} / {p.total} requirements processed
              </p>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button
          icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />}
          onClick={() => dispatch(setStep('configure'))}
          variant="secondary"
          disabled={isRunning}
        >
          Back
        </Button>
        {isRunning && (
          <Button
            icon={<X aria-hidden="true" className="h-4 w-4" />}
            onClick={cancelRun}
            variant="secondary"
          >
            Cancel
          </Button>
        )}
      </div>
    </section>
  )
}
