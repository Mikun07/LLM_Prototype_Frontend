import { ArrowDown, ArrowUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'

export interface DataTableColumn<T> {
  key: keyof T | string
  header: string
  render: (row: T) => ReactNode
  sortableValue?: (row: T) => string | number
}

interface DataTableProps<T> {
  rows: T[]
  columns: DataTableColumn<T>[]
  getRowKey: (row: T, index: number) => string
  sortKey: string | null
  sortDirection: 'asc' | 'desc'
  onSort: (key: string) => void
}

export function DataTable<T>({
  columns,
  getRowKey,
  onSort,
  rows,
  sortDirection,
  sortKey,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded border border-border bg-white p-6 text-sm text-slate-600">
        No rows match the current view.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-brand-50 text-xs uppercase text-brand-900">
            <tr>
              {columns.map((column) => {
                const key = String(column.key)
                const isActive = sortKey === key

                return (
                  <th className="border-b border-border px-4 py-3 font-semibold" key={key}>
                    {column.sortableValue === undefined ? (
                      column.header
                    ) : (
                      <Button
                        className="h-auto px-0 py-0 text-xs uppercase"
                        icon={
                          isActive && sortDirection === 'asc' ? (
                            <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                          )
                        }
                        onClick={() => onSort(key)}
                        variant="ghost"
                      >
                        {column.header}
                      </Button>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr className="border-b border-border last:border-b-0" key={getRowKey(row, index)}>
                {columns.map((column) => (
                  <td className="max-w-xl px-4 py-3 align-top text-slate-700" key={String(column.key)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
