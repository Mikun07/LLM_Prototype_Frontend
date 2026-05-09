import type {
  AmbiguityResult,
  InconsistencyResult,
  ModelReport as ModelReportType,
} from '../../types'
import { formatModelName } from '../../utils/formatters'
import { downloadModelReportPdf } from '../../utils/reportPdf'
import { BarChart } from '../charts/BarChart'
import { DonutChart } from '../charts/DonutChart'
import { Badge } from '../shared/Badge'
import { type DataTableColumn } from '../shared/DataTable'
import { BreakdownTable } from './BreakdownTable'
import { ReportHeader } from './ReportHeader'
import { ResultsSection } from './ResultsSection'
import { SummaryPanel } from './SummaryPanel'

interface ModelReportProps {
  readonly report: ModelReportType
}

const ambiguityColumns: DataTableColumn<AmbiguityResult>[] = [
  {
    key: 'id',
    header: 'ID',
    render: (row) => <span className="font-mono font-semibold text-slate-700">{row.id}</span>,
    sortableValue: (row) => row.id,
  },
  { key: 'text', header: 'Requirement', render: (row) => row.text, sortableValue: (row) => row.text },
  { key: 'label', header: 'Result', render: (row) => <Badge value={row.label} />, sortableValue: (row) => row.label },
  { key: 'explanation', header: 'Reason', render: (row) => row.explanation, sortableValue: (row) => row.explanation },
  {
    key: 'suggestion',
    header: 'Suggested rewrite',
    render: (row) =>
      row.label === 'SMELL' ? (
        <span>{row.suggestion}</span>
      ) : (
        <span className="text-slate-400">None</span>
      ),
  },
]

const inconsistencyColumns: DataTableColumn<InconsistencyResult>[] = [
  {
    key: 'pair',
    header: 'Pair',
    render: (row) => (
      <span className="font-mono font-semibold text-slate-700">
        {row.reqAId} / {row.reqBId}
      </span>
    ),
    sortableValue: (row) => `${row.reqAId}-${row.reqBId}`,
  },
  {
    key: 'requirements',
    header: 'Requirements',
    render: (row) => (
      <div className="flex flex-col gap-2">
        <p>
          <span className="font-mono text-slate-500">{row.reqAId}</span> {row.reqAText}
        </p>
        <p>
          <span className="font-mono text-slate-500">{row.reqBId}</span> {row.reqBText}
        </p>
      </div>
    ),
    sortableValue: (row) => row.reqAText,
  },
  { key: 'label', header: 'Result', render: (row) => <Badge value={row.label} />, sortableValue: (row) => row.label },
  { key: 'explanation', header: 'Reason', render: (row) => row.explanation, sortableValue: (row) => row.explanation },
  {
    key: 'suggestion',
    header: 'Suggested fix',
    render: (row) => row.suggestion || <span className="text-slate-400">None</span>,
  },
]

export function ModelReport({ report }: ModelReportProps) {
  const modelName = formatModelName(report.model)
  const donutData = [
    { name: 'Clean', value: report.stats.clean, color: '#16a34a' },
    { name: 'Needs review', value: report.stats.smells, color: '#e11d48' },
  ]
  const domainData = report.stats.byDomain.map((row) => ({
    name: row.name,
    clean: row.clean,
    smells: row.smells,
  }))
  return (
    <section className="flex flex-col gap-6">
      <ReportHeader
        onDownloadPdf={() => downloadModelReportPdf(report)}
        subtitle={`${modelName} report`}
        title={`${modelName} Report`}
      />
      <SummaryPanel stats={report.stats} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DonutChart ariaLabel={`${modelName} clean versus needs review`} data={donutData} title="Clean vs needs review" />
        <BarChart ariaLabel={`${modelName} review counts by domain`} data={domainData} mode="stacked" title="Results by domain" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BreakdownTable rows={report.stats.bySmellType} title="By check type" />
        <BreakdownTable rows={report.stats.byDomain} title="By domain" />
      </div>
      <ResultsSection
        columns={ambiguityColumns}
        filename={`reqsmell-${report.model}-ambiguity.csv`}
        filterKeys={['label', 'domain', 'type']}
        getRowKey={(row) => row.id}
        rows={report.ambiguityResults}
        searchFields={['text', 'explanation']}
        title="Ambiguity checks"
      />
      <ResultsSection
        columns={inconsistencyColumns}
        filename={`reqsmell-${report.model}-inconsistency.csv`}
        filterKeys={['label', 'domain']}
        getRowKey={(row, index) => `${row.reqAId}-${row.reqBId}-${index}`}
        rows={report.inconsistencyResults}
        searchFields={['reqAText', 'reqBText', 'explanation']}
        title="Inconsistency checks"
      />
    </section>
  )
}
