import { useMemo } from 'react';
import Chart from '../ui/Chart';
import { useTrafficChart } from '../../hooks/useData';
import { colorSchemes } from '../../utils/chartConfig';

function TrafficChart({ height = 350 }) {
  const { data, loading, error } = useTrafficChart();

  const chartData = useMemo(() => {
    if (!data) return null;

    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Fontes de Tráfego',
          data: data.datasets[0].data,
          backgroundColor: colorSchemes.gradient,
          borderColor: 'white',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 8
        }
      ]
    };
  }, [data]);

  const chartOptions = useMemo(() => ({
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const dataset = data.datasets[0];
              const total = dataset.data.reduce((a, b) => a + b, 0);
              
              return data.labels.map((label, i) => {
                const value = dataset.data[i];
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor,
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return [
              `${context.label}: ${percentage}%`,
              `Valor: ${context.formattedValue}`
            ];
          }
        }
      }
    },
    cutout: '40%',
    radius: '80%',
    maintainAspectRatio: false
  }), []);

  return (
    <Chart
      type="doughnut"
      data={chartData}
      options={chartOptions}
      title="Canais de Marketing"
      subtitle="Distribuição do tráfego por fonte de origem"
      loading={loading}
      error={error}
      height={height}
    />
  );
}

export default TrafficChart;