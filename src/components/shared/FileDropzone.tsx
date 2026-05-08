import { FileUp } from 'lucide-react'

interface FileDropzoneProps {
  readonly isDragging: boolean
  readonly error: string | null
  readonly onDrop: (event: React.DragEvent) => void
  readonly onDragOver: (event: React.DragEvent) => void
  readonly onDragLeave: () => void
  readonly onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function FileDropzone({
  error,
  isDragging,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
}: FileDropzoneProps) {
  return (
    <div>
      <label
        aria-label="Upload requirements CSV file"
        className={[
          'relative flex min-h-56 cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
          isDragging
            ? 'border-brand-500 bg-gradient-to-br from-brand-50 to-accent-50 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-brand-50/50',
        ].join(' ')}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className={['flex h-16 w-16 items-center justify-center rounded-2xl transition-all', isDragging ? 'bg-brand-600 text-white scale-110' : 'bg-gradient-brand text-white'].join(' ')}>
          <FileUp aria-hidden="true" className="h-8 w-8" />
        </div>
        <div>
          <span className="block text-lg font-bold text-slate-800">Upload requirements CSV</span>
          <span className="mt-1 block max-w-sm text-sm leading-6 text-slate-500">
            Drag and drop your file here, or <span className="font-semibold text-brand-600">click to browse</span>
          </span>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-400">
          .csv files only
        </span>
        <input accept=".csv,text/csv" className="sr-only" onChange={onFileSelect} type="file" />
      </label>
      {error === null ? null : (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

