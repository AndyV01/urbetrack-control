import { describe, expect, it } from 'vitest'
import { cn, formatDate } from './utils'

describe('cn', () => {
  it('combina clases y resuelve conflictos de Tailwind', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('ignora valores falsy', () => {
    const hidden: string | false = false
    expect(cn('text-sm', hidden && 'hidden', undefined, 'text-paper-50')).toBe('text-sm text-paper-50')
  })
})

describe('formatDate', () => {
  it('formatea una fecha ISO en formato es-AR', () => {
    const formatted = formatDate('2024-01-15T10:30:00Z')
    expect(formatted).toMatch(/2024/)
  })
})
