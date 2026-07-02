import type { Asset } from '@/types'
import { AssetStatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { MapPinned } from 'lucide-react'

const typeLabels: Record<string, string> = {
  BIN: 'Papelera',
  CONTAINER: 'Contenedor',
  BENCH: 'Banco',
}

export function AssetsTable({ assets, zoneNameById }: { assets: Asset[]; zoneNameById: Record<string, string> }) {
  if (assets.length === 0) {
    return (
      <EmptyState
        icon={<MapPinned className="h-8 w-8" />}
        title="No hay assets para estos filtros"
        description="Probá con otra combinación de zona, tipo o estado, o registrá un asset nuevo."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-inset ring-paper-50/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-ink-900 text-[11px] uppercase tracking-widest text-paper-100/50">
            <th className="px-4 py-3 text-center font-mono font-medium">Dirección</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Tipo</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Zona</th>
            <th className="px-4 py-3 text-center font-mono font-medium">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-paper-50/5">
          {assets.map((asset) => (
            <tr key={asset.id} className="bg-ink-950/40">
              <td className="px-4 py-3 text-center text-paper-50">{asset.address}</td>
              <td className="px-4 py-3 text-center text-paper-100/70">{typeLabels[asset.type] ?? asset.type}</td>
              <td className="px-4 py-3 text-center text-paper-100/70">{zoneNameById[asset.zoneId] ?? asset.zoneId}</td>
              <td className="px-4 py-3 text-center">
                <AssetStatusBadge status={asset.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
