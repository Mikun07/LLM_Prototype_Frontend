import { ArrowLeft } from 'lucide-react'
import { pipelines } from '../../constants/pipelines'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setStep } from '../../store/slices/wizardSlice'
import { Badge } from '../shared/Badge'
import { Button } from '../shared/Button'
import { ProgressBar } from '../shared/ProgressBar'

export function RunStep() {
  const dispatch = useAppDispatch()
  const progress = useAppSelector((state) => state.analysis.progress)
  const values = pipelines.map((pipeline) => progress[pipeline.key].percentage)
  const overall = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded border border-border bg-white p-5">
        <ProgressBar label="Overall progress" value={overall} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {pipelines.map((pipeline) => {
          const pipelineProgress = progress[pipeline.key]

          return (
            <div className="rounded border border-border bg-white p-5" key={pipeline.key}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="font-display text-lg font-semibold text-brand-900">
                  {pipeline.label}
                </h2>
                <Badge value={pipelineProgress.status} />
              </div>
              <ProgressBar label={pipeline.label} value={pipelineProgress.percentage} />
              <p className="mt-3 font-mono text-sm text-slate-600">
                {pipelineProgress.processed}/{pipelineProgress.total}
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

