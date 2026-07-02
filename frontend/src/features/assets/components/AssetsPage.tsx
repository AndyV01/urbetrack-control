import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Select } from '@/components/ui/Select'
import { useAssets } from '../hooks'
import { useZones } from '@/features/zones/hooks'
import { useZoneFilterStore } from '@/store/useZoneFilterStore'
import { assetStatuses, assetTypes, type AssetStatus, type AssetType } from '@/types'
import { CreateAssetDialog } from './CreateAssetDialog'
import { AssetsTable } from './AssetsTable'
import { Pagination } from '@/components/ui/Pagination'

const ALL = '__all__'

const typeLabels: Record<AssetType, string> = { BIN: 'Papelera', CONTAINER: 'Contenedor', BENCH: 'Banco' }
const statusLabels: Record<AssetStatus, string> = {
  OK: 'OK',
  DAMAGED: 'Dañado',
  FULL: 'Lleno',
  OUT_OF_SERVICE: 'Fuera de servicio',
}

export function AssetsPage() {
  const [status, setStatus] = useState<string>(ALL)
  const [type, setType] = useState<string>(ALL)
  const [page, setPage] = useState(1)
  const activeZoneId = useZoneFilterStore((s) => s.activeZoneId)
  const { data: zones = [] } = useZones()

  const PAGE_SIZE = 10

  // status/type se filtran en el servidor (la API los soporta como query params);
  // zoneId no está documentado como filtro de /assets, así que se aplica en cliente.
  const { data: assets = [], isLoading, isError } = useAssets({
    status: status === ALL ? undefined : (status as AssetStatus),
    type: type === ALL ? undefined : (type as AssetType),
  })

  const scopedAssets = useMemo(
    () => (activeZoneId ? assets.filter((a) => a.zoneId === activeZoneId) : assets),
    [assets, activeZoneId],
  )

  const paginatedAssets = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return scopedAssets.slice(start, start + PAGE_SIZE)
  }, [scopedAssets, page])

  const zoneNameById = useMemo(
    () => Object.fromEntries(zones.map((z) => [z.id, z.name])),
    [zones],
  )

  useEffect(() => {
    setPage(1)
  }, [status, type, activeZoneId])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Mobiliario urbano"
        title="Assets"
        description="Papeleras, contenedores y bancos registrados en la ciudad."
        action={<CreateAssetDialog />}
      />

      <div className="flex flex-wrap gap-3">
        <Select
          value={type}
          onValueChange={setType}
          aria-label="Filtrar por tipo"
          options={[{ value: ALL, label: 'Todos los tipos' }, ...assetTypes.map((t) => ({ value: t, label: typeLabels[t] }))]}
        />
        <Select
          value={status}
          onValueChange={setStatus}
          aria-label="Filtrar por estado"
          options={[{ value: ALL, label: 'Todos los estados' }, ...assetStatuses.map((s) => ({ value: s, label: statusLabels[s] }))]}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-paper-100/50">Cargando assets…</p>
      ) : isError ? (
        <p className="text-sm text-alert-500">
          No pudimos cargar los assets. Verificá que el backend esté corriendo en localhost:3000.
        </p>
      ) : (
        <>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={scopedAssets.length}
            onPageChange={setPage}
          />
          <AssetsTable assets={paginatedAssets} zoneNameById={zoneNameById} />

        </>
      )}
    </div>
  )
}
