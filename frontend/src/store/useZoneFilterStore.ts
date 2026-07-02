import { create } from 'zustand'

interface ZoneFilterState {
  /** null significa "todas las zonas" */
  activeZoneId: string | null
  setActiveZoneId: (zoneId: string | null) => void
}

/**
 * La zona activa vive en un store global (no en la URL) a propósito se
 * comparte entre Dashboard, Assets, Incidents y Vehicles, y al
 * elegir una zona en cualquier pantalla afecte a las demás sin tener que
 * levantar el estado hasta App o duplicarlo por página.
 */
export const useZoneFilterStore = create<ZoneFilterState>((set) => ({
  activeZoneId: null,
  setActiveZoneId: (zoneId) => set({ activeZoneId: zoneId }),
}))
