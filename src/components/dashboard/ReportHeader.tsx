import { Download } from 'lucide-react'
import { Button } from '../shared/Button'

interface ReportHeaderProps {
  readonly title: string
  readonly subtitle: string
  readonly onDownloadCsv?: () => void
}

export function ReportHeader({ onDownloadCsv, subtitle, title }: ReportHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-brand-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
      {onDownloadCsv !== undefined && (
        <Button icon={<Download aria-hidden="true" className="h-4 w-4" />} onClick={onDownloadCsv} variant="secondary">
          CSV
        </Button>
      )}
    </div>
  )
}

