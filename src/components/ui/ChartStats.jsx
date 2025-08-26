import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import styles from './ChartStats.module.css';

function ChartStats() {
  const stats = [
    {
      icon: BarChart3,
      title: '4 Gráficos',
      description: 'Visualizações implementadas',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      title: 'Tempo Real',
      description: 'Dados atualizados automaticamente',
      color: 'green'
    },
    {
      icon: Users,
      title: '12 Meses',
      description: 'Dados históricos disponíveis',
      color: 'purple'
    },
    {
      icon: Target,
      title: '100%',
      description: 'Responsivo e interativo',
      color: 'orange'
    }
  ];

  return (
    <div className={styles.container}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div key={index} className={`${styles.stat} ${styles[stat.color]}`}>
            <div className={styles.iconContainer}>
              <Icon size={20} />
            </div>
            <div className={styles.content}>
              <div className={styles.title}>{stat.title}</div>
              <div className={styles.description}>{stat.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChartStats;