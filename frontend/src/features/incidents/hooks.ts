import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { incidentsApi, type IncidentFilters } from './api'
import type { CreateIncidentInput } from '@/types'

export const incidentKeys = {
  all: ['incidents'] as const,
  list: (filters: IncidentFilters) => ['incidents', filters] as const,
  detail: (id: string) => ['incidents', 'detail', id] as const,
}

export function useIncidents(filters: IncidentFilters = {}) {
  return useQuery({
    queryKey: incidentKeys.list(filters),
    queryFn: () => incidentsApi.list(filters),
  })
}

export function useIncident(id: string | undefined) {
  return useQuery({
    queryKey: incidentKeys.detail(id ?? ''),
    queryFn: () => incidentsApi.getById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateIncident() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateIncidentInput) => incidentsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.all })
    },
  })
}
