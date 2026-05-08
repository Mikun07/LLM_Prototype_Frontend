import type {
  AgreementStatus,
  ConfidenceLevel,
  PipelineStatus,
  SmellLabel,
} from '../../types'

type BadgeValue = SmellLabel | ConfidenceLevel | AgreementStatus | PipelineStatus | string

interface BadgeProps {
  value: BadgeValue
}

function badgeClasses(value: BadgeValue): string {
  if (value === 'SMELL' || value === 'DISAGREE' || value === 'error') {
    return 'border-red-200 bg-red-50 text-smell'
  }

  if (value === 'CLEAN' || value === 'AGREE' || value === 'HIGH' || value === 'complete') {
    return 'border-green-200 bg-green-50 text-clean'
  }

  if (value === 'MEDIUM' || value === 'running') {
    return 'border-amber-200 bg-amber-50 text-warn'
  }

  return 'border-slate-200 bg-slate-50 text-neutral'
}

export function Badge({ value }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold uppercase',
        badgeClasses(value),
      ].join(' ')}
    >
      {value}
    </span>
  )
}

