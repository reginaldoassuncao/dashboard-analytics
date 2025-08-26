import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default chart options
export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter',
          size: 12,
          weight: '500'
        },
        color: '#6b7280'
      }
    },
    tooltip: {
      backgroundColor: '#111827',
      titleColor: '#f9fafb',
      bodyColor: '#f9fafb',
      borderColor: '#374151',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      padding: 12,
      titleFont: {
        family: 'Inter',
        size: 13,
        weight: '600'
      },
      bodyFont: {
        family: 'Inter',
        size: 12,
        weight: '400'
      }
    }
  },
  scales: {
    x: {
      border: {
        display: false
      },
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Inter',
          size: 11,
          weight: '400'
        },
        color: '#9ca3af',
        padding: 8
      }
    },
    y: {
      border: {
        display: false
      },
      grid: {
        color: '#f3f4f6',
        lineWidth: 1
      },
      ticks: {
        font: {
          family: 'JetBrains Mono',
          size: 11,
          weight: '400'
        },
        color: '#9ca3af',
        padding: 8,
        callback: function(value) {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K';
          }
          return value;
        }
      }
    }
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
      borderWidth: 2,
      hoverBorderWidth: 3
    },
    line: {
      borderWidth: 2,
      tension: 0.4
    },
    bar: {
      borderRadius: 4,
      borderSkipped: false
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  }
};

// Color palette
export const colors = {
  primary: '#3b82f6',
  primaryLight: '#dbeafe',
  success: '#22c55e',
  successLight: '#f0fdf4',
  warning: '#f59e0b',
  warningLight: '#fefce8',
  danger: '#ef4444',
  dangerLight: '#fef2f2',
  gray: '#6b7280',
  grayLight: '#f3f4f6'
};

// Chart color schemes
export const colorSchemes = {
  primary: [colors.primary, colors.success, colors.warning, colors.danger, '#8b5cf6'],
  gradient: [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)'
  ]
};

// Utility functions
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const createGradient = (ctx, chartArea, colorStart, colorEnd) => {
  if (!chartArea) return colorStart;
  
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, colorEnd);
  gradient.addColorStop(1, colorStart);
  return gradient;
};