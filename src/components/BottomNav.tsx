import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, BarChart3, Settings } from 'lucide-react'
import './BottomNav.css'

const tabs = [
  { to: '/', icon: Home, label: 'home', end: true },
  { to: '/workouts', icon: Dumbbell, label: 'workouts', end: false },
  { to: '/analytics', icon: BarChart3, label: 'analytics', end: false },
  { to: '/settings', icon: Settings, label: 'settings', end: false },
] as const

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="primary">
      {tabs.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `bottom-nav__tab ${isActive ? 'is-active' : ''}`
          }
        >
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
