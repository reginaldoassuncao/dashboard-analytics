import { useLocation } from 'react-router-dom'
import { Menu, Bell, Search } from 'lucide-react'
import styles from './Header.module.css'

const routeNames = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/products': 'Produtos',
  '/users': 'Usuários',
  '/settings': 'Configurações'
}

function Header({ onToggleSidebar }) {
  const location = useLocation()
  const currentPageName = routeNames[location.pathname] || 'Página'

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button 
          className={styles.menuButton}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        <div className={styles.breadcrumbs}>
          <span className={styles.breadcrumbHome}>Dashboard Analytics</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{currentPageName}</span>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.notificationButton} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.notificationBadge}>3</span>
        </button>
        
        <div className={styles.userMenu}>
          <div className={styles.userAvatar}>👤</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Admin User</div>
            <div className={styles.userRole}>Administrador</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header