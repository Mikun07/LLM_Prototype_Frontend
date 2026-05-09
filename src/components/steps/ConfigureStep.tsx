import { ArrowLeft, Bot, CheckCircle2, Info, Play, Zap } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setConfig,
  setConfigReviewed,
  setStep,
} from '../../store/slices/wizardSlice'
import type { ModelName, SmellType } from '../../types'
import { useAnalysisRun } from '../../hooks/useAnalysisRun'
import { Button } from '../shared/Button'

const MODEL_OPTIONS: { readonly id: ModelName; readonly label: string; readonly description: string }[] = [
  { id: 'claude', label: 'Claude', description: 'Anthropic\'s model — strong at nuanced language understanding' },
  { id: 'chatgpt', label: 'ChatGPT', description: 'OpenAI\'s model — broad knowledge, fast inference' },
]

const SMELL_OPTIONS: { readonly id: SmellType; readonly label: string; readonly description: string }[] = [
  { id: 'ambiguity', label: 'Ambiguity', description: 'Requirements that are unclear, vague, or open to multiple interpretations' },
  { id: 'inconsistency', label: 'Inconsistency', description: 'Requirements that contradict or conflict with one another' },
]

function Tip({ children }: { readonly children: React.ReactNode }) {
  return (
    <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
      <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" />
      {children}
    </p>
  )
}

const panelClass =
  'relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-sky-50/60 to-fuchsia-50/70 p-5 shadow-[0_18px_42px_-30px_rgba(79,70,229,0.55)]'

function PanelStrip() {
  return null
}

export function ConfigureStep() {
  const dispatch = useAppDispatch()
  const { config, configReviewed, requirements, detectedColumns } = useAppSelector((state) => state.wizard)
  const { isRunning, startInterfaceRun } = useAnalysisRun()

  const smellTypesAutoDetected = detectedColumns.type

  function toggleModel(model: ModelName) {
    const current = config.selectedModels
    const next = current.includes(model)
      ? current.filter((m) => m !== model)
      : [...current, model]
    if (next.length === 0) return
    dispatch(setConfig({ selectedModels: next }))
  }

  function toggleSmellType(smell: SmellType) {
    const current = config.selectedSmellTypes
    const next = current.includes(smell)
      ? current.filter((s) => s !== smell)
      : [...current, smell]
    if (next.length === 0) return
    dispatch(setConfig({ selectedSmellTypes: next }))
  }

  const reviewSummary = [
    `${config.selectedModels.map((m) => (m === 'claude' ? 'Claude' : 'ChatGPT')).join(' and ')} will analyse`,
    `${config.selectedSmellTypes.map((s) => (s === 'ambiguity' ? 'ambiguity' : 'inconsistency')).join(' and ')}`,
    `across ${requirements.length} requirement${requirements.length === 1 ? '' : 's'}.`,
  ].join(' ')

  return (
    <section className="flex flex-col gap-6">

      {/* LLM selection */}
      <div className={panelClass}>
        <PanelStrip />
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-brand-700 shadow-sm">
            <Bot aria-hidden="true" className="h-5 w-5" />
          </span>
          <h2 className="font-display text-base font-bold text-slate-900">Choose your AI model(s)</h2>
        </div>
        <p className="mt-2 text-sm text-slate-600">Select one or both models. Running both lets you compare their results side-by-side on the dashboard.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MODEL_OPTIONS.map((model) => {
            const selected = config.selectedModels.includes(model.id)
            return (
              <button
                className={[
                  'flex items-start gap-3 rounded-xl border p-4 text-left shadow-sm transition-all',
                  selected
                    ? 'border-brand-300 bg-white/95 shadow-md shadow-brand-100'
                    : 'border-white/70 bg-white/55 hover:border-brand-300 hover:bg-white/90',
                ].join(' ')}
                key={model.id}
                onClick={() => toggleModel(model.id)}
                type="button"
                aria-pressed={selected}
              >
                <span className={['mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all', selected ? 'border-brand-500 bg-gradient-brand' : 'border-slate-300 bg-white'].join(' ')}>
                  {selected && <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-white" />}
                </span>
                <span>
                  <span className="block font-bold text-slate-800">{model.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{model.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Smell type selection */}
      <div className={panelClass}>
        <PanelStrip />
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-accent-600 shadow-sm">
            <Zap aria-hidden="true" className="h-5 w-5" />
          </span>
          <h2 className="font-display text-base font-bold text-slate-900">Choose smell type(s) to detect</h2>
        </div>
        {smellTypesAutoDetected ? (
          <p className="mt-1 text-sm text-slate-500">
            Your file includes a <span className="font-semibold text-slate-700">Type</span> column the system will use it to route each requirement automatically. You can still restrict analysis here.
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-500">Select which kinds of problems the AI should look for. You can run both at once.</p>
        )}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SMELL_OPTIONS.map((smell) => {
            const selected = config.selectedSmellTypes.includes(smell.id)
            return (
              <button
                className={[
                  'flex items-start gap-3 rounded-xl border p-4 text-left shadow-sm transition-all',
                  selected
                    ? 'border-accent-300 bg-white/95 shadow-md shadow-accent-100'
                    : 'border-white/70 bg-white/55 hover:border-accent-300 hover:bg-white/90',
                ].join(' ')}
                key={smell.id}
                onClick={() => toggleSmellType(smell.id)}
                type="button"
                aria-pressed={selected}
              >
                <span className={['mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all', selected ? 'border-accent-500 bg-gradient-to-r from-amber-400 to-fuchsia-500' : 'border-slate-300 bg-white'].join(' ')}>
                  {selected && <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-white" />}
                </span>
                <span>
                  <span className="block font-bold text-slate-800">{smell.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{smell.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Advanced settings */}
      <div className={panelClass}>
        <PanelStrip />
        <h2 className="font-display text-base font-bold text-slate-900">Advanced settings</h2>
        <p className="mt-1 text-sm text-slate-600">These control how the AI behaves. The defaults work well for most projects; only change them if you have a specific reason.</p>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-white/70 bg-white/70 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700" htmlFor="temperature">
                AI creativity level
              </label>
              <span aria-hidden="true" className="font-mono text-sm font-bold text-brand-600">{config.temperature}</span>
            </div>
            <input
              aria-valuetext={String(config.temperature)}
              className="mt-3 w-full accent-brand-600"
              id="temperature"
              max={0.5}
              min={0}
              onChange={(event) => dispatch(setConfig({ temperature: Number(event.target.value) }))}
              step={0.05}
              type="range"
              value={config.temperature}
            />
            <div aria-hidden="true" className="mt-1 flex justify-between text-xs text-slate-400">
              <span>Precise (0.0)</span><span>Creative (0.5)</span>
            </div>
            <Tip>
              Controls how consistent the AI is. A lower value means the AI gives the same answer every time (more reliable). A higher value makes it more creative but less predictable. Keep it low for technical analysis.
            </Tip>
          </div>

          <div className="rounded-xl border border-white/70 bg-white/70 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700" htmlFor="maxGroupSize">
                Inconsistency batch size
              </label>
              <span aria-hidden="true" className="font-mono text-sm font-bold text-accent-500">{config.maxGroupSize}</span>
            </div>
            <input
              aria-valuetext={String(config.maxGroupSize)}
              className="mt-3 w-full accent-brand-600"
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
            <Tip>
              When checking for inconsistencies, requirements are compared in groups. A larger batch lets the AI spot conflicts across more requirements at once, but takes longer to run.
            </Tip>
          </div>
        </div>
      </div>

      {/* Review checkbox */}
      <div
        className={[
          'relative flex cursor-pointer items-start gap-4 overflow-hidden rounded-2xl border p-5 shadow-[0_18px_42px_-30px_rgba(20,184,166,0.55)] transition-all',
          configReviewed
            ? 'border-teal-300 bg-gradient-to-br from-white via-teal-50/80 to-emerald-50'
            : 'border-white/80 bg-gradient-to-br from-white via-sky-50/60 to-fuchsia-50/70',
        ].join(' ')}
      >
        <PanelStrip />
        <input
          checked={configReviewed}
          className="mt-1 h-4 w-4 accent-brand-600"
          id="configReviewed"
          onChange={(event) => dispatch(setConfigReviewed(event.target.checked))}
          type="checkbox"
        />
        <div>
          <label className="block cursor-pointer font-bold text-slate-900" htmlFor="configReviewed">
            I&apos;m ready to run the analysis
          </label>
          <p className="mt-1 text-sm text-slate-600">{reviewSummary}</p>
        </div>
      </div>

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
