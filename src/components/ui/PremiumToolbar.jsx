import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Moon, 
  Sun, 
  Maximize, 
  Minimize, 
  Download, 
  Presentation,
  Settings,
  Keyboard
} from 'lucide-react';
import styles from './PremiumToolbar.module.css';

function PremiumToolbar() {
  const { theme, isFullscreen, toggleTheme, toggleFullscreen } = useTheme();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    // Simulate PDF export with progress
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a fake download
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKERhc2hib2FyZCBBbmFseXRpY3MgUmVwb3J0KQovQ3JlYXRvciAoRGFzaGJvYXJkIEFuYWx5dGljcykKL1Byb2R1Y2VyIChDbGF1ZGUgQ29kZSkKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDgyNjAwMDAwMFopCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0tpZHMgWzQgMCBSXQovQ291bnQgMQo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCj4+CmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDE3NCAwMDAwMCBuIAowMDAwMDAwMjI5IDAwMDAwIG4gCjAwMDAwMDAyODYgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA1Ci9Sb290IDIgMCBSCi9JbmZvIDEgMCBSCj4+CnN0YXJ0eHJlZgozNjUKJSVFT0Y=';
    link.download = `dashboard-analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
  };

  const shortcuts = [
    { key: 'F11', description: 'Toggle fullscreen' },
    { key: 'Ctrl + D', description: 'Toggle dark/light theme' },
    { key: 'Ctrl + E', description: 'Export PDF report' },
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
        <span className={styles.sectionTitle}>Exportar</span>
        
        <button 
          className={styles.toolbarButton}
          onClick={handleExportPDF}
          disabled={isExporting}
          title="Exportar relatório PDF (Ctrl + E)"
        >
          <Download size={18} />
          <span>{isExporting ? 'Exportando...' : 'PDF'}</span>
          {isExporting && <div className={styles.loadingSpinner} />}
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