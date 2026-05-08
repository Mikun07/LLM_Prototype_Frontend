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

const pipelineCardStyles = [
  'from-brand-600 to-brand-800 shadow-brand-200',
  'from-accent-500 to-accent-600 shadow-accent-100',
  'from-teal-500 to-teal-700 shadow-teal-100',
  'from-indigo-600 to-indigo-800 shadow-indigo-200',
]

export function ConfigureStep() {
  const dispatch = useAppDispatch()
  const { config, configReviewed, requirements } = useAppSelector((state) => state.wizard)
  const { isRunning, startInterfaceRun } = useAnalysisRun()
  const groups = groupCount(requirements)

  return (
    <section className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pipelines.map((pipeline, i) => (
          <div
            className={['rounded-2xl bg-gradient-to-br p-5 text-white shadow-md', pipelineCardStyles[i]].join(' ')}
            key={pipeline.key}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">{pipeline.model}</p>
            <h2 className="mt-1 font-display text-lg font-bold capitalize">
              {pipeline.smellType}
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-white/70">Requirements</dt>
                <dd className="font-mono font-bold">{requirements.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-white/70">Groups</dt>
                <dd className="font-mono font-bold">{groups}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <label className="font-display text-base font-bold text-slate-800" htmlFor="temperature">
            LLM temperature
          </label>
          <span aria-hidden="true" className="mt-1 block font-mono text-sm font-bold text-brand-600">{config.temperature}</span>
          <input
            aria-valuetext={String(config.temperature)}
            className="mt-4 w-full accent-brand-600"
            id="temperature"
            max={0.5}
            min={0}
            onChange={(event) => dispatch(setConfig({ temperature: Number(event.target.value) }))}
            step={0.05}
            type="range"
            value={config.temperature}
          />
          <div aria-hidden="true" className="mt-1 flex justify-between text-xs text-slate-400">
            <span>0.0 (precise)</span><span>0.5 (creative)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <label className="font-display text-base font-bold text-slate-800" htmlFor="maxGroupSize">
            Max inconsistency group size
          </label>
          <span aria-hidden="true" className="mt-1 block font-mono text-sm font-bold text-accent-500">{config.maxGroupSize}</span>
          <input
            aria-valuetext={String(config.maxGroupSize)}
            className="mt-4 w-full accent-brand-600"
            id="maxGroupSize"
            max={50}
            min={5}
            onChange={(event) => dispatch(setConfig({ maxGroupSize: Number(event.target.value) }))}
            step={1}
            type="range"
            value={config.maxGroupSize}
          />
          <div aria-hidden="true" className="mt-1 flex justify-between text-xs text-slate-400">
            <span>5 (small)</span><span>50 (large)</span>
          </div>
        </div>
      </div>

      <label
        className={['flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 transition-all', configReviewed ? 'border-teal-400 bg-teal-50' : 'border-border bg-white'].join(' ')}
        htmlFor="configReviewed"
      >
        <input
          checked={configReviewed}
          className="mt-1 h-4 w-4 accent-brand-600"
          id="configReviewed"
          onChange={(event) => dispatch(setConfigReviewed(event.target.checked))}
          type="checkbox"
        />
        <span>
          <span className="block font-bold text-slate-900">I have reviewed the configuration</span>
          <span className="mt-1 block text-sm text-slate-600">
            Claude and ChatGPT will each run ambiguity and inconsistency analysis on your requirements.
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

