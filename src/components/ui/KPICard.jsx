import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import styles from './KPICard.module.css';

function KPICard({ 
  title, 
  value, 
  previousValue,
  change, 
  trend, 
  icon: Icon, 
  prefix = '', 
  suffix = '',
  decimals = 0,
  loading = false,
  className = ''
}) {
  const { value: animatedValue, isAnimating } = useCountUp(loading ? 0 : value, {
    duration: 1500,
    decimals,
    prefix,
    suffix,
    separator: true
  });

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} />;
      case 'down':
        return <TrendingDown size={16} />;
      default:
        return <Minus size={16} />;
    }
  };

  const getTrendClass = () => {
    switch (trend) {
      case 'up':
        return styles.trendUp;
      case 'down':
        return styles.trendDown;
      default:
        return styles.trendNeutral;
    }
  };

  if (loading) {
    return (
      <div className={`${styles.card} ${styles.loading} ${className}`}>
        <div className={styles.header}>
          <div className={styles.titleSkeleton}></div>
          <div className={styles.iconSkeleton}></div>
        </div>
        <div className={styles.content}>
          <div className={styles.valueSkeleton}></div>
          <div className={styles.changeSkeleton}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {Icon && (
          <div className={styles.iconContainer}>
            <Icon size={24} className={styles.icon} />
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={`${styles.value} ${isAnimating ? styles.animating : ''}`}>
          {animatedValue}
        </div>
        
        {change !== undefined && (
          <div className={`${styles.change} ${getTrendClass()}`}>
            <span className={styles.trendIcon}>
              {getTrendIcon()}
            </span>
            <span className={styles.changeValue}>
              {Math.abs(parseFloat(change))}%
            </span>
            <span className={styles.changeLabel}>vs período anterior</span>
          </div>
        )}
      </div>

      <div className={styles.sparkline}></div>
    </div>
  );
}

export default KPICard;