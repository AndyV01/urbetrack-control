import { List, Map as MapIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'table' | 'map'

export function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-ink-800 p-1 ring-1 ring-inset ring-paper-50/15">
      <button
        type="button"
        onClick={() => onChange('table')}
        aria-pressed={value === 'table'}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          value === 'table' ? 'bg-brand-500 text-white' : 'text-paper-100/60 hover:text-paper-50',
        )}
      >
        <List className="h-4 w-4" />
        Tabla
      </button>
      <button
        type="button"
        onClick={() => onChange('map')}
        aria-pressed={value === 'map'}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          value === 'map' ? 'bg-brand-500 text-white' : 'text-paper-100/60 hover:text-paper-50',
        )}
      >
        <MapIcon className="h-4 w-4" />
        Mapa
      </button>
    </div>
  )
}