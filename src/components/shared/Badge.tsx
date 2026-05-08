import type {
  AgreementStatus,
  ConfidenceLevel,
  PipelineStatus,
  SmellLabel,
} from '../../types'

type BadgeValue = SmellLabel | ConfidenceLevel | AgreementStatus | PipelineStatus | string

interface BadgeProps {
  readonly value: BadgeValue
}

function badgeClasses(value: BadgeValue): string {
  if (value === 'SMELL' || value === 'DISAGREE' || value === 'error') {
    return 'bg-red-500 text-white shadow-sm shadow-red-200'
  }

  if (value === 'CLEAN' || value === 'AGREE' || value === 'HIGH' || value === 'complete') {
    return 'bg-teal-500 text-white shadow-sm shadow-teal-100'
  }

  if (value === 'MEDIUM' || value === 'running') {
    return 'bg-amber-400 text-amber-900 shadow-sm shadow-amber-100'
  }

  if (value === 'LOW' || value === 'queued') {
    return 'bg-slate-200 text-slate-700'
  }

  return 'bg-slate-100 text-slate-600'
}

export function Badge({ value }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide',
        badgeClasses(value),
      ].join(' ')}
    >
      {value}
    </span>
  )
}

