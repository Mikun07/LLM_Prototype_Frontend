import { useState } from 'react'
import { getApiErrorMessage, uploadCsv } from '../api/client'
import { useAppDispatch } from '../store/hooks'
import { addToast } from '../store/slices/toastSlice'
import type { ParsedFile } from '../types'

interface UseFileUploadReturn {
  isDragging: boolean
  isUploading: boolean
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
  const dispatch = useAppDispatch()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<ParsedFile | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function processFile(selectedFile: File | undefined): Promise<void> {
    if (selectedFile === undefined || isUploading) {
      return
    }

    try {
      setIsUploading(true)
      setError(null)
      const response = await uploadCsv(selectedFile)
      const parsedFile: ParsedFile = {
        metadata: response.file,
        rows: response.requirements,
        detectedColumns: response.detectedColumns,
        detection: response.detection,
      }

      setError(null)
      setFile(parsedFile)
      onParsedFile(parsedFile)
    } catch (error) {
      const message = getApiErrorMessage(error)

      setError(message)
      setFile(null)
      onParsedFile(null)
      dispatch(
        addToast({
          tone: 'error',
          title: 'Upload failed',
          message,
        }),
      )
    } finally {
      setIsUploading(false)
    }
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
    isUploading,
    file,
    error,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileSelect,
    clearFile,
  }
}
