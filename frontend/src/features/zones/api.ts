import { http } from '@/lib/http'
import type { Zone } from '@/types'

export const zonesApi = {
  list: () => http.get<Zone[]>('/zones'),
  getById: (id: string) => http.get<Zone>(`/zones/${id}`),
}
