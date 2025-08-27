import { useRealCharts } from '../../hooks/useRealData';
import Chart from '../ui/Chart';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import styles from './RealChartsGrid.module.css';

function RealChartsGrid() {
  const { charts, loading, errors, refresh, refreshChart } = useRealCharts();

  const chartConfigs = {
    category: {
      title: 'Produtos por Categoria',
      subtitle: 'Distribuição do catálogo por categoria',
      type: 'pie',
      height: 350,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} produtos (${percentage}%)`;
              }
            }
          }
        }
      }
    },
    
    revenue: {
      title: 'Valor do Estoque - Últimos Meses',
      subtitle: 'Evolução do valor total em estoque',
      type: 'line',
      height: 350,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0
                }).format(value);
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(context.parsed.y)}`;
              }
            }
          }
        }
      }
    },
    
    stock: {
      title: 'Níveis de Estoque por Produto',
      subtitle: 'Top 10 produtos por quantidade em estoque',
      type: 'bar',
      height: 350,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Horizontal bars
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return Math.round(value) + ' un';
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 11
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Estoque: ${context.parsed.x} unidades`;
              }
            }
          }
        }
      }
    }
  };

  const renderChart = (chartKey, chartData, config) => {
    if (loading[chartKey]) {
      return (
        <div className={styles.chartLoading}>
          <LoadingSpinner size="medium" />
          <p>Carregando {config.title.toLowerCase()}...</p>
        </div>
      );
    }

    if (errors[chartKey]) {
      return (
        <ErrorMessage 
          message={errors[chartKey]}
          onRetry={() => refreshChart(chartKey)}
          compact
        />
      );
    }

    if (!chartData) {
      return (
        <div className={styles.chartEmpty}>
          <p>Dados não disponíveis</p>
        </div>
      );
    }

    return (
      <Chart
        type={config.type}
        data={chartData}
        options={config.options}
        height={config.height}
      />
    );
  };

  return (
    <div className={styles.chartsGrid}>
      {/* Category Chart */}
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <div className={styles.chartInfo}>
            <h3 className={styles.chartTitle}>
              {chartConfigs.category.title}
            </h3>
            <p className={styles.chartSubtitle}>
              {chartConfigs.category.subtitle}
            </p>
          </div>
          <button 
            className={styles.refreshButton}
            onClick={() => refreshChart('category')}
            disabled={loading.category}
            title="Atualizar gráfico"
          >
            🔄
          </button>
        </div>
        <div className={styles.chartContent}>
          {renderChart('category', charts.category, chartConfigs.category)}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <div className={styles.chartInfo}>
            <h3 className={styles.chartTitle}>
              {chartConfigs.revenue.title}
            </h3>
            <p className={styles.chartSubtitle}>
              {chartConfigs.revenue.subtitle}
            </p>
          </div>
          <button 
            className={styles.refreshButton}
            onClick={() => refreshChart('revenue')}
            disabled={loading.revenue}
            title="Atualizar gráfico"
          >
            🔄
          </button>
        </div>
        <div className={styles.chartContent}>
          {renderChart('revenue', charts.revenue, chartConfigs.revenue)}
        </div>
      </div>

      {/* Stock Chart */}
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <div className={styles.chartInfo}>
            <h3 className={styles.chartTitle}>
              {chartConfigs.stock.title}
            </h3>
            <p className={styles.chartSubtitle}>
              {chartConfigs.stock.subtitle}
            </p>
          </div>
          <button 
            className={styles.refreshButton}
            onClick={() => refreshChart('stock')}
            disabled={loading.stock}
            title="Atualizar gráfico"
          >
            🔄
          </button>
        </div>
        <div className={styles.chartContent}>
          {renderChart('stock', charts.stock, chartConfigs.stock)}
        </div>
      </div>

      {/* Refresh All Button */}
      <div className={styles.refreshAllContainer}>
        <button 
          className={styles.refreshAllButton}
          onClick={refresh}
          disabled={Object.values(loading).some(isLoading => isLoading)}
        >
          {Object.values(loading).some(isLoading => isLoading) ? (
            <>
              <LoadingSpinner size="small" />
              Atualizando...
            </>
          ) : (
            <>
              🔄 Atualizar Todos os Gráficos
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default RealChartsGrid;