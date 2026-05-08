interface ProgressBarProps {
  value: number
  label: string
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100)

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-mono text-slate-600">{safeValue}%</span>
      </div>
      <progress
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded accent-brand-600"
        max={100}
        value={safeValue}
      />
    </div>
  )
}
