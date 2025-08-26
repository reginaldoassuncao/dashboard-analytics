export class DateUtils {
  static formatDate(date, format = 'yyyy-mm-dd') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    switch (format) {
      case 'yyyy-mm-dd':
        return `${year}-${month}-${day}`;
      case 'dd/mm/yyyy':
        return `${day}/${month}/${year}`;
      case 'mmm yyyy':
        return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      case 'mmmm yyyy':
        return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      default:
        return d.toISOString().split('T')[0];
    }
  }

  static getDateRange(days) {
    const dates = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(new Date(date));
    }
    
    return dates;
  }

  static getMonthRange(months) {
    const dates = [];
    const today = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      dates.push(date);
    }
    
    return dates;
  }

  static getLastNDays(n) {
    return this.getDateRange(n).map(date => this.formatDate(date));
  }

  static getLastNMonths(n) {
    return this.getMonthRange(n).map(date => this.formatDate(date, 'mmm yyyy'));
  }

  static getPeriodLabel(period) {
    const periods = {
      '7d': 'Últimos 7 dias',
      '30d': 'Últimos 30 dias',
      '90d': 'Últimos 90 dias',
      '1y': 'Último ano',
      'custom': 'Período personalizado'
    };
    
    return periods[period] || period;
  }

  static getQuarters() {
    const currentYear = new Date().getFullYear();
    return [
      { label: 'Q1 2024', start: new Date(currentYear, 0, 1), end: new Date(currentYear, 2, 31) },
      { label: 'Q2 2024', start: new Date(currentYear, 3, 1), end: new Date(currentYear, 5, 30) },
      { label: 'Q3 2024', start: new Date(currentYear, 6, 1), end: new Date(currentYear, 8, 30) },
      { label: 'Q4 2024', start: new Date(currentYear, 9, 1), end: new Date(currentYear, 11, 31) }
    ];
  }

  static isWeekend(date) {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  }

  static getBusinessDays(startDate, endDate) {
    const businessDays = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      if (!this.isWeekend(current)) {
        businessDays.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    
    return businessDays;
  }

  static getDayOfWeekMultiplier(date) {
    const day = new Date(date).getDay();
    const multipliers = {
      0: 0.7, // domingo
      1: 1.0, // segunda
      2: 1.1, // terça
      3: 1.2, // quarta
      4: 1.3, // quinta
      5: 1.4, // sexta
      6: 1.1  // sábado
    };
    return multipliers[day] || 1.0;
  }
}