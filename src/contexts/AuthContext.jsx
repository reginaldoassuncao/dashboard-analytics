import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
          setUser(savedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.logout(); // Clear potentially corrupted data
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const userData = await authService.login(credentials);
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, user: userData };
      }
      
      return { 
        success: false, 
        error: 'Credenciais inválidas. Use admin/admin' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Erro interno. Tente novamente.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout anyway
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      authService.updateUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    // Helper computed properties
    userName: user?.name || 'Usuário',
    userEmail: user?.email || 'usuario@dashboard.com',
    userRole: user?.role || 'admin',
    userAvatar: user?.avatar || '👤'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Custom hook for protected components
export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return { loading: true, authenticated: false };
  }
  
  return { loading: false, authenticated: isAuthenticated };
}