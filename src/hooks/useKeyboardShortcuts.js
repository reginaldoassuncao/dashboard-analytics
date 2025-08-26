import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function useKeyboardShortcuts() {
  const { toggleTheme, toggleFullscreen } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent shortcuts when typing in inputs
      if (
        event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.contentEditable === 'true'
      ) {
        return;
      }

      const { key, ctrlKey, metaKey, shiftKey } = event;
      const isCmd = ctrlKey || metaKey;

      switch (true) {
        // F11 - Toggle fullscreen
        case key === 'F11':
          event.preventDefault();
          toggleFullscreen();
          break;

        // Ctrl/Cmd + D - Toggle dark/light theme
        case isCmd && key === 'd':
          event.preventDefault();
          toggleTheme();
          break;

        // Ctrl/Cmd + E - Export PDF
        case isCmd && key === 'e':
          event.preventDefault();
          // Trigger export function
          document.querySelector('[title*="Exportar relatório PDF"]')?.click();
          break;

        // Ctrl/Cmd + P - Presentation mode
        case isCmd && key === 'p':
          event.preventDefault();
          window.location.hash = '#presentation';
          break;

        // ? - Show shortcuts
        case key === '?' && !shiftKey:
          event.preventDefault();
          document.querySelector('[title*="Atalhos do teclado"]')?.click();
          break;

        // Escape - Exit fullscreen or close modals
        case key === 'Escape':
          if (document.fullscreenElement) {
            event.preventDefault();
            document.exitFullscreen();
          }
          // Close any open modals
          document.querySelector('[class*="shortcutsModal"]')?.click();
          break;

        // Arrow keys for navigation (future enhancement)
        case key === 'ArrowLeft' && isCmd:
          event.preventDefault();
          window.history.back();
          break;
        
        case key === 'ArrowRight' && isCmd:
          event.preventDefault();
          window.history.forward();
          break;

        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTheme, toggleFullscreen]);

  // Return shortcuts info for display
  const shortcuts = [
    { key: 'F11', description: 'Toggle fullscreen', action: toggleFullscreen },
    { key: 'Ctrl + D', description: 'Toggle dark/light theme', action: toggleTheme },
    { key: 'Ctrl + E', description: 'Export PDF report' },
    { key: 'Ctrl + P', description: 'Presentation mode' },
    { key: 'Esc', description: 'Exit fullscreen' },
    { key: '?', description: 'Show shortcuts' },
    { key: 'Ctrl + ←', description: 'Navigate back' },
    { key: 'Ctrl + →', description: 'Navigate forward' }
  ];

  return { shortcuts };
}