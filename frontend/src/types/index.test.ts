import { describe, expect, it } from 'vitest'
import { createAssetSchema, createIncidentSchema, createVehicleSchema } from './index'

describe('createAssetSchema', () => {
  it('acepta un asset válido', () => {
    const result = createAssetSchema.safeParse({
      type: 'BIN',
      status: 'OK',
      lat: '-34.6037',
      lng: '-58.3816',
      address: 'Av. Corrientes 1234',
      zoneId: '1',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza una latitud fuera de rango', () => {
    const result = createAssetSchema.safeParse({
      type: 'BIN',
      status: 'OK',
      lat: '200',
      lng: '-58.3816',
      address: 'Av. Corrientes 1234',
      zoneId: '1',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza una dirección vacía', () => {
    const result = createAssetSchema.safeParse({
      type: 'BIN',
      status: 'OK',
      lat: '-34.6037',
      lng: '-58.3816',
      address: '',
      zoneId: '1',
    })
    expect(result.success).toBe(false)
  })
})

describe('createIncidentSchema', () => {
  it('acepta un incidente válido', () => {
    const result = createIncidentSchema.safeParse({
      type: 'OVERFLOW',
      description: 'Contenedor desbordado',
      lat: '-34.6037',
      lng: '-58.3816',
      zoneId: '1',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza una descripción muy corta', () => {
    const result = createIncidentSchema.safeParse({
      type: 'OVERFLOW',
      description: 'Uy',
      lat: '-34.6037',
      lng: '-58.3816',
      zoneId: '1',
    })
    expect(result.success).toBe(false)
  })
})

describe('createVehicleSchema', () => {
  it('acepta un vehículo válido y normaliza la patente a mayúsculas', () => {
    const result = createVehicleSchema.safeParse({
      plate: 'ab123cd',
      type: 'TRUCK',
      capacity: '5000',
      zoneId: '1',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.plate).toBe('AB123CD')
    }
  })

  it('rechaza una capacidad negativa', () => {
    const result = createVehicleSchema.safeParse({
      plate: 'AB123CD',
      type: 'TRUCK',
      capacity: '-10',
      zoneId: '1',
    })
    expect(result.success).toBe(false)
  })
})
