import type { ReportStats } from '../../types'
import { formatPercentage } from '../../utils/formatters'
import { StatCard } from '../shared/StatCard'

interface SummaryPanelProps {
  readonly stats: ReportStats
}

export function SummaryPanel({ stats }: SummaryPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total" value={stats.total} />
      <StatCard label="Needs review" tone="smell" value={stats.smells} />
      <StatCard label="Clean" tone="clean" value={stats.clean} />
      <StatCard label="Review rate" tone="brand" value={formatPercentage(stats.smellRate)} />
    </div>
  )
}
