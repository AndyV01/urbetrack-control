import { useMemo } from 'react'
import { MapView, type MapMarker, type MarkerTone } from '@/components/map/MapView'
import type { Incident } from '@/types'
import { formatDate } from '@/lib/utils'

const statusTone: Record<string, MarkerTone> = {
  REPORTED: 'danger',
  IN_PROGRESS: 'warning',
  RESOLVED: 'ok',
}

const typeLabels: Record<string, string> = {
  OVERFLOW: 'Desborde',
  DAMAGE: 'Daño',
  LITTERING: 'Basural / suciedad',
  OTHER: 'Otro',
}

export function IncidentsMap({
  incidents,
  zoneNameById,
}: {
  incidents: Incident[]
  zoneNameById: Record<string, string>
}) {
  const markers = useMemo<MapMarker[]>(
    () =>
      incidents.map((incident) => ({
        id: incident.id,
        lat: incident.lat,
        lng: incident.lng,
        tone: statusTone[incident.status] ?? 'neutral',
        title: incident.description,
        subtitle: `${typeLabels[incident.type] ?? incident.type} · ${zoneNameById[incident.zoneId] ?? incident.zoneId} · ${formatDate(incident.createdAt)}`,
      })),
    [incidents, zoneNameById],
  )

  return <MapView markers={markers} />
}