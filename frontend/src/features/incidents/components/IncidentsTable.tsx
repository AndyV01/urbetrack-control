import type { Incident } from '@/types'
import { IncidentStatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'
import { TriangleAlert } from 'lucide-react'

const typeLabels: Record<string, string> = {
  OVERFLOW: 'Desborde',
  DAMAGE: 'Daño',
  LITTERING: 'Basural / suciedad',
  OTHER: 'Otro',
}

export function IncidentsTable({
  incidents,
  zoneNameById,
}: {
  incidents: Incident[]
  zoneNameById: Record<string, string>
}) {
  if (incidents.length === 0) {
    return (
      <EmptyState
        icon={<TriangleAlert className="h-8 w-8" />}
        title="No hay incidentes para estos filtros"
        description="Buena señal si esperabas ver algo acá. Probá otros filtros o reportá uno nuevo."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-inset ring-paper-50/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-ink-900 text-[11px] uppercase tracking-widest text-paper-100/50">
            <th className="px-4 py-3 text-center font-mono font-medium">Descripción</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Tipo</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Zona</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Reportado</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-paper-50/5">
          {incidents.map((incident) => (
            <tr key={incident.id} className="bg-ink-950/40">
              <td className="max-w-xs px-4 py-3 text-center text-paper-50">{incident.description}</td>
              <td className="px-4 py-3 text-center font-mono text-paper-100/70">{typeLabels[incident.type] ?? incident.type}</td>
              <td className="px-4 py-3 text-center font-mono text-paper-100/70">{zoneNameById[incident.zoneId] ?? incident.zoneId}</td>
              <td className="px-4 py-3 text-center font-mono text-xs text-paper-100/50">{formatDate(incident.createdAt)}</td>
              <td className="px-4 py-3 text-center">
                <IncidentStatusBadge status={incident.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
