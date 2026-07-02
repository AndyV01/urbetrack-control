import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assetsApi, type AssetFilters } from './api'
import type { CreateAssetInput } from '@/types'

export const assetKeys = {
  all: ['assets'] as const,
  list: (filters: AssetFilters) => ['assets', filters] as const,
}

export function useAssets(filters: AssetFilters = {}) {
  return useQuery({
    queryKey: assetKeys.list(filters),
    queryFn: () => assetsApi.list(filters),
  })
}

export function useCreateAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAssetInput) => assetsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetKeys.all })
    },
  })
}
