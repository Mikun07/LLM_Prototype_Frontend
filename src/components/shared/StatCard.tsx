interface StatCardProps {
  readonly label: string
  readonly value: string | number
  readonly tone?: 'brand' | 'clean' | 'smell' | 'neutral'
}

const toneClasses = {
  brand: {
    card: 'from-white via-brand-50/70 to-fuchsia-50/70',
    label: 'text-brand-700',
    value: 'text-brand-800',
    strip: 'from-brand-400 to-fuchsia-500',
  },
  clean: {
    card: 'from-white via-teal-50/70 to-emerald-50/70',
    label: 'text-teal-700',
    value: 'text-teal-800',
    strip: 'from-teal-400 to-emerald-500',
  },
  smell: {
    card: 'from-white via-rose-50/70 to-fuchsia-50/70',
    label: 'text-rose-700',
    value: 'text-rose-800',
    strip: 'from-rose-400 to-fuchsia-500',
  },
  neutral: {
    card: 'from-white via-sky-50/60 to-slate-50',
    label: 'text-slate-500',
    value: 'text-slate-900',
    strip: 'from-sky-400 to-brand-500',
  },
}

export function StatCard({ label, value, tone = 'neutral' }: StatCardProps) {
  const t = toneClasses[tone]
  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br p-4 shadow-[0_18px_42px_-30px_rgba(79,70,229,0.55)]',
        t.card,
      ].join(' ')}
    >
      <p className={['text-sm font-semibold', t.label].join(' ')}>{label}</p>
      <p className={['mt-2 font-mono text-3xl font-bold', t.value].join(' ')}>
        {value}
      </p>
    </div>
  )
}
