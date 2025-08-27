// Real Data Service - Connects dashboard to actual product data
// Provides real analytics based on products stored in localStorage

import { productsService } from './productsService';

class RealDataService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = new Map();
  }

  // Cache management
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

  // Simulate API delay for consistent UX
  async simulateApiDelay(min = 200, max = 600) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Get all products from localStorage
  async getAllProducts() {
    try {
      return await productsService.getAllProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Calculate real KPIs from product data
  async getRealKPIs() {
    const cacheKey = 'real-kpis';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const products = await this.getAllProducts();
    
    if (products.length === 0) {
      // Return default KPIs if no products exist
      const defaultKPIs = {
        revenue: { current: 0, previous: 0, change: '0.0', trend: 'neutral' },
        orders: { current: 0, previous: 0, change: '0.0', trend: 'neutral' },
        products: { current: 0, previous: 0, change: '0.0', trend: 'neutral' },
        categories: { current: 0, previous: 0, change: '0.0', trend: 'neutral' },
        averagePrice: { current: 0, previous: 0, change: '0.0', trend: 'neutral' },
        lowStock: { current: 0, previous: 0, change: '0.0', trend: 'neutral' }
      };
      
      this.setCache(cacheKey, defaultKPIs);
      return defaultKPIs;
    }

    // Calculate current metrics
    const activeProducts = products.filter(p => p.status === 'active');
    const totalProducts = products.length;
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const categories = [...new Set(products.map(p => p.category))].length;
    const averagePrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
    
    // Simulate previous period data (for demo purposes, we'll use slight variations)
    // In a real app, this would come from historical data
    const generatePreviousPeriod = (current, minVariation = -20, maxVariation = 15) => {
      const variation = Math.random() * (maxVariation - minVariation) + minVariation;
      return Math.max(0, Math.round(current * (1 - variation / 100)));
    };

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? '100.0' : '0.0';
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    const getTrend = (current, previous) => {
      if (current > previous) return 'up';
      if (current < previous) return 'down';
      return 'neutral';
    };

    const kpis = {
      revenue: {
        current: totalRevenue,
        previous: generatePreviousPeriod(totalRevenue, -15, 25),
        get change() { return calculateChange(this.current, this.previous); },
        get trend() { return getTrend(this.current, this.previous); }
      },
      orders: {
        current: totalStock, // Using stock as proxy for orders
        previous: generatePreviousPeriod(totalStock, -10, 20),
        get change() { return calculateChange(this.current, this.previous); },
        get trend() { return getTrend(this.current, this.previous); }
      },
      products: {
        current: totalProducts,
        previous: generatePreviousPeriod(totalProducts, -5, 30),
        get change() { return calculateChange(this.current, this.previous); },
        get trend() { return getTrend(this.current, this.previous); }
      },
      categories: {
        current: categories,
        previous: generatePreviousPeriod(categories, -10, 20),
        get change() { return calculateChange(this.current, this.previous); },
        get trend() { return getTrend(this.current, this.previous); }
      },
      averagePrice: {
        current: averagePrice,
        previous: generatePreviousPeriod(averagePrice, -8, 12),
        get change() { return calculateChange(this.current, this.previous); },
        get trend() { return getTrend(this.current, this.previous); }
      },
      lowStock: {
        current: lowStockCount,
        previous: generatePreviousPeriod(lowStockCount, -30, 50),
        get change() { return calculateChange(this.current, this.previous); },
        get trend() { return getTrend(this.current, this.previous); }
      }
    };

    // Force evaluation of getters
    const finalKPIs = {
      revenue: { ...kpis.revenue, change: kpis.revenue.change, trend: kpis.revenue.trend },
      orders: { ...kpis.orders, change: kpis.orders.change, trend: kpis.orders.trend },
      products: { ...kpis.products, change: kpis.products.change, trend: kpis.products.trend },
      categories: { ...kpis.categories, change: kpis.categories.change, trend: kpis.categories.trend },
      averagePrice: { ...kpis.averagePrice, change: kpis.averagePrice.change, trend: kpis.averagePrice.trend },
      lowStock: { ...kpis.lowStock, change: kpis.lowStock.change, trend: kpis.lowStock.trend }
    };

    this.setCache(cacheKey, finalKPIs);
    return finalKPIs;
  }

  // Get chart data based on real products
  async getCategoryChart() {
    const cacheKey = 'real-category-chart';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const products = await this.getAllProducts();
    
    if (products.length === 0) {
      const defaultChart = {
        labels: ['Sem produtos'],
        datasets: [{
          label: 'Produtos por Categoria',
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      };
      
      this.setCache(cacheKey, defaultChart);
      return defaultChart;
    }

    // Calculate category distribution
    const categoryCount = {};
    products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    const categories = Object.keys(categoryCount);
    const counts = Object.values(categoryCount);

    // Color palette for categories
    const colors = [
      '#3b82f6', // Blue
      '#10b981', // Green  
      '#f59e0b', // Yellow
      '#ef4444', // Red
      '#8b5cf6', // Purple
      '#06b6d4', // Cyan
      '#84cc16', // Lime
      '#f97316', // Orange
      '#ec4899', // Pink
      '#64748b'  // Gray
    ];

    const chartData = {
      labels: categories,
      datasets: [{
        label: 'Produtos por Categoria',
        data: counts,
        backgroundColor: colors.slice(0, categories.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };

    this.setCache(cacheKey, chartData);
    return chartData;
  }

  // Get revenue chart based on product values
  async getRevenueChart() {
    const cacheKey = 'real-revenue-chart';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const products = await this.getAllProducts();
    
    // Generate monthly data for the last 6 months
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const baseRevenue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    if (baseRevenue === 0) {
      const defaultChart = {
        labels: months,
        datasets: [{
          label: 'Receita',
          data: [0, 0, 0, 0, 0, 0],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
      };
      
      this.setCache(cacheKey, defaultChart);
      return defaultChart;
    }

    // Generate realistic monthly variations
    const revenueData = months.map((_, index) => {
      const seasonality = Math.sin((index * Math.PI) / 3) * 0.2 + 1; // Seasonal variation
      const growth = (index * 0.05) + 1; // Growth trend
      const noise = Math.random() * 0.3 + 0.85; // Random variation
      return Math.round(baseRevenue * seasonality * growth * noise);
    });

    const chartData = {
      labels: months,
      datasets: [
        {
          label: 'Receita Estimada',
          data: revenueData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Meta',
          data: revenueData.map(val => Math.round(val * 1.15)),
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderDash: [5, 5]
        }
      ]
    };

    this.setCache(cacheKey, chartData);
    return chartData;
  }

  // Get stock levels chart
  async getStockChart() {
    const cacheKey = 'real-stock-chart';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const products = await this.getAllProducts();
    
    if (products.length === 0) {
      const defaultChart = {
        labels: ['Sem produtos'],
        datasets: [{
          label: 'Níveis de Estoque',
          data: [0],
          backgroundColor: ['#e5e7eb'],
          borderColor: '#9ca3af',
          borderWidth: 1
        }]
      };
      
      this.setCache(cacheKey, defaultChart);
      return defaultChart;
    }

    // Get top 10 products by stock value
    const stockData = products
      .map(p => ({
        name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
        stock: p.stock,
        value: p.price * p.stock,
        status: p.stock <= p.minStock ? 'low' : 'ok'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const chartData = {
      labels: stockData.map(p => p.name),
      datasets: [{
        label: 'Estoque (unidades)',
        data: stockData.map(p => p.stock),
        backgroundColor: stockData.map(p => 
          p.status === 'low' ? '#ef4444' : '#3b82f6'
        ),
        borderColor: '#ffffff',
        borderWidth: 1
      }]
    };

    this.setCache(cacheKey, chartData);
    return chartData;
  }

  // Get product performance data
  async getProductPerformance() {
    const cacheKey = 'product-performance';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay();

    const products = await this.getAllProducts();
    
    const performance = {
      topProducts: products
        .filter(p => p.status === 'active')
        .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          value: p.price * p.stock,
          stock: p.stock
        })),
      
      lowStockProducts: products
        .filter(p => p.stock <= p.minStock && p.status === 'active')
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          stock: p.stock,
          minStock: p.minStock,
          category: p.category
        })),
      
      categoryStats: this.calculateCategoryStats(products)
    };

    this.setCache(cacheKey, performance);
    return performance;
  }

  // Calculate category statistics
  calculateCategoryStats(products) {
    const stats = {};
    
    products.forEach(product => {
      const category = product.category;
      
      if (!stats[category]) {
        stats[category] = {
          count: 0,
          totalValue: 0,
          totalStock: 0,
          averagePrice: 0,
          activeProducts: 0
        };
      }
      
      stats[category].count++;
      stats[category].totalValue += product.price * product.stock;
      stats[category].totalStock += product.stock;
      
      if (product.status === 'active') {
        stats[category].activeProducts++;
      }
    });

    // Calculate averages
    Object.keys(stats).forEach(category => {
      const categoryData = stats[category];
      categoryData.averagePrice = categoryData.count > 0 
        ? categoryData.totalValue / categoryData.totalStock 
        : 0;
    });

    return stats;
  }

  // Get quick stats for dashboard
  async getQuickStats() {
    const cacheKey = 'quick-stats';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await this.simulateApiDelay(100, 300);

    const products = await this.getAllProducts();
    
    const stats = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      categoriesCount: [...new Set(products.map(p => p.category))].length,
      lowStockAlerts: products.filter(p => p.stock <= p.minStock).length,
      outOfStock: products.filter(p => p.stock === 0).length,
      averagePrice: products.length > 0 
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
        : 0,
      lastUpdated: new Date().toISOString()
    };

    this.setCache(cacheKey, stats, 60000); // 1 minute cache
    return stats;
  }

  // Clear all caches (useful for testing)
  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Create singleton instance
export const realDataService = new RealDataService();

// Helper functions
export const getRealKPIs = () => realDataService.getRealKPIs();
export const getRealCategoryChart = () => realDataService.getCategoryChart();
export const getRealRevenueChart = () => realDataService.getRevenueChart();
export const getProductPerformance = () => realDataService.getProductPerformance();
export const getQuickStats = () => realDataService.getQuickStats();