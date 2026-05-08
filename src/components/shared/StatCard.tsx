interface StatCardProps {
  label: string
  value: string | number
  tone?: 'brand' | 'clean' | 'smell' | 'neutral'
}

const toneClasses = {
  brand: 'text-brand-700',
  clean: 'text-clean',
  smell: 'text-smell',
  neutral: 'text-slate-900',
}

export function StatCard({ label, value, tone = 'neutral' }: StatCardProps) {
  return (
    <div className="rounded border border-border bg-white p-4">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className={['mt-2 font-mono text-3xl font-semibold', toneClasses[tone]].join(' ')}>
        {value}
      </p>
    </div>
  )
}

