import { useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { Button } from '../shared/Button'
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

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-2 border-b border-border pb-3">
        {[
          ['claude', 'Claude Report'],
          ['chatgpt', 'ChatGPT Report'],
          ['comparison', 'Comparison'],
        ].map(([key, label]) => (
          <Button
            key={key}
            onClick={() => setTab(key as DashboardTab)}
            variant={tab === key ? 'primary' : 'secondary'}
          >
            {label}
          </Button>
        ))}
      </div>

      {tab === 'claude' ? <ModelReport report={claudeReport} /> : null}
      {tab === 'chatgpt' ? <ModelReport report={chatgptReport} /> : null}
      {tab === 'comparison' ? <ComparisonReport report={comparison} /> : null}
    </section>
  )
}

