import { useEffect, useMemo, useState } from 'react'

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
  const [requestedPageIndex, setRequestedPageIndex] = useState(0)
  const [selectedPageSize, setSelectedPageSize] = useState(initialPageSize)
  const totalPages = Math.max(1, Math.ceil(rows.length / selectedPageSize))
  const clampedPageIndex = Math.min(requestedPageIndex, totalPages - 1)

  useEffect(() => {
    if (requestedPageIndex !== clampedPageIndex) {
      setRequestedPageIndex(clampedPageIndex)
    }
  }, [clampedPageIndex, requestedPageIndex])

  const currentPage = useMemo(() => {
    const start = clampedPageIndex * selectedPageSize

    return rows.slice(start, start + selectedPageSize)
  }, [clampedPageIndex, selectedPageSize, rows])

  function setPageIndex(index: number): void {
    setRequestedPageIndex(Math.min(Math.max(index, 0), totalPages - 1))
  }

  function setPageSize(size: number): void {
    setSelectedPageSize(size)
    setRequestedPageIndex(0)
  }

  return {
    currentPage,
    pageIndex: clampedPageIndex,
    pageSize: selectedPageSize,
    totalPages,
    setPageIndex,
    setPageSize,
  }
}
