import { useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { ComparisonReport } from '../dashboard/ComparisonReport'
import { ModelReport } from '../dashboard/ModelReport'

type DashboardTab = 'claude' | 'chatgpt' | 'comparison'

export function DashboardStep() {
  const [tab, setTab] = useState<DashboardTab>('claude')
  const { chatgptReport, claudeReport, comparison } = useAppSelector((state) => state.analysis)

  if (claudeReport === null || chatgptReport === null || comparison === null) {
    return (
      <section className="rounded border border-border bg-white p-6 text-sm text-slate-600">
        No completed run is available.
      </section>
    )
  }

  const tabConfig = [
    { key: 'claude', label: 'Claude Report', activeClass: 'bg-gradient-brand text-white shadow-md shadow-brand-200' },
    { key: 'chatgpt', label: 'ChatGPT Report', activeClass: 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-100' },
    { key: 'comparison', label: 'Comparison', activeClass: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md shadow-accent-100' },
  ]

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-white p-2 shadow-sm">
        {tabConfig.map(({ key, label, activeClass }) => (
          <button
            className={[
              'flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-150 min-w-[120px]',
              tab === key ? activeClass : 'text-slate-600 hover:bg-slate-100',
            ].join(' ')}
            key={key}
            onClick={() => setTab(key as DashboardTab)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'claude' ? <ModelReport report={claudeReport} /> : null}
      {tab === 'chatgpt' ? <ModelReport report={chatgptReport} /> : null}
      {tab === 'comparison' ? <ComparisonReport report={comparison} /> : null}
    </section>
  )
}

