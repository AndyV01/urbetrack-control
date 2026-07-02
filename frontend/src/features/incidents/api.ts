import { buildQuery, http } from '@/lib/http'
import type { CreateIncidentInput, Incident, IncidentStatus, IncidentType } from '@/types'

export interface IncidentFilters {
  status?: IncidentStatus
  type?: IncidentType
  zoneId?: string
}

export const incidentsApi = {
  list: (filters: IncidentFilters = {}) =>
    http.get<Incident[]>(`/incidents${buildQuery(filters)}`),
  getById: (id: string) => http.get<Incident>(`/incidents/${id}`),
  create: (input: CreateIncidentInput) => http.post<Incident>('/incidents', input),
}
