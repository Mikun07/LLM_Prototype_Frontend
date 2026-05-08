import { describe, expect, it } from 'vitest'
import { formatFileSize, formatPercentage } from '../../src/utils/formatters'

describe('formatters', () => {
  it('formats percentages with one decimal place', () => {
    expect(formatPercentage(42)).toBe('42.0%')
  })

  it('formats byte values into readable file sizes', () => {
    expect(formatFileSize(512)).toBe('512 B')
    expect(formatFileSize(2048)).toBe('2.0 KB')
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB')
  })
})

