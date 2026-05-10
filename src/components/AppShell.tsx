import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../state/useAuthStore'
import { BottomNav } from './BottomNav'
import './AppShell.css'

export function AppShell() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  if (loading) {
    return (
      <div className="app-boot" aria-busy="true">
        <span>fitlog</span>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="app-shell">
      <main className="app-shell__main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
