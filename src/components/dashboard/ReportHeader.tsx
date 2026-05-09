import { Download } from 'lucide-react'
import { Button } from '../shared/Button'

interface ReportHeaderProps {
  readonly title: string
  readonly subtitle: string
  readonly onDownloadPdf?: () => void
}

export function ReportHeader({ onDownloadPdf, subtitle, title }: ReportHeaderProps) {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white via-sky-50/60 to-fuchsia-50/70 p-5 shadow-[0_18px_42px_-30px_rgba(79,70,229,0.55)] sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
      {onDownloadPdf !== undefined && (
        <Button
          icon={<Download aria-hidden="true" className="h-4 w-4" />}
          onClick={onDownloadPdf}
          variant="secondary"
        >
          Download PDF
        </Button>
      )}
    </div>
  )
}
