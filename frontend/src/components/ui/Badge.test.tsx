import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AssetStatusBadge, IncidentStatusBadge, VehicleStatusBadge } from './Badge'

describe('AssetStatusBadge', () => {
  it('muestra el status legible', () => {
    render(<AssetStatusBadge status="OUT_OF_SERVICE" />)
    expect(screen.getByText('OUT OF SERVICE')).toBeInTheDocument()
  })
})

describe('IncidentStatusBadge', () => {
  it('muestra el status de un incidente', () => {
    render(<IncidentStatusBadge status="REPORTED" />)
    expect(screen.getByText('REPORTED')).toBeInTheDocument()
  })
})

describe('VehicleStatusBadge', () => {
  it('muestra el status de un vehículo', () => {
    render(<VehicleStatusBadge status="MAINTENANCE" />)
    expect(screen.getByText('MAINTENANCE')).toBeInTheDocument()
  })
})
