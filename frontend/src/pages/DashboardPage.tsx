import { AlertTriangle, Boxes, CheckCircle2, Truck } from 'lucide-react'
import { useAssets } from '@/features/assets/hooks'
import { useIncidents } from '@/features/incidents/hooks'
import { useVehicles } from '@/features/vehicles/hooks'
import { useZones } from '@/features/zones/hooks'
import { useZoneFilterStore } from '@/store/useZoneFilterStore'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'

export function DashboardPage() {
  const activeZoneId = useZoneFilterStore((s) => s.activeZoneId)

  const { data: zones = [] } = useZones()
  const { data: assets = [], isLoading: loadingAssets } = useAssets()
  const { data: incidents = [], isLoading: loadingIncidents } = useIncidents()
  const { data: vehicles = [], isLoading: loadingVehicles } = useVehicles()

  const isLoading = loadingAssets || loadingIncidents || loadingVehicles

  const scopedAssets = activeZoneId ? assets.filter((a) => a.zoneId === activeZoneId) : assets
  const scopedIncidents = activeZoneId ? incidents.filter((i) => i.zoneId === activeZoneId) : incidents
  const scopedVehicles = activeZoneId ? vehicles.filter((v) => v.zoneId === activeZoneId) : vehicles

  const assetsNeedingAttention = scopedAssets.filter(
    (a) => a.status === 'DAMAGED' || a.status === 'FULL',
  ).length
  const openIncidents = scopedIncidents.filter((i) => i.status !== 'RESOLVED').length
  const activeVehicles = scopedVehicles.filter((v) => v.status === 'ACTIVE').length
  const assetsOk = scopedAssets.filter((a) => a.status === 'OK').length

  const activeZoneName = zones.find((z) => z.id === activeZoneId)?.name

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Panel operativo"
        title={activeZoneName ? `Estado de ${activeZoneName}` : 'Estado de la ciudad'}
        description="Vista consolidada de mobiliario urbano, incidentes abiertos y flota disponible."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Assets en buen estado"
          value={isLoading ? '—' : assetsOk}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="ok"
          hint={`de ${scopedAssets.length} assets registrados`}
        />
        <StatCard
          label="Requieren atención"
          value={isLoading ? '—' : assetsNeedingAttention}
          icon={<Boxes className="h-5 w-5" />}
          tone="warning"
          hint="dañados o llenos"
        />
        <StatCard
          label="Incidentes abiertos"
          value={isLoading ? '—' : openIncidents}
          icon={<AlertTriangle className="h-5 w-5" />}
          tone="danger"
          hint="reportados o en curso"
        />
        <StatCard
          label="Vehículos activos"
          value={isLoading ? '—' : activeVehicles}
          icon={<Truck className="h-5 w-5" />}
          tone="ok"
          hint={`de ${scopedVehicles.length} en flota`}
        />
      </div>

      {!activeZoneId ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-sm font-semibold text-paper-50">Desglose por zona</h2>
          <div className="overflow-hidden rounded-xl ring-1 ring-inset ring-paper-50/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-ink-900 text-[11px] uppercase tracking-widest text-paper-100/50">
                  <th className="px-4 py-3 text-center font-mono font-medium">Zona</th>
                  <th className="px-4 py-3 text-center font-mono font-medium">Assets</th>
                  <th className="px-4 py-3 text-center font-mono font-medium">Atención</th>
                  <th className="px-4 py-3 text-center font-mono font-medium">Incidentes abiertos</th>
                  <th className="px-4 py-3 text-center font-mono font-medium">Vehículos activos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-50/5">
                {zones.map((zone) => {
                  const zAssets = assets.filter((a) => a.zoneId === zone.id)
                  const zAttention = zAssets.filter((a) => a.status === 'DAMAGED' || a.status === 'FULL').length
                  const zIncidents = incidents.filter((i) => i.zoneId === zone.id && i.status !== 'RESOLVED').length
                  const zVehicles = vehicles.filter((v) => v.zoneId === zone.id && v.status === 'ACTIVE').length
                  return (
                    <tr key={zone.id} className="bg-ink-950/40">
                      <td className="px-4 py-3 text-center font-medium text-paper-50">{zone.name}</td>
                      <td className="px-4 py-3 text-center text-paper-100/80">{zAssets.length}</td>
                      <td className="px-4 py-3 text-center">
                        {zAttention > 0 ? <Badge tone="warning">{zAttention}</Badge> : <span className="text-paper-100/40">0</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {zIncidents > 0 ? <Badge tone="danger">{zIncidents}</Badge> : <span className="text-paper-100/40">0</span>}
                      </td>
                      <td className="px-4 py-3 text-center text-paper-100/80">{zVehicles}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  )
}
