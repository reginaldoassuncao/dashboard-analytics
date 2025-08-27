import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BarChart3, 
  ShoppingBag, 
  Users, 
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
  User
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Sidebar.module.css'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Produtos', href: '/products', icon: ShoppingBag },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

function Sidebar({ collapsed, onToggle, hidden }) {
  const { user, logout, userName, userEmail, userAvatar } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair do sistema?')) {
      logout();
    }
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${hidden ? styles.hidden : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>📊</div>
          {!collapsed && <span className={styles.logoText}>Dashboard Analytics</span>}
        </div>
        <button 
          className={styles.toggleButton} 
          onClick={onToggle}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => 
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  <Icon size={20} className={styles.navIcon} />
                  {!collapsed && <span className={styles.navText}>{item.name}</span>}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className={styles.footer}>
        {!collapsed && (
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{userAvatar}</div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{userName}</div>
              <div className={styles.userEmail}>{userEmail}</div>
              <div className={styles.userRole}>
                {user?.role || 'admin'} • {user?.permissions?.length || 0} permissões
              </div>
            </div>
            <button 
              className={styles.logoutButton}
              onClick={handleLogout}
              title="Logout"
              aria-label="Fazer logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
        {collapsed && (
          <div className={styles.collapsedFooter}>
            <div className={styles.avatarCollapsed}>{userAvatar}</div>
            <button 
              className={styles.logoutButtonCollapsed}
              onClick={handleLogout}
              title="Logout"
              aria-label="Fazer logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar