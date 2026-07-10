import { useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { ComparisonReport } from '../dashboard/ComparisonReport'
import { ModelReport } from '../dashboard/ModelReport'
import { MetadataGuide } from '../shared/MetadataGuide'

type DashboardTab = 'claude' | 'chatgpt' | 'comparison'

export function DashboardStep() {
  const [tab, setTab] = useState<DashboardTab>('claude')
  const { chatgptReport, claudeReport, comparison } = useAppSelector((state) => state.analysis)

  const tabConfig = [
    claudeReport === null
      ? null
      : { key: 'claude', label: 'Claude', activeClass: 'border-white bg-white/95 text-brand-800 shadow-sm' },
    chatgptReport === null
      ? null
      : { key: 'chatgpt', label: 'ChatGPT', activeClass: 'border-white bg-white/95 text-teal-800 shadow-sm' },
    comparison === null
      ? null
      : { key: 'comparison', label: 'Comparison', activeClass: 'border-white bg-white/95 text-slate-900 shadow-sm' },
  ].filter((item): item is { key: DashboardTab; label: string; activeClass: string } => item !== null)

  if (tabConfig.length === 0) {
    return (
      <section className="rounded border border-border bg-white p-6 text-sm text-slate-600">
        No completed run is available.
      </section>
    )
  }

  const activeTab = tabConfig.some((item) => item.key === tab) ? tab : tabConfig[0].key

  function handleTabKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    key: DashboardTab,
  ): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return
    }

    event.preventDefault()
    const currentIndex = tabConfig.findIndex((item) => item.key === key)
    const lastIndex = tabConfig.length - 1
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? lastIndex
          : event.key === 'ArrowLeft'
            ? (currentIndex - 1 + tabConfig.length) % tabConfig.length
            : (currentIndex + 1) % tabConfig.length
    const nextTab = tabConfig[nextIndex]

    if (nextTab !== undefined) {
      setTab(nextTab.key)
      globalThis.requestAnimationFrame(() => {
        globalThis.document.getElementById(`report-tab-${nextTab.key}`)?.focus()
      })
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-sky-50/60 to-fuchsia-50/70 p-3 shadow-[0_18px_42px_-30px_rgba(79,70,229,0.55)]">
        <div aria-label="Report views" className="flex flex-wrap gap-2" role="tablist">
          {tabConfig.map(({ key, label, activeClass }) => (
            <button
              aria-controls={`report-panel-${key}`}
              aria-selected={activeTab === key}
              className={[
                'min-w-[120px] flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all duration-150',
                activeTab === key
                  ? activeClass
                  : 'border-white/40 bg-white/45 text-slate-600 hover:bg-white/80 hover:text-slate-900',
              ].join(' ')}
              id={`report-tab-${key}`}
              key={key}
              onKeyDown={(event) => handleTabKeyDown(event, key)}
              onClick={() => setTab(key as DashboardTab)}
              role="tab"
              tabIndex={activeTab === key ? 0 : -1}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <MetadataGuide location="dashboard" />

      <div
        aria-labelledby={`report-tab-${activeTab}`}
        id={`report-panel-${activeTab}`}
        role="tabpanel"
      >
        {activeTab === 'claude' && claudeReport !== null ? <ModelReport report={claudeReport} /> : null}
        {activeTab === 'chatgpt' && chatgptReport !== null ? <ModelReport report={chatgptReport} /> : null}
        {activeTab === 'comparison' && comparison !== null ? <ComparisonReport report={comparison} /> : null}
      </div>
    </section>
  )
}
