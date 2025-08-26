import { useRef, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { defaultOptions } from '../../utils/chartConfig';
import styles from './Chart.module.css';

function Chart({ 
  type = 'line', 
  data, 
  options = {}, 
  title,
  subtitle,
  loading = false,
  error = null,
  height = 300,
  className = ''
}) {
  const chartRef = useRef(null);

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins
    },
    scales: {
      ...defaultOptions.scales,
      ...options.scales
    }
  };

  const getChartComponent = () => {
    switch (type) {
      case 'bar':
        return Bar;
      case 'pie':
        return Pie;
      case 'doughnut':
        return Doughnut;
      case 'line':
      default:
        return Line;
    }
  };

  const ChartComponent = getChartComponent();

  if (loading) {
    return (
      <div className={`${styles.container} ${className}`}>
        {(title || subtitle) && (
          <div className={styles.header}>
            {title && <div className={styles.titleSkeleton}></div>}
            {subtitle && <div className={styles.subtitleSkeleton}></div>}
          </div>
        )}
        <div className={styles.chartContainer} style={{ height }}>
          <div className={styles.chartSkeleton}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Carregando gráfico...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        {(title || subtitle) && (
          <div className={styles.header}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        )}
        <div className={styles.chartContainer} style={{ height }}>
          <div className={styles.error}>
            <p>❌ Erro ao carregar gráfico</p>
            <small>{error.message}</small>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        {(title || subtitle) && (
          <div className={styles.header}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        )}
        <div className={styles.chartContainer} style={{ height }}>
          <div className={styles.empty}>
            <p>📊 Nenhum dado disponível</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      
      <div className={styles.chartContainer} style={{ height }}>
        <ChartComponent 
          ref={chartRef}
          data={data} 
          options={mergedOptions}
        />
      </div>
    </div>
  );
}

export default Chart;