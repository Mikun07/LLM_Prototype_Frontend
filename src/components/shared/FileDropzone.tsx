import { FileUp } from 'lucide-react'

interface FileDropzoneProps {
  isDragging: boolean
  error: string | null
  onDrop: (event: React.DragEvent) => void
  onDragOver: (event: React.DragEvent) => void
  onDragLeave: () => void
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
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
        className={[
          'flex min-h-56 cursor-pointer flex-col items-center justify-center gap-4 rounded border-2 border-dashed bg-white p-8 text-center transition',
          isDragging ? 'border-brand-500 bg-brand-50' : 'border-border hover:border-brand-500',
        ].join(' ')}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <FileUp aria-hidden="true" className="h-10 w-10 text-brand-600" />
        <span className="text-lg font-semibold text-brand-900">Upload requirements CSV</span>
        <span className="max-w-xl text-sm leading-6 text-slate-600">
          Drop a CSV file here or select one from your computer.
        </span>
        <input accept=".csv,text/csv" className="sr-only" onChange={onFileSelect} type="file" />
      </label>
      {error !== null ? (
        <p className="mt-3 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-smell">
          {error}
        </p>
      ) : null}
    </div>
  )
}

