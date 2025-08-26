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