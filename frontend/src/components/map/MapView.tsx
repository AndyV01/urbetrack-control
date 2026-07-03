import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { EmptyState } from '@/components/ui/EmptyState'
import { MapPinned } from 'lucide-react'

export type MarkerTone = 'ok' | 'warning' | 'danger' | 'neutral' | 'info'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  tone: MarkerTone
  title: string
  subtitle?: string
  children?: React.ReactNode
}


const toneColor: Record<MarkerTone, string> = {
  ok: '#22c55e',
  warning: '#f97316',
  danger: '#ef4444',
  neutral: '#8b8fa3',
  info: '#38bdf8',
}

function pinIcon(tone: MarkerTone) {
  const color = toneColor[tone]
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 18px; height: 18px; border-radius: 9999px;
        background: ${color};
        border: 2px solid rgba(255,255,255,0.9);
        box-shadow: 0 0 0 2px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.35);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  })
}

/** Ajusta el zoom/centro del mapa para que todos los markers entren en cuadro. */
function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap()

  useEffect(() => {
    if (markers.length === 0) return
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 15)
      return
    }
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]))
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 15 })
  }, [map, markers])

  return null
}

export function MapView({ markers }: { markers: MapMarker[] }) {
  const icons = useMemo(() => {
    const cache = new Map<MarkerTone, L.DivIcon>()
    for (const tone of Object.keys(toneColor) as MarkerTone[]) {
      cache.set(tone, pinIcon(tone))
    }
    return cache
  }, [])

  if (markers.length === 0) {
    return (
      <EmptyState
        icon={<MapPinned className="h-8 w-8" />}
        title="No hay ubicaciones para mostrar"
        description="Probá con otra combinación de filtros."
      />
    )
  }

  // Buenos Aires como fallback antes de que FitBounds ajuste al primer render.
  const fallbackCenter: [number, number] = [-34.6037, -58.3816]

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-inset ring-paper-50/10">
      <MapContainer
        center={fallbackCenter}
        zoom={12}
        scrollWheelZoom
        style={{ height: '480px', width: '100%', background: 'var(--color-ink-900)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={markers} />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={icons.get(marker.tone)}>
            <Popup>
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-ink-950">{marker.title}</p>
                {marker.subtitle ? <p className="text-xs text-ink-950/60">{marker.subtitle}</p> : null}
                {marker.children}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}