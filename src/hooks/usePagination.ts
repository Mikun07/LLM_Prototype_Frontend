import { useMemo, useState } from 'react'

interface UsePaginationReturn<T> {
  currentPage: T[]
  pageIndex: number
  pageSize: number
  totalPages: number
  setPageIndex: (index: number) => void
  setPageSize: (size: number) => void
}

export function usePagination<T>(
  rows: T[],
  initialPageSize = 10,
): UsePaginationReturn<T> {
  const [pageIndex, setPageIndexState] = useState(0)
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))

  const currentPage = useMemo(() => {
    const start = pageIndex * pageSize

    return rows.slice(start, start + pageSize)
  }, [pageIndex, pageSize, rows])

  function setPageIndex(index: number): void {
    setPageIndexState(Math.min(Math.max(index, 0), totalPages - 1))
  }

  function setPageSize(size: number): void {
    setPageSizeState(size)
    setPageIndexState(0)
  }

  return {
    currentPage,
    pageIndex,
    pageSize,
    totalPages,
    setPageIndex,
    setPageSize,
  }
}

