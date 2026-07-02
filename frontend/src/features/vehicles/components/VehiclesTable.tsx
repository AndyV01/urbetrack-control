import type { Vehicle } from '@/types'
import { VehicleStatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Truck } from 'lucide-react'

const typeLabels: Record<string, string> = {
  TRUCK: 'Camión',
  VAN: 'Camioneta',
  PICKUP: 'Pickup',
}

export function VehiclesTable({
  vehicles,
  zoneNameById,
}: {
  vehicles: Vehicle[]
  zoneNameById: Record<string, string>
}) {
  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon={<Truck className="h-8 w-8" />}
        title="No hay vehículos para estos filtros"
        description="Probá con otra combinación de zona, tipo o estado, o sumá un vehículo nuevo."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-inset ring-paper-50/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-ink-900 text-[11px] uppercase tracking-widest text-paper-100/50">
            <th className="px-4 py-3 text-center font-mono font-medium">Patente</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Tipo</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Capacidad</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Zona</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-paper-50/5">
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="bg-ink-950/40">
              <td className="px-4 py-3 text-center font-mono text-paper-50">{vehicle.plate}</td>
              <td className="px-4 py-3 text-center font-mono text-paper-100/70">{typeLabels[vehicle.type] ?? vehicle.type}</td>
              <td className="px-4 py-3 text-center font-mono text-paper-100/70">{vehicle.capacity.toLocaleString('es-AR')} kg</td>
              <td className="px-4 py-3 text-center font-mono text-paper-100/70">{zoneNameById[vehicle.zoneId] ?? vehicle.zoneId}</td>
              <td className="px-4 py-3 text-center">
                <VehicleStatusBadge status={vehicle.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
