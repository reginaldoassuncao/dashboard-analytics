import { useConversionFunnel } from '../../hooks/useSimpleData';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { formatNumber } from '../../utils/formatters';
import styles from './ConversionFunnel.module.css';

function ConversionFunnel() {
  const { data: funnelData, loading, error } = useConversionFunnel();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!funnelData) return <ErrorMessage message="Nenhum dado disponível" />;

  const maxValue = Math.max(...funnelData.map(d => d.value));

  return (
    <div className={styles.funnel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Funil de Conversão</h3>
        <p className={styles.subtitle}>
          Jornada completa do usuário até a conversão
        </p>
      </div>

      <div className={styles.container}>
        {funnelData.map((stage, index) => {
          const width = (stage.value / maxValue) * 100;
          const dropoff = index > 0 ? funnelData[index - 1].value - stage.value : 0;
          const dropoffRate = index > 0 ? ((dropoff / funnelData[index - 1].value) * 100).toFixed(1) : 0;

          return (
            <div key={stage.stage} className={styles.stage}>
              {/* Dropoff indicator (except for first stage) */}
              {index > 0 && (
                <div className={styles.dropoff}>
                  <div className={styles.dropoffLine} />
                  <div className={styles.dropoffLabel}>
                    -{formatNumber(dropoff)} ({dropoffRate}% abandono)
                  </div>
                </div>
              )}

              {/* Stage bar */}
              <div className={styles.bar}>
                <div 
                  className={styles.barFill}
                  style={{ 
                    width: `${width}%`,
                    backgroundColor: stage.color
                  }}
                >
                  <div className={styles.barContent}>
                    <div className={styles.stageInfo}>
                      <span className={styles.stageName}>{stage.stage}</span>
                      <div className={styles.stageMetrics}>
                        <span className={styles.stageValue}>
                          {formatNumber(stage.value)}
                        </span>
                        <span className={styles.stagePercentage}>
                          {stage.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Empty part of bar */}
                <div 
                  className={styles.barEmpty}
                  style={{ width: `${100 - width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary metrics */}
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Taxa de Conversão Total</span>
          <span className={styles.summaryValue}>
            {((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100).toFixed(2)}%
          </span>
        </div>
        
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Maior Perda</span>
          <span className={styles.summaryValue}>
            {(() => {
              let maxDrop = 0;
              let maxDropStage = '';
              for (let i = 1; i < funnelData.length; i++) {
                const drop = ((funnelData[i-1].value - funnelData[i].value) / funnelData[i-1].value) * 100;
                if (drop > maxDrop) {
                  maxDrop = drop;
                  maxDropStage = funnelData[i].stage;
                }
              }
              return `${maxDrop.toFixed(1)}% em ${maxDropStage}`;
            })()}
          </span>
        </div>
        
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Receita Potencial</span>
          <span className={styles.summaryValue}>
            R$ {formatNumber((funnelData[0].value - funnelData[funnelData.length - 1].value) * 154.5)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ConversionFunnel;