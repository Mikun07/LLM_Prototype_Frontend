import { Activity, BarChart3, FileText, Settings } from 'lucide-react'
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
  { active: 'bg-brand-600 text-white shadow-md shadow-brand-200', complete: 'bg-teal-500 text-white', pending: 'bg-white text-slate-500 border border-border', icon: 'text-white', dot: 'bg-brand-600' },
  { active: 'bg-accent-500 text-white shadow-md shadow-accent-100', complete: 'bg-teal-500 text-white', pending: 'bg-white text-slate-500 border border-border', icon: 'text-white', dot: 'bg-accent-500' },
  { active: 'bg-teal-600 text-white shadow-md shadow-teal-100', complete: 'bg-teal-500 text-white', pending: 'bg-white text-slate-500 border border-border', icon: 'text-white', dot: 'bg-teal-600' },
  { active: 'bg-indigo-700 text-white shadow-md shadow-indigo-200', complete: 'bg-teal-500 text-white', pending: 'bg-white text-slate-500 border border-border', icon: 'text-white', dot: 'bg-indigo-700' },
]

export function WizardStepper({ currentStep }: WizardStepperProps) {
  const activeIndex = steps.findIndex((step) => step.key === currentStep)

  return (
    <nav aria-label="Wizard progress" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = step.key === currentStep
        const isComplete = index < activeIndex
        const colours = stepColours[index]

        return (
          <div
            className={[
              'flex min-h-16 items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200',
              isActive ? colours.active : (isComplete ? colours.complete : colours.pending),
            ].join(' ')}
            key={step.key}
          >
            <div className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-full', isActive || isComplete ? 'bg-white/20' : 'bg-slate-100'].join(' ')}>
              <Icon aria-hidden="true" className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium opacity-75">Step {index + 1}</span>
              <span className="font-semibold leading-tight truncate">{step.label}</span>
            </div>
            {isComplete && (
              <span className="ml-auto text-xs font-bold opacity-80">✓</span>
            )}
          </div>
        )
      })}
    </nav>
  )
}

