import { describe, expect, it } from 'vitest'
import { buildQuery } from './http'

describe('buildQuery', () => {
  it('devuelve string vacío sin filtros', () => {
    expect(buildQuery({})).toBe('')
  })

  it('omite valores undefined y vacíos', () => {
    expect(buildQuery({ status: 'OK', type: undefined, zoneId: '' })).toBe('?status=OK')
  })

  it('serializa múltiples filtros', () => {
    const query = buildQuery({ status: 'OK', type: 'BIN' })
    expect(query).toContain('status=OK')
    expect(query).toContain('type=BIN')
    expect(query.startsWith('?')).toBe(true)
  })
})
