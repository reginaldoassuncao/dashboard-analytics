import { useMemo } from 'react';
import Chart from '../ui/Chart';
import { useCategoryChart } from '../../hooks/useData';
import { colorSchemes, formatNumber } from '../../utils/chartConfig';

function CategoryChart({ height = 350 }) {
  const { data, loading, error } = useCategoryChart();

  const chartData = useMemo(() => {
    if (!data) return null;

    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Vendas por Categoria',
          data: data.datasets[0].data,
          backgroundColor: colorSchemes.gradient,
          borderColor: colorSchemes.primary,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: colorSchemes.primary,
          hoverBorderColor: 'white',
          hoverBorderWidth: 2
        }
      ]
    };
  }, [data]);

  const chartOptions = useMemo(() => ({
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
            return [
              `Categoria: ${context.label}`,
              `Participação: ${percentage}%`,
              `Valor: ${formatNumber(context.parsed.y)}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }), []);

  return (
    <Chart
      type="bar"
      data={chartData}
      options={chartOptions}
      title="Vendas por Categoria"
      subtitle="Distribuição das vendas entre as principais categorias de produtos"
      loading={loading}
      error={error}
      height={height}
    />
  );
}

export default CategoryChart;