import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { AssetsPage } from '@/features/assets/components/AssetsPage'
import { IncidentsPage } from '@/features/incidents/components/IncidentsPage'
import { VehiclesPage } from '@/features/vehicles/components/VehiclesPage'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
      </Routes>
    </AppShell>
  )
}

export default App
