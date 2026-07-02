import { z } from 'zod'

// Zones

export const zoneSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export type Zone = z.infer<typeof zoneSchema>

// Assets

export const assetTypes = ['BIN', 'CONTAINER', 'BENCH'] as const
export const assetStatuses = ['OK', 'DAMAGED', 'FULL', 'OUT_OF_SERVICE'] as const

export type AssetType = (typeof assetTypes)[number]
export type AssetStatus = (typeof assetStatuses)[number]

export const assetSchema = z.object({
  id: z.string(),
  type: z.enum(assetTypes),
  status: z.enum(assetStatuses),
  lat: z.number(),
  lng: z.number(),
  address: z.string(),
  zoneId: z.string(),
})

export type Asset = z.infer<typeof assetSchema>

export const createAssetSchema = z.object({
  type: z.enum(assetTypes, { message: 'Elegí un tipo de asset' }),
  status: z.enum(assetStatuses, { message: 'Elegí un estado' }),
  lat: z.coerce
    .number({ message: 'La latitud tiene que ser un número' })
    .min(-90, 'Latitud inválida')
    .max(90, 'Latitud inválida'),
  lng: z.coerce
    .number({ message: 'La longitud tiene que ser un número' })
    .min(-180, 'Longitud inválida')
    .max(180, 'Longitud inválida'),
  address: z.string().min(3, 'La dirección es muy corta'),
  zoneId: z.string().min(1, 'Elegí una zona'),
})

export type CreateAssetInput = z.infer<typeof createAssetSchema>


// Incidents

export const incidentTypes = ['OVERFLOW', 'DAMAGE', 'LITTERING', 'OTHER'] as const
export const incidentStatuses = ['REPORTED', 'IN_PROGRESS', 'RESOLVED'] as const

export type IncidentType = (typeof incidentTypes)[number]
export type IncidentStatus = (typeof incidentStatuses)[number]

export const incidentSchema = z.object({
  id: z.string(),
  type: z.enum(incidentTypes),
  status: z.enum(incidentStatuses),
  description: z.string(),
  lat: z.number(),
  lng: z.number(),
  zoneId: z.string(),
  createdAt: z.string(),
})

export type Incident = z.infer<typeof incidentSchema>

export const createIncidentSchema = z.object({
  type: z.enum(incidentTypes, { message: 'Elegí un tipo de incidente' }),
  status: z.enum(incidentStatuses).optional(),
  description: z.string().min(5, 'Contanos un poco más qué pasó'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  zoneId: z.string().min(1, 'Elegí una zona'),
})

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>

// Vehicles

export const vehicleTypes = ['TRUCK', 'VAN', 'PICKUP'] as const
export const vehicleStatuses = ['ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE'] as const

export type VehicleType = (typeof vehicleTypes)[number]
export type VehicleStatus = (typeof vehicleStatuses)[number]

export const vehicleSchema = z.object({
  id: z.string(),
  plate: z.string(),
  type: z.enum(vehicleTypes),
  status: z.enum(vehicleStatuses),
  capacity: z.number(),
  zoneId: z.string(),
})

export type Vehicle = z.infer<typeof vehicleSchema>

export const createVehicleSchema = z.object({
  plate: z
    .string()
    .min(4, 'Patente inválida')
    .max(10, 'Patente inválida')
    .transform((v) => v.toUpperCase()),
  type: z.enum(vehicleTypes, { message: 'Elegí un tipo de vehículo' }),
  status: z.enum(vehicleStatuses).optional(),
  capacity: z.coerce
    .number({ message: 'La capacidad tiene que ser un número' })
    .positive('La capacidad tiene que ser positiva'),
  zoneId: z.string().min(1, 'Elegí una zona'),
})

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>
