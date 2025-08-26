import { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import { useCorrelationData } from '../../hooks/useSimpleData';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import styles from './ScatterPlot.module.css';

function ScatterPlot() {
  const { data: correlationData, loading, error } = useCorrelationData();

  const chartData = useMemo(() => {
    if (!correlationData) return null;

    return {
      datasets: [
        {
          label: 'Investimento vs Vendas',
          data: correlationData.map(item => ({
            x: item.advertising,
            y: item.sales
          })),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 0.8)',
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgba(59, 130, 246, 0.8)',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: 2
        }
      ]
    };
  }, [correlationData]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: () => 'Correlação Investimento × Vendas',
          label: (context) => [
            `Investimento: ${formatCurrency(context.parsed.x)}`,
            `Vendas: ${formatCurrency(context.parsed.y)}`,
            `ROI: ${((context.parsed.y / context.parsed.x) * 100).toFixed(1)}%`
          ]
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Investimento em Publicidade (R$)',
          font: {
            size: 12,
            weight: 600
          },
          color: 'rgba(107, 114, 128, 1)'
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 11
          },
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Vendas Geradas (R$)',
          font: {
            size: 12,
            weight: 600
          },
          color: 'rgba(107, 114, 128, 1)'
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: 'rgba(107, 114, 128, 0.8)',
          font: {
            size: 11
          },
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'point'
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  }), []);

  const statistics = useMemo(() => {
    if (!correlationData || correlationData.length === 0) return null;
    
    const n = correlationData.length;
    const sumX = correlationData.reduce((sum, item) => sum + item.advertising, 0);
    const sumY = correlationData.reduce((sum, item) => sum + item.sales, 0);
    const sumXY = correlationData.reduce((sum, item) => sum + item.advertising * item.sales, 0);
    const sumX2 = correlationData.reduce((sum, item) => sum + item.advertising * item.advertising, 0);
    const sumY2 = correlationData.reduce((sum, item) => sum + item.sales * item.sales, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    const avgROI = correlationData.reduce((sum, item) => 
      sum + (item.sales / item.advertising), 0) / n;
    
    const maxROI = Math.max(...correlationData.map(item => item.sales / item.advertising));
    const minROI = Math.min(...correlationData.map(item => item.sales / item.advertising));
    
    return {
      correlation: correlation.toFixed(3),
      avgROI: avgROI.toFixed(2),
      maxROI: maxROI.toFixed(2),
      minROI: minROI.toFixed(2),
      totalInvestment: sumX,
      totalSales: sumY
    };
  }, [correlationData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!correlationData || !chartData) return <ErrorMessage message="Nenhum dado disponível" />;

  return (
    <div className={styles.scatterPlot}>
      <div className={styles.header}>
        <h3 className={styles.title}>Análise de Correlação</h3>
        <p className={styles.subtitle}>
          Relação entre investimento em publicidade e vendas geradas
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <Scatter data={chartData} options={chartOptions} />
        </div>

        {statistics && (
          <div className={styles.statistics}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Correlação</span>
              <span className={`${styles.statValue} ${
                parseFloat(statistics.correlation) > 0.7 ? styles.positive :
                parseFloat(statistics.correlation) > 0.3 ? styles.neutral :
                styles.negative
              }`}>
                {statistics.correlation}
              </span>
              <span className={styles.statDescription}>
                {parseFloat(statistics.correlation) > 0.7 ? 'Forte correlação positiva' :
                 parseFloat(statistics.correlation) > 0.3 ? 'Correlação moderada' :
                 'Correlação fraca'}
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>ROI Médio</span>
              <span className={styles.statValue}>
                {statistics.avgROI}x
              </span>
              <span className={styles.statDescription}>
                Retorno médio do investimento
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Melhor ROI</span>
              <span className={styles.statValue}>
                {statistics.maxROI}x
              </span>
              <span className={styles.statDescription}>
                Maior retorno obtido
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Investimento Total</span>
              <span className={styles.statValue}>
                {formatCurrency(statistics.totalInvestment)}
              </span>
              <span className={styles.statDescription}>
                Soma de todos os investimentos
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Vendas Totais</span>
              <span className={styles.statValue}>
                {formatCurrency(statistics.totalSales)}
              </span>
              <span className={styles.statDescription}>
                Receita total gerada
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>ROI Total</span>
              <span className={`${styles.statValue} ${styles.positive}`}>
                {(statistics.totalSales / statistics.totalInvestment).toFixed(2)}x
              </span>
              <span className={styles.statDescription}>
                Retorno geral do período
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScatterPlot;