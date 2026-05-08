interface ProgressBarProps {
  readonly value: number
  readonly label: string
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100)

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-mono font-bold text-brand-600">{safeValue}%</span>
      </div>
      <progress
        aria-label={label}
        className="progress-gradient h-2.5 w-full overflow-hidden rounded-full"
        max={100}
        value={safeValue}
      />
    </div>
  )
}
