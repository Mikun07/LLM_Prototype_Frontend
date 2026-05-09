import { useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { ComparisonReport } from '../dashboard/ComparisonReport'
import { ModelReport } from '../dashboard/ModelReport'

type DashboardTab = 'claude' | 'chatgpt' | 'comparison'

export function DashboardStep() {
  const [tab, setTab] = useState<DashboardTab>('claude')
  const { chatgptReport, claudeReport, comparison } = useAppSelector((state) => state.analysis)

  const tabConfig = [
    claudeReport === null
      ? null
      : { key: 'claude', label: 'Claude Report', activeClass: 'bg-gradient-brand text-white shadow-md shadow-brand-200' },
    chatgptReport === null
      ? null
      : { key: 'chatgpt', label: 'ChatGPT Report', activeClass: 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-100' },
    comparison === null
      ? null
      : { key: 'comparison', label: 'Comparison', activeClass: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md shadow-accent-100' },
  ].filter((item): item is { key: DashboardTab; label: string; activeClass: string } => item !== null)

  if (tabConfig.length === 0) {
    return (
      <section className="rounded border border-border bg-white p-6 text-sm text-slate-600">
        No completed run is available.
      </section>
    )
  }

  const activeTab = tabConfig.some((item) => item.key === tab) ? tab : tabConfig[0].key

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-white p-2 shadow-sm">
        {tabConfig.map(({ key, label, activeClass }) => (
          <button
            className={[
              'flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-150 min-w-[120px]',
              activeTab === key ? activeClass : 'text-slate-600 hover:bg-slate-100',
            ].join(' ')}
            key={key}
            onClick={() => setTab(key as DashboardTab)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'claude' && claudeReport !== null ? <ModelReport report={claudeReport} /> : null}
      {activeTab === 'chatgpt' && chatgptReport !== null ? <ModelReport report={chatgptReport} /> : null}
      {activeTab === 'comparison' && comparison !== null ? <ComparisonReport report={comparison} /> : null}
    </section>
  )
}
