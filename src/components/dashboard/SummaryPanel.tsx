import type { ReportStats } from '../../types'
import { formatPercentage } from '../../utils/formatters'
import { StatCard } from '../shared/StatCard'

interface SummaryPanelProps {
  stats: ReportStats
}

export function SummaryPanel({ stats }: SummaryPanelProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total" value={stats.total} />
      <StatCard label="Smells" tone="smell" value={stats.smells} />
      <StatCard label="Clean" tone="clean" value={stats.clean} />
      <StatCard label="Smell rate" tone="brand" value={formatPercentage(stats.smellRate)} />
    </div>
  )
}

