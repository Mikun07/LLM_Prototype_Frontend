import { useMemo, useState } from 'react'

interface UseTableSearchReturn<T> {
  searchedRows: T[]
  query: string
  setQuery: (query: string) => void
}

export function useTableSearch<T extends Record<string, unknown>>(
  rows: T[],
  searchFields: (keyof T)[],
): UseTableSearchReturn<T> {
  const [query, setQuery] = useState('')
  const searchedRows = useMemo(() => {
    const normalised = query.trim().toLowerCase()

    if (normalised.length === 0) {
      return rows
    }

    return rows.filter((row) =>
      searchFields.some((field) =>
        String(row[field] ?? '').toLowerCase().includes(normalised),
      ),
    )
  }, [query, rows, searchFields])

  return { searchedRows, query, setQuery }
}

