import { useQuery } from '@tanstack/react-query'
import { zonesApi } from './api'

export const zoneKeys = {
  all: ['zones'] as const,
  detail: (id: string) => ['zones', id] as const,
}

export function useZones() {
  return useQuery({
    queryKey: zoneKeys.all,
    queryFn: zonesApi.list,
    staleTime: 5 * 60 * 1000, 
  })
}

export function useZone(id: string | undefined) {
  return useQuery({
    queryKey: zoneKeys.detail(id ?? ''),
    queryFn: () => zonesApi.getById(id as string),
    enabled: Boolean(id),
  })
}
