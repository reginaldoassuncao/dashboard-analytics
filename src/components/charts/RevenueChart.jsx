import { useMemo } from 'react';
import Chart from '../ui/Chart';
import { useRevenueChart } from '../../hooks/useSimpleData';
import { useSimpleDateRange } from '../../contexts/SimpleDateContext';
import { colors, createGradient, formatCurrency } from '../../utils/chartConfig';

function RevenueChart({ height = 350 }) {
  const { selectedPeriod, getPeriodLabel } = useSimpleDateRange();
  const { data, loading, error } = useRevenueChart(selectedPeriod);

  const chartData = useMemo(() => {
    if (!data) return null;

    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Receita',
          data: data.datasets[0].data,
          borderColor: colors.primary,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return colors.primaryLight;
            return createGradient(ctx, chartArea, 'rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)');
          },
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.primary,
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: colors.primary,
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: 3
        },
        {
          label: 'Meta',
          data: data.datasets[1].data,
          borderColor: colors.success,
          backgroundColor: 'transparent',
          borderDash: [8, 4],
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: colors.success,
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          fill: false,
          tension: 0.2
        }
      ]
    };
  }, [data]);

  const chartOptions = useMemo(() => ({
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          padding: 20,
          generateLabels: function(chart) {
            const original = chart.constructor.defaults.plugins.legend.labels.generateLabels;
            const labels = original.call(this, chart);
            
            labels.forEach((label, i) => {
              if (i === 1) { // Meta dataset
                label.lineDash = [8, 4];
              }
            });
            
            return labels;
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = formatCurrency(context.parsed.y);
            return `${label}: ${value}`;
          },
          afterLabel: function(context) {
            if (context.datasetIndex === 0 && context.dataIndex > 0) {
              const current = context.parsed.y;
              const previous = context.dataset.data[context.dataIndex - 1];
              const change = ((current - previous) / previous * 100).toFixed(1);
              return `Variação: ${change > 0 ? '+' : ''}${change}%`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
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
      type="line"
      data={chartData}
      options={chartOptions}
      title="Receita ao Longo do Tempo"
      subtitle={`Evolução da receita - ${getPeriodLabel()}`}
      loading={loading}
      error={error}
      height={height}
    />
  );
}

export default RevenueChart;