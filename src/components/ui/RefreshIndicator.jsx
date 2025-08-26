import { useState, useEffect } from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import styles from './RefreshIndicator.module.css';

function RefreshIndicator({ 
  isRefreshing = false, 
  lastUpdate = null, 
  onRefresh = () => {},
  autoRefresh = true,
  interval = 60000 // 1 minute
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [timeAgo, setTimeAgo] = useState('agora');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!lastUpdate) return;

    const updateTimeAgo = () => {
      const now = Date.now();
      const diff = now - lastUpdate;
      
      if (diff < 60000) {
        setTimeAgo('agora mesmo');
      } else if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        setTimeAgo(`${minutes}min atrás`);
      } else {
        const hours = Math.floor(diff / 3600000);
        setTimeAgo(`${hours}h atrás`);
      }
    };

    updateTimeAgo();
    const timer = setInterval(updateTimeAgo, 30000);

    return () => clearInterval(timer);
  }, [lastUpdate]);

  useEffect(() => {
    if (!autoRefresh || !isOnline || isRefreshing) return;

    const timer = setInterval(() => {
      if (!isRefreshing) {
        onRefresh();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [autoRefresh, isOnline, interval, onRefresh, isRefreshing]);

  return (
    <div className={styles.indicator}>
      <div className={styles.status}>
        <div className={`${styles.statusIcon} ${isOnline ? styles.online : styles.offline}`}>
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
        </div>
        <span className={styles.statusText}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className={styles.lastUpdate}>
        Atualizado {timeAgo}
      </div>

      <button 
        className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ''}`}
        onClick={onRefresh}
        disabled={isRefreshing || !isOnline}
        title="Atualizar dados"
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
}

export default RefreshIndicator;