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
    return 'bg-rose-100 text-rose-800 ring-1 ring-rose-200'
  }

  if (value === 'CLEAN' || value === 'AGREE' || value === 'HIGH' || value === 'complete') {
    return 'bg-teal-100 text-teal-800 ring-1 ring-teal-200'
  }

  if (value === 'MEDIUM' || value === 'running') {
    return 'bg-amber-100 text-amber-900 ring-1 ring-amber-200'
  }

  if (value === 'LOW' || value === 'queued') {
    return 'bg-slate-200 text-slate-700'
  }

  return 'bg-slate-100 text-slate-600'
}

function badgeLabel(value: BadgeValue): string {
  if (value === 'SMELL') {
    return 'Needs review'
  }

  if (value === 'CLEAN') {
    return 'Clean'
  }

  if (value === 'HIGH') {
    return 'High'
  }

  if (value === 'MEDIUM') {
    return 'Medium'
  }

  if (value === 'LOW') {
    return 'Low'
  }

  if (value === 'AGREE') {
    return 'Match'
  }

  if (value === 'DISAGREE') {
    return 'Different'
  }

  return String(value)
}

export function Badge({ value }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold leading-none',
        badgeClasses(value),
      ].join(' ')}
    >
      {badgeLabel(value)}
    </span>
  )
}
