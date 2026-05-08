export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatModelName(model: string): string {
  return model === 'chatgpt' ? 'ChatGPT' : 'Claude'
}
