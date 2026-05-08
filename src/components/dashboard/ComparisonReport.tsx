import type { ComparisonReport as ComparisonReportType, ComparisonRow } from '../../types'
import { formatPercentage } from '../../utils/formatters'
import { BarChart } from '../charts/BarChart'
import { DonutChart } from '../charts/DonutChart'
import { Badge } from '../shared/Badge'
import { StatCard } from '../shared/StatCard'
import { type DataTableColumn } from '../shared/DataTable'
import { BreakdownTable } from './BreakdownTable'
import { ReportHeader } from './ReportHeader'
import { ResultsSection } from './ResultsSection'

interface ComparisonReportProps {
  readonly report: ComparisonReportType
}

const comparisonColumns: DataTableColumn<ComparisonRow>[] = [
  { key: 'id', header: 'ID', render: (row) => <span className="font-mono">{row.id}</span>, sortableValue: (row) => row.id },
  { key: 'text', header: 'Text', render: (row) => row.text, sortableValue: (row) => row.text },
  { key: 'domain', header: 'Domain', render: (row) => row.domain, sortableValue: (row) => row.domain },
  { key: 'type', header: 'Type', render: (row) => row.type, sortableValue: (row) => String(row.type) },
  { key: 'claudeLabel', header: 'Claude', render: (row) => <Badge value={row.claudeLabel} />, sortableValue: (row) => row.claudeLabel },
  { key: 'chatgptLabel', header: 'ChatGPT', render: (row) => <Badge value={row.chatgptLabel} />, sortableValue: (row) => row.chatgptLabel },
  { key: 'agreementStatus', header: 'Agreement', render: (row) => <Badge value={row.agreementStatus} />, sortableValue: (row) => row.agreementStatus },
]

export function ComparisonReport({ report }: ComparisonReportProps) {
  const donutData = [
    { name: 'Agreement', value: report.stats.fullAgreement, color: '#16a34a' },
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
        subtitle={`${report.fileName} - ${formatPercentage(report.stats.agreementRate)} agreement rate`}
        title="Comparison Report"
      />
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Full agreement" tone="clean" value={report.stats.fullAgreement} />
        <StatCard label="Claude only" tone="brand" value={report.stats.claudeOnly} />
        <StatCard label="ChatGPT only" value={report.stats.chatgptOnly} />
        <StatCard label="Both clean" tone="clean" value={report.stats.bothClean} />
        <StatCard label="Agreement rate" tone="brand" value={formatPercentage(report.stats.agreementRate)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <BreakdownTable rows={report.stats.bySmellType} title="Agreement by smell type" />
        <BreakdownTable rows={report.stats.byDomain} title="Agreement by domain" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DonutChart ariaLabel="Agreement category breakdown" data={donutData} title="Agreement categories" />
        <BarChart ariaLabel="Agreement and disagreement by domain" data={byDomain} mode="stacked" title="Agreement by domain" />
        <BarChart ariaLabel="Claude and ChatGPT smell counts by domain" data={modelRates} mode="grouped" title="Model smell counts" />
      </div>
      <ResultsSection
        columns={comparisonColumns}
        filename="reqsmell-comparison.csv"
        filterKeys={['agreementStatus', 'domain', 'type']}
        getRowKey={(row) => row.id}
        rows={report.rows}
        searchFields={['text', 'domain']}
        title="Side-by-side Results"
      />
    </section>
  )
}
