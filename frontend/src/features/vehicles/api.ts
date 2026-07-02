import { buildQuery, http } from '@/lib/http'
import type { CreateVehicleInput, Vehicle, VehicleStatus, VehicleType } from '@/types'

export interface VehicleFilters {
  status?: VehicleStatus
  type?: VehicleType
  zoneId?: string
}

export const vehiclesApi = {
  list: (filters: VehicleFilters = {}) =>
    http.get<Vehicle[]>(`/vehicles${buildQuery(filters)}`),
  getById: (id: string) => http.get<Vehicle>(`/vehicles/${id}`),
  create: (input: CreateVehicleInput) => http.post<Vehicle>('/vehicles', input),
}
