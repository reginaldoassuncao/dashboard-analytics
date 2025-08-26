export function formatCurrency(value, compact = false) {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  const number = Number(value);
  if (isNaN(number)) return 'R$ 0,00';
  
  if (compact) {
    if (number >= 1000000) {
      return `R$ ${(number / 1000000).toFixed(1)}M`;
    }
    if (number >= 1000) {
      return `R$ ${(number / 1000).toFixed(1)}K`;
    }
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(number);
}

export function formatNumber(value, compact = false) {
  if (value === null || value === undefined) return '0';
  
  const number = Number(value);
  if (isNaN(number)) return '0';
  
  if (compact) {
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
  }
  
  return new Intl.NumberFormat('pt-BR').format(number);
}

export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined) return '0%';
  
  const number = Number(value);
  if (isNaN(number)) return '0%';
  
  return `${number.toFixed(decimals)}%`;
}

export function formatDate(date, format = 'short') {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' }
  };
  
  return new Intl.DateTimeFormat('pt-BR', options[format] || options.short).format(dateObj);
}

export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}