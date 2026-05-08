import { ArrowRight, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { useFileUpload } from '../../hooks/useFileUpload'
import { usePagination } from '../../hooks/usePagination'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setDetectedColumns,
  setFile,
  setRequirements,
  setStep,
} from '../../store/slices/wizardSlice'
import type { ColumnDetection, ParsedFile, RequirementRow } from '../../types'
import { formatFileSize } from '../../utils/formatters'
import { Button } from '../shared/Button'
import { FileDropzone } from '../shared/FileDropzone'

const emptyDetection: ColumnDetection = {
  id: false,
  text: false,
  domain: false,
  type: false,
  project: false,
}

function PreviewTable({ rows }: { readonly rows: RequirementRow[] }) {
  const pagination = usePagination(rows, 10)
  const firstVisibleRow = rows.length === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const lastVisibleRow =
    rows.length === 0 ? 0 : Math.min(rows.length, firstVisibleRow + pagination.currentPage.length - 1)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-border bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-white/80">CSV preview</p>
        <p className="text-sm font-semibold text-white">
          Showing {firstVisibleRow}-{lastVisibleRow} of {rows.length} rows
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              {['ID', 'Text', 'Domain', 'Type', 'Project'].map((header) => (
                <th className="border-b border-border px-4 py-3" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagination.currentPage.map((row, i) => (
              <tr
                className={[
                  'border-b border-border last:border-b-0',
                  i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                ].join(' ')}
                key={`${row.id}-${pagination.pageIndex}-${i}`}
              >
                <td className="px-4 py-3 font-mono text-brand-600">{row.id}</td>
                <td className="max-w-xl px-4 py-3 text-slate-700">{row.text}</td>
                <td className="px-4 py-3 text-slate-600">{row.domain}</td>
                <td className="px-4 py-3 text-slate-600">{row.type}</td>
                <td className="px-4 py-3 text-slate-600">{row.project}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <label className="font-semibold" htmlFor="upload-preview-page-size">
            Rows per page
          </label>
          <select
            className="h-9 rounded border border-border bg-white px-2"
            id="upload-preview-page-size"
            onChange={(event) => pagination.setPageSize(Number(event.target.value))}
            value={pagination.pageSize}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-sm font-semibold text-slate-600">
            Page {pagination.pageIndex + 1} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              disabled={pagination.pageIndex === 0}
              icon={<ChevronLeft aria-hidden="true" className="h-4 w-4" />}
              onClick={() => pagination.setPageIndex(pagination.pageIndex - 1)}
              variant="secondary"
            >
              Previous
            </Button>
            <Button
              disabled={pagination.pageIndex >= pagination.totalPages - 1}
              icon={<ChevronRight aria-hidden="true" className="h-4 w-4" />}
              onClick={() => pagination.setPageIndex(pagination.pageIndex + 1)}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UploadStep() {
  const dispatch = useAppDispatch()
  const { detectedColumns, file, requirements } = useAppSelector((state) => state.wizard)

  function handleParsedFile(parsedFile: ParsedFile | null): void {
    dispatch(setFile(parsedFile?.metadata ?? null))
    dispatch(setRequirements(parsedFile?.rows ?? []))
    dispatch(setDetectedColumns(parsedFile?.detection ?? emptyDetection))
  }

  const upload = useFileUpload(handleParsedFile)
  const canContinue = file !== null && detectedColumns.text

  return (
    <section className="flex flex-col gap-6">
      <FileDropzone
        error={upload.error}
        isDragging={upload.isDragging}
        onDragLeave={upload.handleDragLeave}
        onDragOver={upload.handleDragOver}
        onDrop={upload.handleDrop}
        onFileSelect={upload.handleFileSelect}
      />

      {file === null ? null : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto]">
            <div className="rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-400">File</p>
              <p className="mt-1 truncate font-semibold text-slate-900">{file.name}</p>
            </div>
            <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Size</p>
              <p className="mt-1 font-mono font-semibold text-slate-900">
                {formatFileSize(file.size)}
              </p>
            </div>
            <div className="rounded-xl border border-accent-100 bg-gradient-to-br from-accent-50 to-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-500">Rows</p>
              <p className="mt-1 font-mono font-semibold text-slate-900">{file.rowCount}</p>
            </div>
            <Button
              icon={<RotateCcw aria-hidden="true" className="h-4 w-4" />}
              onClick={upload.clearFile}
              variant="secondary"
            >
              Replace
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-bold text-slate-800">
              Detected columns
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {Object.entries(detectedColumns).map(([name, isPresent]) => (
                <div
                  className={[
                    'rounded-xl px-3 py-2 text-sm font-bold uppercase',
                    isPresent
                      ? 'bg-teal-500 text-white shadow-sm shadow-teal-100'
                      : 'bg-rose-500 text-white shadow-sm shadow-rose-100',
                  ].join(' ')}
                  key={name}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>

          <PreviewTable rows={requirements} />
        </>
      )}

      <div className="flex justify-end">
        <Button
          disabled={!canContinue}
          icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}
          onClick={() => dispatch(setStep('configure'))}
        >
          Continue
        </Button>
      </div>
    </section>
  )
}
