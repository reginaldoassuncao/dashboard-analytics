import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { useDateRange, COMPARISON_OPTIONS } from '../../contexts/DateRangeContext';
import styles from './ComparisonBadge.module.css';

function ComparisonBadge() {
  const { 
    compareMode, 
    comparePeriod, 
    getPeriodLabel, 
    getComparisonDateRange 
  } = useDateRange();

  if (!compareMode) return null;

  const comparisonData = getComparisonDateRange();
  const comparisonOption = COMPARISON_OPTIONS.find(opt => opt.key === comparePeriod);
  
  // Simulate some comparison metrics
  const metrics = [
    { label: 'Receita', change: 12.5, icon: TrendingUp },
    { label: 'Usuários', change: -3.2, icon: TrendingDown },
    { label: 'Conversão', change: 0.0, icon: Minus }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <Calendar size={16} />
        </div>
        <div className={styles.title}>
          <span className={styles.titleText}>Comparação Ativa</span>
          <span className={styles.subtitle}>
            {comparisonOption?.label}
          </span>
        </div>
      </div>

      <div className={styles.metrics}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          const isNegative = metric.change < 0;
          
          return (
            <div key={index} className={styles.metric}>
              <div className={styles.metricIcon}>
                <Icon 
                  size={12} 
                  className={`${styles.trendIcon} ${
                    isPositive ? styles.positive : 
                    isNegative ? styles.negative : styles.neutral
                  }`}
                />
              </div>
              <span className={styles.metricLabel}>{metric.label}</span>
              <span 
                className={`${styles.metricChange} ${
                  isPositive ? styles.positive : 
                  isNegative ? styles.negative : styles.neutral
                }`}
              >
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.periods}>
        <div className={styles.period}>
          <span className={styles.periodLabel}>Atual:</span>
          <span className={styles.periodValue}>{getPeriodLabel()}</span>
        </div>
        <div className={styles.period}>
          <span className={styles.periodLabel}>Comparando:</span>
          <span className={styles.periodValue}>
            {new Intl.DateTimeFormat('pt-BR', { 
              day: '2-digit', 
              month: '2-digit' 
            }).format(comparisonData.startDate)} - {
            new Intl.DateTimeFormat('pt-BR', { 
              day: '2-digit', 
              month: '2-digit' 
            }).format(comparisonData.endDate)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ComparisonBadge;