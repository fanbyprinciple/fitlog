import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAuthBootstrap } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'

function App() {
  useAuthBootstrap()
  useTheme()
  return <RouterProvider router={router} />
}

export default App
