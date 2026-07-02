import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AssetsTable } from './AssetsTable'
import type { Asset } from '@/types'

const zoneNameById = { '1': 'Microcentro' }

describe('AssetsTable', () => {
  it('muestra un estado vacío cuando no hay assets', () => {
    render(<AssetsTable assets={[]} zoneNameById={zoneNameById} />)
    expect(screen.getByText('No hay assets para estos filtros')).toBeInTheDocument()
  })

  it('renderiza una fila por cada asset con su zona resuelta', () => {
    const assets: Asset[] = [
      {
        id: '1',
        type: 'BIN',
        status: 'OK',
        lat: -34.6037,
        lng: -58.3816,
        address: 'Av. Corrientes 1234',
        zoneId: '1',
      },
    ]
    render(<AssetsTable assets={assets} zoneNameById={zoneNameById} />)
    expect(screen.getByText('Av. Corrientes 1234')).toBeInTheDocument()
    expect(screen.getByText('Microcentro')).toBeInTheDocument()
  })
})
