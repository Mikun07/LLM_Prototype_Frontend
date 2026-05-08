import { ArrowLeft } from 'lucide-react'
import { pipelines } from '../../constants/pipelines'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setStep } from '../../store/slices/wizardSlice'
import { Badge } from '../shared/Badge'
import { Button } from '../shared/Button'
import { ProgressBar } from '../shared/ProgressBar'

const pipelineCardStyles = [
  'border-brand-200 bg-gradient-to-br from-brand-50 to-white',
  'border-accent-100 bg-gradient-to-br from-accent-50 to-white',
  'border-teal-100 bg-gradient-to-br from-teal-50 to-white',
  'border-indigo-100 bg-gradient-to-br from-indigo-50 to-white',
]

export function RunStep() {
  const dispatch = useAppDispatch()
  const progress = useAppSelector((state) => state.analysis.progress)
  const values = pipelines.map((pipeline) => progress[pipeline.key].percentage)
  const overall = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Overall progress</p>
        <ProgressBar label="Overall progress" value={overall} />
        <p className="mt-2 text-right font-mono text-2xl font-bold text-brand-600">{overall}%</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {pipelines.map((pipeline, i) => {
          const pipelineProgress = progress[pipeline.key]

          return (
            <div className={['rounded-2xl border p-5 shadow-sm', pipelineCardStyles[i]].join(' ')} key={pipeline.key}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="font-display text-base font-bold text-slate-800">
                  {pipeline.label}
                </h2>
                <Badge value={pipelineProgress.status} />
              </div>
              <ProgressBar label={pipeline.label} value={pipelineProgress.percentage} />
              <p className="mt-3 font-mono text-sm font-semibold text-slate-500">
                {pipelineProgress.processed} / {pipelineProgress.total} requirements
              </p>
            </div>
          )
        })}
      </div>

      <div className="flex justify-start">
        <Button
          icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />}
          onClick={() => dispatch(setStep('configure'))}
          variant="secondary"
        >
          Back
        </Button>
      </div>
    </section>
  )
}

