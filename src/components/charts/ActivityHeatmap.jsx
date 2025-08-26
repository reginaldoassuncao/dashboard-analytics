import { useMemo } from 'react';
import { useActivityHeatmap } from '../../hooks/useSimpleData';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import styles from './ActivityHeatmap.module.css';

function ActivityHeatmap({ period = '7d' }) {
  const { data: heatmapData, loading, error } = useActivityHeatmap(period);

  const processedData = useMemo(() => {
    if (!heatmapData) return { grid: [], maxActivity: 0, days: [] };
    
    const maxActivity = Math.max(...heatmapData.map(d => d.activity));
    const days = [...new Set(heatmapData.map(d => d.dayName))];
    
    const grid = Array.from({ length: 24 }, (_, hour) => {
      return days.map(dayName => {
        const dataPoint = heatmapData.find(d => d.hour === hour && d.dayName === dayName);
        return {
          hour,
          dayName,
          activity: dataPoint?.activity || 0,
          intensity: dataPoint ? dataPoint.activity / maxActivity : 0
        };
      });
    });
    
    return { grid, maxActivity, days };
  }, [heatmapData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!heatmapData) return <ErrorMessage message="Nenhum dado disponível" />;

  const hours = Array.from({ length: 24 }, (_, i) => `${i}h`);

  return (
    <div className={styles.heatmap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Heatmap de Atividade</h3>
        <p className={styles.subtitle}>
          Padrão de atividade dos usuários por hora e dia ({period === '7d' ? '7 dias' : '30 dias'})
        </p>
      </div>

      <div className={styles.container}>
        {/* Y-axis labels (hours) */}
        <div className={styles.yAxis}>
          {hours.map(hour => (
            <div key={hour} className={styles.yLabel}>
              {hour}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className={styles.grid}>
          {/* X-axis labels (days) */}
          <div className={styles.xAxis}>
            {processedData.days.map(day => (
              <div key={day} className={styles.xLabel}>
                {day}
              </div>
            ))}
          </div>

          {/* Grid cells */}
          <div className={styles.cells}>
            {processedData.grid.map((hourRow, hourIndex) => (
              <div key={hourIndex} className={styles.row}>
                {hourRow.map((cell, dayIndex) => (
                  <div
                    key={`${hourIndex}-${dayIndex}`}
                    className={styles.cell}
                    style={{
                      '--intensity': cell.intensity,
                      backgroundColor: `rgba(59, 130, 246, ${cell.intensity * 0.8 + 0.1})`
                    }}
                    title={`${cell.dayName} ${cell.hour}h - ${cell.activity}% atividade`}
                  >
                    <span className={styles.cellValue}>
                      {cell.activity}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <span className={styles.legendLabel}>Baixa</span>
          <div className={styles.legendGradient}>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={styles.legendStep}
                style={{
                  backgroundColor: `rgba(59, 130, 246, ${(i + 1) * 0.2})`
                }}
              />
            ))}
          </div>
          <span className={styles.legendLabel}>Alta</span>
        </div>
      </div>
    </div>
  );
}

export default ActivityHeatmap;