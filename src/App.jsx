import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProductsProvider } from './contexts/ProductsContext'
import { SimpleDateProvider } from './contexts/SimpleDateContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import ErrorBoundary from './components/ui/ErrorBoundary'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import Users from './pages/Users'
import Settings from './pages/Settings'

function ProtectedAppContent() {
  useKeyboardShortcuts();
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/edit/:id" element={<ProductForm />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <SimpleDateProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route 
                  path="/*" 
                  element={
                    <ProtectedRoute>
                      <ProtectedAppContent />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </SimpleDateProvider>
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App