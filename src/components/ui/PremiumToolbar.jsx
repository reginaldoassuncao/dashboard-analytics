import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Moon, 
  Sun, 
  Maximize, 
  Minimize, 
  Presentation,
  Settings,
  Keyboard
} from 'lucide-react';
import styles from './PremiumToolbar.module.css';

function PremiumToolbar() {
  const { theme, isFullscreen, toggleTheme, toggleFullscreen } = useTheme();
  const [showShortcuts, setShowShortcuts] = useState(false);

  const shortcuts = [
    { key: 'F11', description: 'Toggle fullscreen' },
    { key: 'Ctrl + D', description: 'Toggle dark/light theme' },
    { key: 'Ctrl + P', description: 'Presentation mode' },
    { key: 'Esc', description: 'Exit fullscreen' },
    { key: '?', description: 'Show shortcuts' }
  ];

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarSection}>
        <span className={styles.sectionTitle}>Apresentação</span>
        
        <button 
          className={styles.toolbarButton}
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Sair do modo tela cheia (F11)' : 'Modo tela cheia (F11)'}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          <span>{isFullscreen ? 'Sair' : 'Tela Cheia'}</span>
        </button>

        <button 
          className={styles.toolbarButton}
          onClick={() => window.location.hash = '#presentation'}
          title="Modo apresentação (Ctrl + P)"
        >
          <Presentation size={18} />
          <span>Apresentar</span>
        </button>
      </div>

      <div className={styles.toolbarDivider} />

      <div className={styles.toolbarSection}>
        <span className={styles.sectionTitle}>Tema</span>
        
        <button 
          className={styles.toolbarButton}
          onClick={toggleTheme}
          title={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'} (Ctrl + D)`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === 'light' ? 'Escuro' : 'Claro'}</span>
        </button>
      </div>

      <div className={styles.toolbarDivider} />

      <div className={styles.toolbarSection}>
        <button 
          className={styles.toolbarButton}
          onClick={() => setShowShortcuts(!showShortcuts)}
          title="Atalhos do teclado (?)"
        >
          <Keyboard size={18} />
          <span>Atalhos</span>
        </button>
      </div>

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className={styles.shortcutsModal} onClick={() => setShowShortcuts(false)}>
          <div className={styles.shortcutsContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.shortcutsTitle}>Atalhos do Teclado</h3>
            
            <div className={styles.shortcutsList}>
              {shortcuts.map((shortcut, index) => (
                <div key={index} className={styles.shortcutItem}>
                  <kbd className={styles.shortcutKey}>{shortcut.key}</kbd>
                  <span className={styles.shortcutDesc}>{shortcut.description}</span>
                </div>
              ))}
            </div>
            
            <button 
              className={styles.closeButton}
              onClick={() => setShowShortcuts(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumToolbar;