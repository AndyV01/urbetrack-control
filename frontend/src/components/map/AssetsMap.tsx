import { useMemo } from 'react'
import { MapView, type MapMarker, type MarkerTone } from '@/components/map/MapView'
import type { Asset } from '@/types'

const statusTone: Record<string, MarkerTone> = {
  OK: 'ok',
  FULL: 'warning',
  DAMAGED: 'danger',
  OUT_OF_SERVICE: 'neutral',
}

const typeLabels: Record<string, string> = {
  BIN: 'Papelera',
  CONTAINER: 'Contenedor',
  BENCH: 'Banco',
}

// El mapa utiliza las coordenadas (lat/lng) provistas por la API mockeada.
// Las direcciones son datos de ejemplo y no necesariamente corresponden a
// la ubicación geográfica de esas coordenadas.

export function AssetsMap({ assets, zoneNameById }: { assets: Asset[]; zoneNameById: Record<string, string> }) {
    
  const markers = useMemo<MapMarker[]>(
    () =>
      assets.map((asset) => ({
        id: asset.id,
        lat: asset.lat,
        lng: asset.lng,
        tone: statusTone[asset.status] ?? 'neutral',
        title: asset.address,
        subtitle: `${typeLabels[asset.type] ?? asset.type} · ${zoneNameById[asset.zoneId] ?? asset.zoneId} · ${asset.status}`,
      })),
    [assets, zoneNameById],
  )

  return <MapView markers={markers} />
}