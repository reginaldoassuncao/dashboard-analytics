import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BarChart3, 
  ShoppingBag, 
  Users, 
  Settings,
  ChevronLeft,
  Menu
} from 'lucide-react'
import styles from './Sidebar.module.css'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Produtos', href: '/products', icon: ShoppingBag },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

function Sidebar({ collapsed, onToggle }) {
  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
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
            <div className={styles.avatar}>👤</div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>Admin User</div>
              <div className={styles.userEmail}>admin@dashboard.com</div>
            </div>
          </div>
        )}
        {collapsed && <div className={styles.avatarCollapsed}>👤</div>}
      </div>
    </div>
  )
}

export default Sidebar