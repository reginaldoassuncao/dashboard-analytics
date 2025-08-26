import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('dashboard-theme');
    return saved || 'light';
  });
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dashboard-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply theme CSS variables
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--body-bg', '#0f172a');
      document.documentElement.style.setProperty('--content-bg', '#1e293b');
      document.documentElement.style.setProperty('--card-bg', '#334155');
      document.documentElement.style.setProperty('--text-primary', '#f8fafc');
      document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
      document.documentElement.style.setProperty('--border-color', '#475569');
      document.documentElement.style.setProperty('--sidebar-bg', '#1e293b');
    } else {
      document.documentElement.style.setProperty('--body-bg', '#f9fafb');
      document.documentElement.style.setProperty('--content-bg', '#ffffff');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--text-primary', '#111827');
      document.documentElement.style.setProperty('--text-secondary', '#6b7280');
      document.documentElement.style.setProperty('--border-color', '#e5e7eb');
      document.documentElement.style.setProperty('--sidebar-bg', '#ffffff');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (err) {
      console.warn('Fullscreen not supported:', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.warn('Exit fullscreen error:', err);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const value = {
    theme,
    isFullscreen,
    toggleTheme,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}