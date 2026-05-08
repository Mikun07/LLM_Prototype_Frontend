import { ArrowRight, RotateCcw } from 'lucide-react'
import { useFileUpload } from '../../hooks/useFileUpload'
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

function PreviewTable({ rows }: { rows: RequirementRow[] }) {
  return (
    <div className="overflow-hidden rounded border border-border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-brand-50 text-xs uppercase text-brand-900">
          <tr>
            {['ID', 'Text', 'Domain', 'Type', 'Project'].map((header) => (
              <th className="border-b border-border px-4 py-3" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 20).map((row) => (
            <tr className="border-b border-border last:border-b-0" key={row.id}>
              <td className="px-4 py-3 font-mono">{row.id}</td>
              <td className="max-w-xl px-4 py-3">{row.text}</td>
              <td className="px-4 py-3">{row.domain}</td>
              <td className="px-4 py-3">{row.type}</td>
              <td className="px-4 py-3">{row.project}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4">
            <div className="rounded border border-border bg-white p-4">
              <p className="text-sm text-slate-500">File</p>
              <p className="mt-1 font-semibold text-slate-900">{file.name}</p>
            </div>
            <div className="rounded border border-border bg-white p-4">
              <p className="text-sm text-slate-500">Size</p>
              <p className="mt-1 font-mono font-semibold text-slate-900">
                {formatFileSize(file.size)}
              </p>
            </div>
            <div className="rounded border border-border bg-white p-4">
              <p className="text-sm text-slate-500">Rows</p>
              <p className="mt-1 font-mono font-semibold text-slate-900">{file.rowCount}</p>
            </div>
            <Button icon={<RotateCcw aria-hidden="true" className="h-4 w-4" />} onClick={upload.clearFile} variant="secondary">
              Replace
            </Button>
          </div>

          <div className="rounded border border-border bg-white p-4">
            <h2 className="font-display text-xl font-semibold text-brand-900">
              Detected columns
            </h2>
            <div className="mt-3 grid grid-cols-5 gap-3">
              {Object.entries(detectedColumns).map(([name, isPresent]) => (
                <div
                  className={[
                    'rounded border px-3 py-2 text-sm font-semibold uppercase',
                    isPresent
                      ? 'border-green-200 bg-green-50 text-clean'
                      : 'border-slate-200 bg-slate-50 text-slate-400',
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

