import { DataGenerator } from '../utils/dataGenerator.js';
import { DateUtils } from '../utils/dateUtils.js';

export class DataService {
  constructor() {
    this.generator = new DataGenerator(42);
    this.cache = new Map();
    this.cacheExpiry = new Map();
  }

  getFromCache(key) {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  setCache(key, data, ttl = 300000) { // 5 min default
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + ttl);
  }

  async simulateApiDelay(min = 200, max = 800) {
    const delay = this.generator.randomInt(min, max);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  async getDashboardKPIs(period = '30d') {
    const cacheKey = `kpis-${period}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const metrics = this.generator.generateBusinessMetrics(2400000, 12);
    const currentMonth = metrics.revenue.slice(-1)[0];
    const previousMonth = metrics.revenue.slice(-2, -1)[0];
    
    const kpis = {
      revenue: {
        current: currentMonth,
        previous: previousMonth,
        change: ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1),
        trend: currentMonth > previousMonth ? 'up' : 'down'
      },
      orders: {
        current: metrics.orders.slice(-1)[0],
        previous: metrics.orders.slice(-2, -1)[0],
        change: ((metrics.orders.slice(-1)[0] - metrics.orders.slice(-2, -1)[0]) / metrics.orders.slice(-2, -1)[0] * 100).toFixed(1),
        trend: metrics.orders.slice(-1)[0] > metrics.orders.slice(-2, -1)[0] ? 'up' : 'down'
      },
      users: {
        current: metrics.users.slice(-1)[0],
        previous: metrics.users.slice(-2, -1)[0],
        change: ((metrics.users.slice(-1)[0] - metrics.users.slice(-2, -1)[0]) / metrics.users.slice(-2, -1)[0] * 100).toFixed(1),
        trend: metrics.users.slice(-1)[0] > metrics.users.slice(-2, -1)[0] ? 'up' : 'down'
      },
      conversionRate: {
        current: metrics.conversionRate.slice(-1)[0],
        previous: metrics.conversionRate.slice(-2, -1)[0],
        change: ((metrics.conversionRate.slice(-1)[0] - metrics.conversionRate.slice(-2, -1)[0]) / metrics.conversionRate.slice(-2, -1)[0] * 100).toFixed(1),
        trend: metrics.conversionRate.slice(-1)[0] > metrics.conversionRate.slice(-2, -1)[0] ? 'up' : 'down'
      },
      averageOrder: {
        current: metrics.averageOrder.slice(-1)[0],
        previous: metrics.averageOrder.slice(-2, -1)[0],
        change: ((metrics.averageOrder.slice(-1)[0] - metrics.averageOrder.slice(-2, -1)[0]) / metrics.averageOrder.slice(-2, -1)[0] * 100).toFixed(1),
        trend: metrics.averageOrder.slice(-1)[0] > metrics.averageOrder.slice(-2, -1)[0] ? 'up' : 'down'
      },
      customerLifetimeValue: {
        current: metrics.customerLifetimeValue.slice(-1)[0],
        previous: metrics.customerLifetimeValue.slice(-2, -1)[0],
        change: ((metrics.customerLifetimeValue.slice(-1)[0] - metrics.customerLifetimeValue.slice(-2, -1)[0]) / metrics.customerLifetimeValue.slice(-2, -1)[0] * 100).toFixed(1),
        trend: metrics.customerLifetimeValue.slice(-1)[0] > metrics.customerLifetimeValue.slice(-2, -1)[0] ? 'up' : 'down'
      }
    };

    this.setCache(cacheKey, kpis);
    return kpis;
  }

  async getRevenueChart(period = '12m') {
    const cacheKey = `revenue-chart-${period}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const months = period === '12m' ? 12 : 6;
    const metrics = this.generator.generateBusinessMetrics(2000000, months);
    const labels = DateUtils.getLastNMonths(months);

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Receita',
          data: metrics.revenue,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Meta',
          data: metrics.revenue.map(val => val * 1.15),
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderDash: [5, 5]
        }
      ]
    };

    this.setCache(cacheKey, chartData);
    return chartData;
  }

  async getCategoryChart() {
    const cacheKey = 'category-chart';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const categories = this.generator.generateCategoryData();
    
    const chartData = {
      labels: categories.map(cat => cat.name),
      datasets: [{
        label: 'Vendas por Categoria',
        data: categories.map(cat => cat.share),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };

    this.setCache(cacheKey, chartData);
    return chartData;
  }

  async getTrafficChart() {
    const cacheKey = 'traffic-chart';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const channels = this.generator.generateTrafficChannels();
    
    const chartData = {
      labels: channels.map(ch => ch.name),
      datasets: [{
        label: 'Fontes de Tráfego',
        data: channels.map(ch => ch.share),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ]
      }]
    };

    this.setCache(cacheKey, chartData);
    return chartData;
  }

  async getDailyActiveUsers(days = 30) {
    const cacheKey = `daily-users-${days}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const dates = DateUtils.getLastNDays(days);
    const baseUsers = 12000;
    
    const userData = dates.map(date => {
      const dayMultiplier = DateUtils.getDayOfWeekMultiplier(date);
      const randomFactor = this.generator.randomFloat(0.85, 1.15);
      return Math.round(baseUsers * dayMultiplier * randomFactor);
    });

    const chartData = {
      labels: dates,
      datasets: [{
        label: 'Usuários Ativos',
        data: userData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };

    this.setCache(cacheKey, chartData);
    return chartData;
  }

  async getTopProducts(limit = 10) {
    const cacheKey = `top-products-${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const products = this.generator.generateProductData(100);
    const topProducts = products.slice(0, limit);

    this.setCache(cacheKey, topProducts);
    return topProducts;
  }

  async getRecentUsers(limit = 20) {
    const cacheKey = `recent-users-${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const users = this.generator.generateUserData(1000);
    const recentUsers = users
      .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
      .slice(0, limit);

    this.setCache(cacheKey, recentUsers);
    return recentUsers;
  }

  async getActivityHeatmap(period = '7d') {
    const cacheKey = `activity-heatmap-${period}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const days = period === '7d' ? 7 : period === '30d' ? 30 : 7;
    const hours = 24;
    
    const heatmapData = [];
    for (let day = 0; day < days; day++) {
      for (let hour = 0; hour < hours; hour++) {
        const baseActivity = Math.sin((hour - 12) * Math.PI / 12) * 0.5 + 0.5;
        const weekdayMultiplier = (day % 7 < 5) ? 1.2 : 0.7; // Weekdays vs weekends
        const noise = this.generator.randomFloat(0.7, 1.3);
        const activity = Math.max(0, baseActivity * weekdayMultiplier * noise);
        
        heatmapData.push({
          day: day,
          hour: hour,
          activity: Math.round(activity * 100),
          date: DateUtils.subtractDays(new Date(), days - day - 1),
          dayName: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day % 7]
        });
      }
    }

    this.setCache(cacheKey, heatmapData);
    return heatmapData;
  }

  async getConversionFunnel() {
    const cacheKey = 'conversion-funnel';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const funnelData = [
      { stage: 'Visitantes', value: 10000, percentage: 100, color: '#3b82f6' },
      { stage: 'Visualizações de Produto', value: 4500, percentage: 45, color: '#06b6d4' },
      { stage: 'Adicionaram ao Carrinho', value: 1800, percentage: 18, color: '#10b981' },
      { stage: 'Iniciaram Checkout', value: 900, percentage: 9, color: '#f59e0b' },
      { stage: 'Concluíram Compra', value: 320, percentage: 3.2, color: '#22c55e' }
    ];

    this.setCache(cacheKey, funnelData);
    return funnelData;
  }

  async getCorrelationData() {
    const cacheKey = 'correlation-data';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const correlationData = Array.from({ length: 50 }, () => ({
      advertising: this.generator.randomFloat(1000, 10000),
      sales: this.generator.randomFloat(5000, 50000),
      sessions: this.generator.randomFloat(100, 1000),
      date: DateUtils.subtractDays(new Date(), this.generator.randomInt(0, 365))
    })).map(item => ({
      ...item,
      sales: item.advertising * this.generator.randomFloat(3, 7) + this.generator.randomFloat(-5000, 5000)
    }));

    this.setCache(cacheKey, correlationData);
    return correlationData;
  }

  async getGeographicData() {
    const cacheKey = 'geographic-data';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const states = [
      { name: 'São Paulo', code: 'SP', sales: 2847392, users: 12543, color: '#dc2626' },
      { name: 'Rio de Janeiro', code: 'RJ', sales: 1456789, users: 8932, color: '#ea580c' },
      { name: 'Minas Gerais', code: 'MG', sales: 987654, users: 6543, color: '#d97706' },
      { name: 'Rio Grande do Sul', code: 'RS', sales: 765432, users: 4987, color: '#ca8a04' },
      { name: 'Paraná', code: 'PR', sales: 654321, users: 3654, color: '#65a30d' },
      { name: 'Santa Catarina', code: 'SC', sales: 543210, users: 2987, color: '#16a34a' },
      { name: 'Bahia', code: 'BA', sales: 432109, users: 2543, color: '#059669' },
      { name: 'Goiás', code: 'GO', sales: 321098, users: 1987, color: '#0d9488' },
      { name: 'Pernambuco', code: 'PE', sales: 210987, users: 1543, color: '#0891b2' },
      { name: 'Ceará', code: 'CE', sales: 198765, users: 1234, color: '#0284c7' }
    ];

    this.setCache(cacheKey, states);
    return states;
  }

  async getCohortAnalysis() {
    const cacheKey = 'cohort-analysis';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const cohortData = [];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    months.forEach((month, monthIndex) => {
      const cohortMonth = {
        cohort: month,
        size: 1000 - monthIndex * 50,
        data: []
      };
      
      for (let period = 0; period <= 5 - monthIndex; period++) {
        const retention = Math.max(
          0.1, 
          1 - (period * 0.15) - (monthIndex * 0.02) + this.generator.randomFloat(-0.1, 0.1)
        );
        cohortMonth.data.push({
          period,
          retention: Math.round(retention * 100),
          users: Math.round(cohortMonth.size * retention)
        });
      }
      
      cohortData.push(cohortMonth);
    });

    this.setCache(cacheKey, cohortData);
    return cohortData;
  }

  async getAnalyticsData() {
    const cacheKey = 'analytics-data';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const data = {
      pageViews: this.generator.generateTrend(1500000, 3.2, 50000, 12),
      sessions: this.generator.generateTrend(450000, 2.8, 15000, 12),
      bounceRate: Array.from({ length: 12 }, () => 
        this.generator.randomFloat(35, 65)
      ).map(rate => parseFloat(rate.toFixed(1))),
      avgSessionDuration: Array.from({ length: 12 }, () => 
        this.generator.randomFloat(180, 420)
      ).map(duration => Math.round(duration))
    };

    this.setCache(cacheKey, data);
    return data;
  }

  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

export const dataService = new DataService();