import { createHashRouter } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { History } from './pages/History'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { Exercises } from './pages/Exercises'
import { NotFound } from './pages/NotFound'

// HashRouter — GH Pages serves static files only; hash routing
// avoids needing a 404.html SPA fallback.
export const router = createHashRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'workouts', element: <History /> },
      { path: 'exercises', element: <Exercises /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
