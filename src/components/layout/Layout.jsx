import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import Sidebar from './Sidebar'
import Header from './Header'
import PremiumToolbar from '../ui/PremiumToolbar'
import styles from './Layout.module.css'

function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isFullscreen } = useTheme()

  return (
    <div className={`${styles.layout} ${isFullscreen ? styles.fullscreen : ''}`}>
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        hidden={isFullscreen}
      />
      <div className={`${styles.main} ${sidebarCollapsed ? styles.mainCollapsed : ''} ${isFullscreen ? styles.mainFullscreen : ''}`}>
        {!isFullscreen && (
          <Header 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}
        <main className={styles.content}>
          <PremiumToolbar />
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout