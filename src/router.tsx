import { createHashRouter } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { History } from './pages/History'
import { Settings } from './pages/Settings'
import { Exercises } from './pages/Exercises'
import { Routines } from './pages/Routines'
import { RoutineEdit } from './pages/RoutineEdit'
import { Logger } from './pages/Logger'
import { NotFound } from './pages/NotFound'

// Analytics owns recharts (~150KB). React Router 7 native lazy field
// splits it into its own chunk without React.lazy/Suspense gymnastics.
export const router = createHashRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'workouts', element: <Routines /> },
      { path: 'routines/:id', element: <RoutineEdit /> },
      { path: 'history', element: <History /> },
      { path: 'exercises', element: <Exercises /> },
      { path: 'logger', element: <Logger /> },
      {
        path: 'analytics',
        lazy: async () => {
          const m = await import('./pages/Analytics')
          return { Component: m.Analytics }
        },
      },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
