import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from './ProtectedRoute.module.css';

function ProtectedRoute({ 
  children, 
  requirePermissions = [], 
  fallbackPath = '/login',
  showLoadingPage = true 
}) {
  const { isAuthenticated, loading, user, hasPermission } = useAuth();
  const location = useLocation();

  // Auto-refresh session activity
  useEffect(() => {
    if (isAuthenticated) {
      // Update last activity timestamp
      const lastActivity = Date.now();
      localStorage.setItem('dashboard_last_activity', lastActivity.toString());
    }
  }, [location.pathname, isAuthenticated]);

  // Show loading spinner while checking authentication
  if (loading) {
    if (showLoadingPage) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>📊</div>
              <h2 className={styles.logoText}>Dashboard Analytics</h2>
            </div>
            
            <LoadingSpinner size="large" />
            
            <p className={styles.loadingText}>
              Verificando autenticação...
            </p>
            
            <div className={styles.loadingProgress}>
              <div className={styles.progressBar}></div>
            </div>
          </div>
        </div>
      );
    }
    
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check specific permissions if required
  if (requirePermissions.length > 0) {
    const hasRequiredPermissions = requirePermissions.every(permission => 
      user?.permissions?.includes(permission) || hasPermission?.(permission)
    );

    if (!hasRequiredPermissions) {
      return (
        <div className={styles.permissionDenied}>
          <div className={styles.permissionContent}>
            <div className={styles.permissionIcon}>🚫</div>
            <h2 className={styles.permissionTitle}>Acesso Negado</h2>
            <p className={styles.permissionText}>
              Você não tem permissão para acessar esta página.
            </p>
            <p className={styles.permissionDetails}>
              Permissões necessárias: <strong>{requirePermissions.join(', ')}</strong>
            </p>
            <p className={styles.permissionUser}>
              Usuário atual: <strong>{user?.name || 'N/A'}</strong> ({user?.role || 'N/A'})
            </p>
            <button 
              className={styles.backButton}
              onClick={() => window.history.back()}
            >
              Voltar
            </button>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has required permissions
  return children;
}

// Higher-order component for easier usage
export function withProtection(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Hook for checking if user has access to specific features
export function usePermissionCheck(requiredPermissions = []) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return { hasAccess: false, missingPermissions: requiredPermissions };
  }

  const userPermissions = user.permissions || [];
  const missingPermissions = requiredPermissions.filter(
    permission => !userPermissions.includes(permission)
  );

  return {
    hasAccess: missingPermissions.length === 0,
    missingPermissions,
    userPermissions
  };
}

export default ProtectedRoute;