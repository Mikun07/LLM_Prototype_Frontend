import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import { useDownloadCsv } from '../../hooks/useDownloadCsv'
import { usePagination } from '../../hooks/usePagination'
import { Badge } from '../shared/Badge'
import { Button } from '../shared/Button'
import { DataTable, type DataTableColumn } from '../shared/DataTable'

interface ResultsSectionProps<T extends object> {
  title: string
  rows: T[]
  columns: DataTableColumn<T>[]
  searchFields: (keyof T)[]
  filterKeys: (keyof T)[]
  filename: string
  getRowKey: (row: T, index: number) => string
}

function uniqueValues<T extends object>(
  rows: T[],
  key: keyof T,
): string[] {
  return Array.from(new Set(rows.map((row) => String(row[key] ?? ''))))
    .filter((value) => value.length > 0)
    .sort()
}

export function ResultsSection<T extends object>({
  columns,
  filename,
  filterKeys,
  getRowKey,
  rows,
  searchFields,
  title,
}: ResultsSectionProps<T>) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const { download } = useDownloadCsv()

  const filteredRows = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase()

    return rows.filter((row) => {
      const queryMatches =
        normalisedQuery.length === 0 ||
        searchFields.some((field) =>
          String(row[field] ?? '').toLowerCase().includes(normalisedQuery),
        )
      const filtersMatch = filterKeys.every((key) => {
        const selected = filters[String(key)]

        return selected === undefined || selected === '' || String(row[key] ?? '') === selected
      })

      return queryMatches && filtersMatch
    })
  }, [filterKeys, filters, query, rows, searchFields])

  const sortedRows = useMemo(() => {
    if (sortKey === null) {
      return filteredRows
    }

    const column = columns.find((candidate) => String(candidate.key) === sortKey)

    if (column?.sortableValue === undefined) {
      return filteredRows
    }

    return [...filteredRows].sort((first, second) => {
      const firstValue = column.sortableValue?.(first) ?? ''
      const secondValue = column.sortableValue?.(second) ?? ''
      const result =
        typeof firstValue === 'number' && typeof secondValue === 'number'
          ? firstValue - secondValue
          : String(firstValue).localeCompare(String(secondValue))

      return sortDirection === 'asc' ? result : -result
    })
  }, [columns, filteredRows, sortDirection, sortKey])

  const pagination = usePagination(sortedRows, 10)

  function handleSort(key: string): void {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-xl font-semibold text-brand-900">{title}</h3>
        <Button
          icon={<Download aria-hidden="true" className="h-4 w-4" />}
          onClick={() => download(rows, filename)}
          variant="secondary"
        >
          CSV
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_repeat(3,180px)] gap-3">
        <label className="relative block">
          <span className="sr-only">Search {title}</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            className="h-10 w-full rounded border border-border bg-white pl-9 pr-3 text-sm"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search text and explanations"
            value={query}
          />
        </label>

        {filterKeys.slice(0, 3).map((key) => (
          <label className="block" key={String(key)}>
            <span className="sr-only">Filter by {String(key)}</span>
            <select
              className="h-10 w-full rounded border border-border bg-white px-3 text-sm"
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  [String(key)]: event.target.value,
                }))
              }
              value={filters[String(key)] ?? ''}
            >
              <option value="">{String(key)}</option>
              {uniqueValues(rows, key).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Badge value={`${sortedRows.length} rows`} />
        <span>Page {pagination.pageIndex + 1} of {pagination.totalPages}</span>
      </div>

      <DataTable
        columns={columns}
        getRowKey={getRowKey}
        onSort={handleSort}
        rows={pagination.currentPage}
        sortDirection={sortDirection}
        sortKey={sortKey}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Rows
          <select
            className="h-9 rounded border border-border bg-white px-2"
            onChange={(event) => pagination.setPageSize(Number(event.target.value))}
            value={pagination.pageSize}
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <Button
            disabled={pagination.pageIndex === 0}
            onClick={() => pagination.setPageIndex(pagination.pageIndex - 1)}
            variant="secondary"
          >
            Previous
          </Button>
          <Button
            disabled={pagination.pageIndex >= pagination.totalPages - 1}
            onClick={() => pagination.setPageIndex(pagination.pageIndex + 1)}
            variant="secondary"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}
