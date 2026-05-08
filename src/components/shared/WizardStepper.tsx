import { Activity, BarChart3, FileText, Settings } from 'lucide-react'
import type { WizardStep } from '../../types'

interface WizardStepperProps {
  currentStep: WizardStep
}

const steps = [
  { key: 'upload', label: 'Upload', icon: FileText },
  { key: 'configure', label: 'Configure', icon: Settings },
  { key: 'run', label: 'Run', icon: Activity },
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
] satisfies { key: WizardStep; label: string; icon: typeof FileText }[]

export function WizardStepper({ currentStep }: WizardStepperProps) {
  const activeIndex = steps.findIndex((step) => step.key === currentStep)

  return (
    <nav aria-label="Wizard progress" className="grid grid-cols-4 gap-3">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = step.key === currentStep
        const isComplete = index < activeIndex

        return (
          <div
            className={[
              'flex min-h-16 items-center gap-3 rounded border px-4 py-3',
              isActive
                ? 'border-brand-500 bg-brand-50 text-brand-900'
                : 'border-border bg-white text-slate-600',
              isComplete ? 'border-green-200 bg-green-50 text-clean' : '',
            ].join(' ')}
            key={step.key}
          >
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span className="font-semibold">{step.label}</span>
          </div>
        )
      })}
    </nav>
  )
}

