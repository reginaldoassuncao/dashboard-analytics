import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import Sidebar from './Sidebar'
import Header from './Header'
import PremiumToolbar from '../ui/PremiumToolbar'
import styles from './Layout.module.css'

function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isFullscreen } = useTheme()

  // Check if is mobile and set initial sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true)
      }
    }
    
    // Set initial state
    checkMobile()
    
    // Listen for resize
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleNavigate = () => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }

  const handleOverlayClick = () => {
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true)
    }
  }

  return (
    <div className={`${styles.layout} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* Mobile overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className={styles.mobileOverlay}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
      
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        onNavigate={handleNavigate}
        hidden={isFullscreen}
      />
      <div className={`${styles.main} ${sidebarCollapsed ? styles.mainCollapsed : ''} ${isFullscreen ? styles.mainFullscreen : ''}`}>
        {!isFullscreen && (
          <Header 
            onToggleSidebar={handleToggleSidebar}
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