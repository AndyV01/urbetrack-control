import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Select } from '@/components/ui/Select'
import { useIncidents } from '../hooks'
import { useZones } from '@/features/zones/hooks'
import { useZoneFilterStore } from '@/store/useZoneFilterStore'
import { incidentStatuses, incidentTypes, type IncidentStatus, type IncidentType } from '@/types'
import { CreateIncidentDialog } from './CreateIncidentDialog'
import { IncidentsTable } from './IncidentsTable'
import { Pagination } from '@/components/ui/Pagination'

const ALL = '__all__'

const typeLabels: Record<IncidentType, string> = {
  OVERFLOW: 'Desborde',
  DAMAGE: 'Daño',
  LITTERING: 'Basural / suciedad',
  OTHER: 'Otro',
}

const statusLabels: Record<IncidentStatus, string> = {
  REPORTED: 'Reportado',
  IN_PROGRESS: 'En curso',
  RESOLVED: 'Resuelto',
}

export function IncidentsPage() {
  const [status, setStatus] = useState<string>(ALL)
  const [type, setType] = useState<string>(ALL)
  const [page, setPage] = useState(1)
  const activeZoneId = useZoneFilterStore((s) => s.activeZoneId)
  const { data: zones = [] } = useZones()

  const PAGE_SIZE = 10

  // La API sí soporta zoneId como query param para /incidents, a diferencia
  // de /assets, así que acá el filtro de zona viaja directo al servidor.
  const { data: incidents = [], isLoading, isError } = useIncidents({
    status: status === ALL ? undefined : (status as IncidentStatus),
    type: type === ALL ? undefined : (type as IncidentType),
    zoneId: activeZoneId ?? undefined,
  })

  const zoneNameById = useMemo(() => Object.fromEntries(zones.map((z) => [z.id, z.name])), [zones])

  const paginatedIncidents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return incidents.slice(start, start + PAGE_SIZE)
  }, [incidents, page])

  useEffect(() => {
    setPage(1)
  }, [status, type, activeZoneId])
  
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Seguimiento"
        title="Incidentes"
        description="Desbordes, daños y reportes de suciedad en la vía pública."
        action={<CreateIncidentDialog />}
      />

      <div className="flex flex-wrap gap-3">
        <Select
          value={type}
          onValueChange={setType}
          aria-label="Filtrar por tipo"
          options={[{ value: ALL, label: 'Todos los tipos' }, ...incidentTypes.map((t) => ({ value: t, label: typeLabels[t] }))]}
        />
        <Select
          value={status}
          onValueChange={setStatus}
          aria-label="Filtrar por estado"
          options={[{ value: ALL, label: 'Todos los estados' }, ...incidentStatuses.map((s) => ({ value: s, label: statusLabels[s] }))]}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-paper-100/50">Cargando incidentes…</p>
      ) : isError ? (
        <p className="text-sm text-alert-500">
          No pudimos cargar los incidentes. Verificá que el backend esté corriendo en localhost:3000.
        </p>
      ) : (
        <>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={incidents.length}
            onPageChange={setPage}
          />
          <IncidentsTable incidents={paginatedIncidents} zoneNameById={zoneNameById} />
        </>
      )}
    </div>
  )
}
