import type { ComparisonReport as ComparisonReportType, ComparisonRow } from '../../types'
import { formatPercentage } from '../../utils/formatters'
import { downloadComparisonReportPdf } from '../../utils/reportPdf'
import { BarChart } from '../charts/BarChart'
import { DonutChart } from '../charts/DonutChart'
import { Badge } from '../shared/Badge'
import { StatCard } from '../shared/StatCard'
import { type DataTableColumn } from '../shared/DataTable'
import { ReportHeader } from './ReportHeader'
import { ResultsSection } from './ResultsSection'

interface ComparisonReportProps {
  readonly report: ComparisonReportType
}

const comparisonColumns: DataTableColumn<ComparisonRow>[] = [
  {
    key: 'id',
    header: 'ID',
    render: (row) => <span className="font-mono font-semibold text-slate-700">{row.id}</span>,
    sortableValue: (row) => row.id,
  },
  { key: 'text', header: 'Requirement', render: (row) => row.text, sortableValue: (row) => row.text },
  { key: 'agreementStatus', header: 'Agreement', render: (row) => <Badge value={row.agreementStatus} />, sortableValue: (row) => row.agreementStatus },
  { key: 'claudeLabel', header: 'Claude', render: (row) => <Badge value={row.claudeLabel} />, sortableValue: (row) => row.claudeLabel },
  { key: 'chatgptLabel', header: 'ChatGPT', render: (row) => <Badge value={row.chatgptLabel} />, sortableValue: (row) => row.chatgptLabel },
]

export function ComparisonReport({ report }: ComparisonReportProps) {
  const donutData = [
    { name: 'Match', value: report.stats.fullAgreement, color: '#16a34a' },
    { name: 'Claude only', value: report.stats.claudeOnly, color: '#3b5bdb' },
    { name: 'ChatGPT only', value: report.stats.chatgptOnly, color: '#d97706' },
  ]
  const byDomain = report.stats.byDomain.map((row) => ({
    name: row.name,
    clean: row.clean,
    smells: row.smells,
  }))
  const modelRates = Array.from(new Set(report.rows.map((row) => row.domain))).map((domain) => {
    const rows = report.rows.filter((row) => row.domain === domain)
    const claude = rows.filter((row) => row.claudeLabel === 'SMELL').length
    const chatgpt = rows.filter((row) => row.chatgptLabel === 'SMELL').length

    return { name: domain, claude, chatgpt }
  })
  return (
    <section className="flex flex-col gap-6">
      <ReportHeader
        onDownloadPdf={() => downloadComparisonReportPdf(report)}
        subtitle="Comparison report"
        title="Comparison Report"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Match" tone="clean" value={report.stats.fullAgreement} />
        <StatCard label="Claude only" tone="brand" value={report.stats.claudeOnly} />
        <StatCard label="ChatGPT only" value={report.stats.chatgptOnly} />
        <StatCard label="Both clean" tone="clean" value={report.stats.bothClean} />
        <StatCard label="Agreement rate" tone="brand" value={formatPercentage(report.stats.agreementRate)} />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DonutChart ariaLabel="Model agreement category breakdown" data={donutData} title="Model agreement" />
        <BarChart ariaLabel="Claude and ChatGPT review counts by domain" data={modelRates} mode="grouped" title="Model results by domain" />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <BarChart
          ariaLabel="Agreement and difference by domain"
          cleanLabel="Match"
          data={byDomain}
          mode="stacked"
          smellsLabel="Different"
          title="Agreement by domain"
        />
      </div>
      <ResultsSection
        columns={comparisonColumns}
        filename="reqsmell-comparison.csv"
        filterKeys={['agreementStatus', 'domain', 'type']}
        getRowKey={(row) => row.id}
        rows={report.rows}
        searchFields={['text', 'domain']}
        title="Side-by-side results"
      />
    </section>
  )
}
