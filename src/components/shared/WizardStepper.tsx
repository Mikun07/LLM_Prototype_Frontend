import { Activity, BarChart3, CheckCircle2, FileText, Settings } from 'lucide-react'
import type { WizardStep } from '../../types'

interface WizardStepperProps {
  readonly currentStep: WizardStep
}

const steps = [
  { key: 'upload', label: 'Upload', icon: FileText },
  { key: 'configure', label: 'Configure', icon: Settings },
  { key: 'run', label: 'Run', icon: Activity },
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
] satisfies { key: WizardStep; label: string; icon: typeof FileText }[]

const stepColours = [
  {
    active: 'border-white bg-white/95 text-brand-800 shadow-sm',
    complete: 'border-white bg-white/85 text-teal-800',
    icon: 'bg-brand-100 text-brand-700',
    pending: 'border-white/40 bg-white/45 text-slate-600 hover:bg-white/80',
  },
  {
    active: 'border-white bg-white/95 text-accent-700 shadow-sm',
    complete: 'border-white bg-white/85 text-teal-800',
    icon: 'bg-amber-100 text-accent-700',
    pending: 'border-white/40 bg-white/45 text-slate-600 hover:bg-white/80',
  },
  {
    active: 'border-white bg-white/95 text-teal-800 shadow-sm',
    complete: 'border-white bg-white/85 text-teal-800',
    icon: 'bg-teal-100 text-teal-700',
    pending: 'border-white/40 bg-white/45 text-slate-600 hover:bg-white/80',
  },
  {
    active: 'border-white bg-white/95 text-indigo-800 shadow-sm',
    complete: 'border-white bg-white/85 text-teal-800',
    icon: 'bg-indigo-100 text-indigo-700',
    pending: 'border-white/40 bg-white/45 text-slate-600 hover:bg-white/80',
  },
]

export function WizardStepper({ currentStep }: WizardStepperProps) {
  const activeIndex = steps.findIndex((step) => step.key === currentStep)

  return (
    <nav
      aria-label="Wizard progress"
      className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-sky-50/60 to-fuchsia-50/70 p-3 shadow-[0_18px_42px_-30px_rgba(79,70,229,0.55)]"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = step.key === currentStep
          const isComplete = index < activeIndex
          const colours = stepColours[index]
          const stateColour = isActive
            ? colours.active
            : isComplete
              ? colours.complete
              : colours.pending

          return (
            <div
              className={[
                'flex min-h-16 items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200',
                stateColour,
              ].join(' ')}
              key={step.key}
            >
              <div className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm', colours.icon].join(' ')}>
                <Icon aria-hidden="true" className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-xs font-medium opacity-75">Step {index + 1}</span>
                <span className="truncate font-semibold leading-tight">{step.label}</span>
              </div>
              {isComplete ? (
                <CheckCircle2 aria-hidden="true" className="ml-auto h-4 w-4 text-teal-500" />
              ) : null}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
