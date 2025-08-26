import { useCohortAnalysis } from '../../hooks/useSimpleData';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { formatNumber } from '../../utils/formatters';
import styles from './CohortAnalysis.module.css';

function CohortAnalysis() {
  const { data: cohortData, loading, error } = useCohortAnalysis();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!cohortData) return <ErrorMessage message="Nenhum dado disponível" />;

  const maxPeriods = Math.max(...cohortData.map(cohort => cohort.data.length));
  const periods = Array.from({ length: maxPeriods }, (_, i) => `P${i}`);

  const getRetentionColor = (retention) => {
    if (retention >= 70) return '#22c55e'; // green
    if (retention >= 50) return '#eab308'; // yellow  
    if (retention >= 30) return '#f59e0b'; // orange
    if (retention >= 15) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  const averageRetention = periods.map(period => {
    const periodIndex = parseInt(period.slice(1));
    const validCohorts = cohortData.filter(cohort => cohort.data[periodIndex]);
    
    if (validCohorts.length === 0) return 0;
    
    const avgRetention = validCohorts.reduce((sum, cohort) => 
      sum + cohort.data[periodIndex].retention, 0) / validCohorts.length;
    
    return Math.round(avgRetention);
  });

  return (
    <div className={styles.cohortAnalysis}>
      <div className={styles.header}>
        <h3 className={styles.title}>Análise de Coorte</h3>
        <p className={styles.subtitle}>
          Retenção de usuários por mês de aquisição (primeiros 6 meses)
        </p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.cohortTable}>
          <thead>
            <tr>
              <th className={styles.cohortHeader}>Coorte</th>
              <th className={styles.sizeHeader}>Tamanho</th>
              {periods.map(period => (
                <th key={period} className={styles.periodHeader}>
                  {period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohortData.map((cohort, cohortIndex) => (
              <tr key={cohort.cohort} className={styles.cohortRow}>
                <td className={styles.cohortCell}>
                  <div className={styles.cohortInfo}>
                    <span className={styles.cohortMonth}>{cohort.cohort}</span>
                    <span className={styles.cohortLabel}>2024</span>
                  </div>
                </td>
                
                <td className={styles.sizeCell}>
                  {formatNumber(cohort.size)}
                </td>

                {periods.map((period, periodIndex) => {
                  const dataPoint = cohort.data[periodIndex];
                  
                  if (!dataPoint) {
                    return (
                      <td key={period} className={styles.emptyCell}>
                        <span className={styles.emptyIndicator}>-</span>
                      </td>
                    );
                  }

                  return (
                    <td key={period} className={styles.dataCell}>
                      <div 
                        className={styles.retentionCell}
                        style={{
                          backgroundColor: getRetentionColor(dataPoint.retention),
                          '--retention': dataPoint.retention
                        }}
                      >
                        <span className={styles.retentionValue}>
                          {dataPoint.retention}%
                        </span>
                        <span className={styles.userCount}>
                          ({formatNumber(dataPoint.users)})
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Average row */}
            <tr className={styles.averageRow}>
              <td className={styles.averageLabel} colSpan={2}>
                <span className={styles.averageText}>Média Geral</span>
              </td>
              {averageRetention.map((avgRetention, index) => (
                <td key={`avg-${index}`} className={styles.averageCell}>
                  <div 
                    className={styles.averageValue}
                    style={{
                      backgroundColor: getRetentionColor(avgRetention),
                      '--retention': avgRetention
                    }}
                  >
                    {avgRetention}%
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className={styles.insights}>
        <div className={styles.insightCard}>
          <span className={styles.insightLabel}>Retenção P0 (Primeiro Mês)</span>
          <span className={styles.insightValue}>
            {averageRetention[0]}%
          </span>
          <span className={styles.insightDescription}>
            Usuários que retornaram no primeiro mês
          </span>
        </div>

        <div className={styles.insightCard}>
          <span className={styles.insightLabel}>Retenção P3 (Após 3 Meses)</span>
          <span className={styles.insightValue}>
            {averageRetention[3] || 'N/A'}%
          </span>
          <span className={styles.insightDescription}>
            Usuários que permaneceram ativos após 3 meses
          </span>
        </div>

        <div className={styles.insightCard}>
          <span className={styles.insightLabel}>Melhor Coorte</span>
          <span className={styles.insightValue}>
            {cohortData[0]?.cohort}
          </span>
          <span className={styles.insightDescription}>
            Coorte com maior retenção inicial
          </span>
        </div>

        <div className={styles.insightCard}>
          <span className={styles.insightLabel}>Taxa de Declínio</span>
          <span className={styles.insightValue}>
            {averageRetention[0] && averageRetention[1] ? 
              `${(averageRetention[0] - averageRetention[1]).toFixed(1)}pp` : 
              'N/A'}
          </span>
          <span className={styles.insightDescription}>
            Queda média entre P0 e P1
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendTitle}>Legenda de Retenção:</span>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{backgroundColor: '#22c55e'}} />
            <span>≥70% Excelente</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{backgroundColor: '#eab308'}} />
            <span>50-69% Boa</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{backgroundColor: '#f59e0b'}} />
            <span>30-49% Média</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{backgroundColor: '#ef4444'}} />
            <span>15-29% Baixa</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{backgroundColor: '#6b7280'}} />
            <span>&lt;15% Crítica</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CohortAnalysis;