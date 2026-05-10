import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAuthBootstrap } from './hooks/useAuth'

function App() {
  useAuthBootstrap()
  return <RouterProvider router={router} />
}

export default App
