import { useMemo } from 'react';
import Chart from '../ui/Chart';
import { useDailyUsers } from '../../hooks/useData';
import { colors, createGradient, formatNumber } from '../../utils/chartConfig';

function UsersChart({ days = 30, height = 350 }) {
  const { data, loading, error } = useDailyUsers(days);

  const chartData = useMemo(() => {
    if (!data) return null;

    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Usuários Ativos',
          data: data.datasets[0].data,
          borderColor: colors.success,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(34, 197, 94, 0.1)';
            return createGradient(ctx, chartArea, 'rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 0.02)');
          },
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.success,
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: colors.success,
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: 3,
          borderWidth: 2
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
            const value = formatNumber(context.parsed.y);
            return `Usuários Ativos: ${value}`;
          },
          afterLabel: function(context) {
            if (context.dataIndex > 0) {
              const current = context.parsed.y;
              const previous = context.dataset.data[context.dataIndex - 1];
              const change = current - previous;
              const changePercent = ((change / previous) * 100).toFixed(1);
              
              return [
                `Variação: ${change > 0 ? '+' : ''}${formatNumber(change)}`,
                `Percentual: ${change > 0 ? '+' : ''}${changePercent}%`
              ];
            }
            return '';
          },
          title: function(context) {
            const date = new Date(context[0].label);
            return date.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: '2-digit', 
              month: '2-digit' 
            });
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
          callback: function(value, index, values) {
            if (days <= 7) {
              const date = new Date(this.getLabelForValue(value));
              return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            } else {
              if (index % Math.ceil(values.length / 6) === 0) {
                const date = new Date(this.getLabelForValue(value));
                return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
              }
            }
            return '';
          }
        }
      },
      y: {
        beginAtZero: false,
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
  }), [days]);

  return (
    <Chart
      type="line"
      data={chartData}
      options={chartOptions}
      title="Usuários Ativos Diários"
      subtitle={`Evolução dos usuários ativos nos últimos ${days} dias`}
      loading={loading}
      error={error}
      height={height}
    />
  );
}

export default UsersChart;