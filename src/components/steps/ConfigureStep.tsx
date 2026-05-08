import { ArrowLeft, Play } from 'lucide-react'
import { pipelines } from '../../constants/pipelines'
import { useAnalysisRun } from '../../hooks/useAnalysisRun'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setConfig,
  setConfigReviewed,
  setStep,
} from '../../store/slices/wizardSlice'
import { Button } from '../shared/Button'

function groupCount(rows: { project?: string; domain?: string }[]): number {
  return new Set(rows.map((row) => `${row.project ?? 'Default'}-${row.domain ?? 'General'}`)).size
}

export function ConfigureStep() {
  const dispatch = useAppDispatch()
  const { config, configReviewed, requirements } = useAppSelector((state) => state.wizard)
  const { isRunning, startInterfaceRun } = useAnalysisRun()
  const groups = groupCount(requirements)

  return (
    <section className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        {pipelines.map((pipeline) => (
          <div className="rounded border border-border bg-white p-4" key={pipeline.key}>
            <p className="text-sm font-medium uppercase text-slate-500">{pipeline.model}</p>
            <h2 className="mt-2 font-display text-lg font-semibold capitalize text-brand-900">
              {pipeline.smellType}
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Requirements</dt>
                <dd className="font-mono font-semibold">{requirements.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Groups</dt>
                <dd className="font-mono font-semibold">{groups}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="rounded border border-border bg-white p-4">
          <span className="font-display text-lg font-semibold text-brand-900">
            LLM temperature
          </span>
          <span className="mt-1 block font-mono text-sm text-slate-600">{config.temperature}</span>
          <input
            className="mt-4 w-full accent-brand-600"
            max={0.5}
            min={0}
            onChange={(event) => dispatch(setConfig({ temperature: Number(event.target.value) }))}
            step={0.05}
            type="range"
            value={config.temperature}
          />
        </label>

        <label className="rounded border border-border bg-white p-4">
          <span className="font-display text-lg font-semibold text-brand-900">
            Max inconsistency group size
          </span>
          <span className="mt-1 block font-mono text-sm text-slate-600">{config.maxGroupSize}</span>
          <input
            className="mt-4 w-full accent-brand-600"
            max={50}
            min={5}
            onChange={(event) => dispatch(setConfig({ maxGroupSize: Number(event.target.value) }))}
            step={1}
            type="range"
            value={config.maxGroupSize}
          />
        </label>
      </div>

      <label className="flex items-start gap-3 rounded border border-border bg-white p-4">
        <input
          checked={configReviewed}
          className="mt-1 h-4 w-4 accent-brand-600"
          onChange={(event) => dispatch(setConfigReviewed(event.target.checked))}
          type="checkbox"
        />
        <span>
          <span className="block font-semibold text-slate-900">Configuration reviewed</span>
          <span className="mt-1 block text-sm text-slate-600">
            Claude and ChatGPT will run ambiguity and inconsistency analysis.
          </span>
        </span>
      </label>

      <div className="flex justify-between">
        <Button
          icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />}
          onClick={() => dispatch(setStep('upload'))}
          variant="secondary"
        >
          Back
        </Button>
        <Button
          disabled={!configReviewed || isRunning}
          icon={<Play aria-hidden="true" className="h-4 w-4" />}
          onClick={startInterfaceRun}
        >
          Run Analysis
        </Button>
      </div>
    </section>
  )
}

