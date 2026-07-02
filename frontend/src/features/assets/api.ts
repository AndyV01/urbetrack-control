import { buildQuery, http } from '@/lib/http'
import type { Asset, AssetStatus, AssetType, CreateAssetInput } from '@/types'

export interface AssetFilters {
  status?: AssetStatus
  type?: AssetType
}

export const assetsApi = {
  list: (filters: AssetFilters = {}) =>
    http.get<Asset[]>(`/assets${buildQuery(filters)}`),
  create: (input: CreateAssetInput) => http.post<Asset>('/assets', input),
}
