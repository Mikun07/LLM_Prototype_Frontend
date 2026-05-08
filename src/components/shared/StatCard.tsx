interface StatCardProps {
  readonly label: string
  readonly value: string | number
  readonly tone?: 'brand' | 'clean' | 'smell' | 'neutral'
}

const toneClasses = {
  brand: {
    card: 'bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-md shadow-brand-200',
    label: 'text-indigo-200',
    value: 'text-white',
    bar: 'bg-white/20',
  },
  clean: {
    card: 'bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-md shadow-teal-100',
    label: 'text-teal-100',
    value: 'text-white',
    bar: 'bg-white/20',
  },
  smell: {
    card: 'bg-gradient-to-br from-red-500 to-red-700 text-white shadow-md shadow-red-100',
    label: 'text-red-100',
    value: 'text-white',
    bar: 'bg-white/20',
  },
  neutral: {
    card: 'bg-white border border-border shadow-sm',
    label: 'text-slate-500',
    value: 'text-slate-900',
    bar: 'bg-slate-100',
  },
}

export function StatCard({ label, value, tone = 'neutral' }: StatCardProps) {
  const t = toneClasses[tone]
  return (
    <div className={['rounded-xl p-4 md:p-5', t.card].join(' ')}>
      <div className={['mb-3 h-1 w-8 rounded-full', t.bar].join(' ')} />
      <p className={['text-xs font-semibold uppercase tracking-wide', t.label].join(' ')}>{label}</p>
      <p className={['mt-1 font-mono text-3xl font-bold', t.value].join(' ')}>
        {value}
      </p>
    </div>
  )
}

