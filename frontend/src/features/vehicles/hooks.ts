import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vehiclesApi, type VehicleFilters } from './api'
import type { CreateVehicleInput } from '@/types'

export const vehicleKeys = {
  all: ['vehicles'] as const,
  list: (filters: VehicleFilters) => ['vehicles', filters] as const,
}

export function useVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: vehicleKeys.list(filters),
    queryFn: () => vehiclesApi.list(filters),
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateVehicleInput) => vehiclesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all })
    },
  })
}
