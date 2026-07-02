import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Select } from '@/components/ui/Select'
import { useVehicles } from '../hooks'
import { useZones } from '@/features/zones/hooks'
import { useZoneFilterStore } from '@/store/useZoneFilterStore'
import { vehicleStatuses, vehicleTypes, type VehicleStatus, type VehicleType } from '@/types'
import { CreateVehicleDialog } from './CreateVehicleDialog'
import { VehiclesTable } from './VehiclesTable'
import { Pagination } from '@/components/ui/Pagination'

const ALL = '__all__'

const typeLabels: Record<VehicleType, string> = { TRUCK: 'Camión', VAN: 'Camioneta', PICKUP: 'Pickup' }
const statusLabels: Record<VehicleStatus, string> = {
  ACTIVE: 'Activo',
  MAINTENANCE: 'En mantenimiento',
  OUT_OF_SERVICE: 'Fuera de servicio',
}

export function VehiclesPage() {
  const [status, setStatus] = useState<string>(ALL)
  const [type, setType] = useState<string>(ALL)
  const [page, setPage] = useState(1)
  const activeZoneId = useZoneFilterStore((s) => s.activeZoneId)
  const { data: zones = [] } = useZones()

  const PAGE_SIZE = 10

  const { data: vehicles = [], isLoading, isError } = useVehicles({
    status: status === ALL ? undefined : (status as VehicleStatus),
    type: type === ALL ? undefined : (type as VehicleType),
    zoneId: activeZoneId ?? undefined,
  })

  const zoneNameById = useMemo(() => Object.fromEntries(zones.map((z) => [z.id, z.name])), [zones])

  const paginatedVehicles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return vehicles.slice(start, start + PAGE_SIZE)
  }, [vehicles, page])

  useEffect(() => {
    setPage(1)
  }, [status, type, activeZoneId])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Logística"
        title="Flota"
        description="Camiones, camionetas y pickups asignados a cada zona."
        action={<CreateVehicleDialog />}
      />

      <div className="flex flex-wrap gap-3">
        <Select
          value={type}
          onValueChange={setType}
          aria-label="Filtrar por tipo"
          options={[{ value: ALL, label: 'Todos los tipos' }, ...vehicleTypes.map((t) => ({ value: t, label: typeLabels[t] }))]}
        />
        <Select
          value={status}
          onValueChange={setStatus}
          aria-label="Filtrar por estado"
          options={[{ value: ALL, label: 'Todos los estados' }, ...vehicleStatuses.map((s) => ({ value: s, label: statusLabels[s] }))]}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-paper-100/50">Cargando flota…</p>
      ) : isError ? (
        <p className="text-sm text-alert-500">
          No pudimos cargar la flota. Verificá que el backend esté corriendo en localhost:3000.
        </p>
      ) : (
        <>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={vehicles.length}
            onPageChange={setPage}
          />
          <VehiclesTable vehicles={paginatedVehicles} zoneNameById={zoneNameById} />
        </>
      )}
    </div>
  )
}
