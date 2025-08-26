import { TrendingUp, TrendingDown, Activity, Users2 } from 'lucide-react';
import styles from './QuickStats.module.css';

function QuickStats() {
  const stats = [
    {
      label: 'Visitantes Online',
      value: '1,247',
      change: '+5.2%',
      trend: 'up',
      icon: Users2,
      color: 'blue'
    },
    {
      label: 'Taxa de Rejeição',
      value: '32.1%',
      change: '-2.4%',
      trend: 'down',
      icon: Activity,
      color: 'green'
    },
    {
      label: 'Tempo na Página',
      value: '3:42',
      change: '+0.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className={styles.container}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <div key={index} className={`${styles.stat} ${styles[stat.color]}`}>
            <div className={styles.statIcon}>
              <Icon size={18} />
            </div>
            
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
            
            <div className={`${styles.statTrend} ${styles[stat.trend]}`}>
              <TrendIcon size={12} />
              <span>{stat.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuickStats;