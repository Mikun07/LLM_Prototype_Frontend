import type {
  AmbiguityResult,
  InconsistencyResult,
  ModelReport as ModelReportType,
} from '../../types'
import { formatModelName, formatPercentage } from '../../utils/formatters'
import { BarChart } from '../charts/BarChart'
import { DonutChart } from '../charts/DonutChart'
import { Badge } from '../shared/Badge'
import { type DataTableColumn } from '../shared/DataTable'
import { BreakdownTable } from './BreakdownTable'
import { ReportHeader } from './ReportHeader'
import { ResultsSection } from './ResultsSection'
import { SummaryPanel } from './SummaryPanel'

interface ModelReportProps {
  report: ModelReportType
}

const ambiguityColumns: DataTableColumn<AmbiguityResult>[] = [
  { key: 'id', header: 'ID', render: (row) => <span className="font-mono">{row.id}</span>, sortableValue: (row) => row.id },
  { key: 'text', header: 'Text', render: (row) => row.text, sortableValue: (row) => row.text },
  { key: 'domain', header: 'Domain', render: (row) => row.domain, sortableValue: (row) => row.domain },
  { key: 'type', header: 'Type', render: (row) => row.type, sortableValue: (row) => String(row.type) },
  { key: 'label', header: 'Label', render: (row) => <Badge value={row.label} />, sortableValue: (row) => row.label },
  { key: 'confidence', header: 'Confidence', render: (row) => <Badge value={row.confidence} />, sortableValue: (row) => row.confidence },
  { key: 'explanation', header: 'Explanation', render: (row) => row.explanation, sortableValue: (row) => row.explanation },
  {
    key: 'suggestion',
    header: 'Suggestion',
    render: (row) =>
      row.label === 'SMELL' ? (
        <details>
          <summary className="cursor-pointer font-medium text-brand-700">View</summary>
          <p className="mt-2 text-slate-700">{row.suggestion}</p>
        </details>
      ) : (
        <span className="text-slate-400">None</span>
      ),
  },
]

const inconsistencyColumns: DataTableColumn<InconsistencyResult>[] = [
  { key: 'reqAId', header: 'Req A', render: (row) => <span className="font-mono">{row.reqAId}</span>, sortableValue: (row) => row.reqAId },
  { key: 'reqBId', header: 'Req B', render: (row) => <span className="font-mono">{row.reqBId}</span>, sortableValue: (row) => row.reqBId },
  { key: 'reqAText', header: 'Req A text', render: (row) => row.reqAText, sortableValue: (row) => row.reqAText },
  { key: 'reqBText', header: 'Req B text', render: (row) => row.reqBText, sortableValue: (row) => row.reqBText },
  { key: 'domain', header: 'Domain', render: (row) => row.domain, sortableValue: (row) => row.domain },
  { key: 'label', header: 'Label', render: (row) => <Badge value={row.label} />, sortableValue: (row) => row.label },
  { key: 'confidence', header: 'Confidence', render: (row) => <Badge value={row.confidence} />, sortableValue: (row) => row.confidence },
  { key: 'explanation', header: 'Explanation', render: (row) => row.explanation, sortableValue: (row) => row.explanation },
]

export function ModelReport({ report }: ModelReportProps) {
  const modelName = formatModelName(report.model)
  const donutData = [
    { name: 'Clean', value: report.stats.clean, color: '#16a34a' },
    { name: 'Smells', value: report.stats.smells, color: '#dc2626' },
  ]
  const domainData = report.stats.byDomain.map((row) => ({
    name: row.name,
    clean: row.clean,
    smells: row.smells,
  }))
  const smellTypeData = report.stats.bySmellType.map((row) => ({
    name: row.name,
    value: row.smells,
  }))
  const confidenceData = ['HIGH', 'MEDIUM', 'LOW'].map((level) => ({
    name: level,
    value: [
      ...report.ambiguityResults,
      ...report.inconsistencyResults,
    ].filter((row) => row.confidence === level).length,
  }))

  return (
    <section className="flex flex-col gap-6">
      <ReportHeader
        subtitle={`${report.fileName} - ${formatPercentage(report.stats.smellRate)} smell rate`}
        title={`${modelName} Report`}
      />
      <SummaryPanel stats={report.stats} />
      <div className="grid grid-cols-3 gap-4">
        <BreakdownTable rows={report.stats.bySmellType} title="By smell type" />
        <BreakdownTable rows={report.stats.byDomain} title="By domain" />
        <BreakdownTable rows={report.stats.byRequirementType} title="By requirement type" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DonutChart ariaLabel={`${modelName} clean versus smells`} data={donutData} title="Clean vs smells" />
        <BarChart ariaLabel={`${modelName} smell counts by domain`} data={domainData} mode="stacked" title="Smells by domain" />
        <BarChart ariaLabel={`${modelName} smell counts by type`} data={smellTypeData} title="Smells by type" />
        <BarChart ariaLabel={`${modelName} confidence distribution`} data={confidenceData} title="Confidence distribution" />
      </div>
      <ResultsSection
        columns={ambiguityColumns}
        filename={`reqsmell-${report.model}-ambiguity.csv`}
        filterKeys={['label', 'domain', 'type']}
        getRowKey={(row) => row.id}
        rows={report.ambiguityResults}
        searchFields={['text', 'explanation']}
        title="Ambiguity Results"
      />
      <ResultsSection
        columns={inconsistencyColumns}
        filename={`reqsmell-${report.model}-inconsistency.csv`}
        filterKeys={['label', 'domain']}
        getRowKey={(row, index) => `${row.reqAId}-${row.reqBId}-${index}`}
        rows={report.inconsistencyResults}
        searchFields={['reqAText', 'reqBText', 'explanation']}
        title="Inconsistency Results"
      />
    </section>
  )
}
