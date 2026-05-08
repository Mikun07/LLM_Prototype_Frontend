import { useState } from 'react'
import { parseCsvFile } from '../utils/csvParser'
import type { ParsedFile } from '../types'

interface UseFileUploadReturn {
  isDragging: boolean
  file: ParsedFile | null
  error: string | null
  handleDrop: (event: React.DragEvent) => void
  handleDragOver: (event: React.DragEvent) => void
  handleDragLeave: () => void
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  clearFile: () => void
}

export function useFileUpload(
  onParsedFile: (parsedFile: ParsedFile | null) => void,
): UseFileUploadReturn {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<ParsedFile | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function processFile(selectedFile: File | undefined): Promise<void> {
    if (selectedFile === undefined) {
      return
    }

    const result = await parseCsvFile(selectedFile)
    setError(result.error)
    setFile(result.parsedFile)
    onParsedFile(result.parsedFile)
  }

  function handleDrop(event: React.DragEvent): void {
    event.preventDefault()
    setIsDragging(false)
    void processFile(event.dataTransfer.files[0])
  }

  function handleDragOver(event: React.DragEvent): void {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(): void {
    setIsDragging(false)
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>): void {
    void processFile(event.target.files?.[0])
    event.target.value = ''
  }

  function clearFile(): void {
    setFile(null)
    setError(null)
    onParsedFile(null)
  }

  return {
    isDragging,
    file,
    error,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileSelect,
    clearFile,
  }
}

