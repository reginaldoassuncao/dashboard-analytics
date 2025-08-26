import { Routes, Route } from 'react-router-dom'
import { SimpleDateProvider } from './contexts/SimpleDateContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Products from './pages/Products'
import Users from './pages/Users'
import Settings from './pages/Settings'

function App() {
  return (
    <ErrorBoundary>
      <SimpleDateProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/products" element={<Products />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </SimpleDateProvider>
    </ErrorBoundary>
  )
}

export default App