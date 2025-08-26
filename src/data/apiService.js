import { dataService } from './dataService.js';
import { historicalData } from './historicalData.js';

export class APIService {
  constructor() {
    this.isOnline = true;
    this.errorRate = 0.02;
    this.latency = { min: 200, max: 1200 };
  }

  async simulateNetworkConditions() {
    if (Math.random() < this.errorRate) {
      throw new APIError('Network error', 500);
    }
    
    const delay = Math.random() * (this.latency.max - this.latency.min) + this.latency.min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async get(endpoint, params = {}) {
    if (!this.isOnline) {
      throw new APIError('No internet connection', 0);
    }

    await this.simulateNetworkConditions();

    switch (endpoint) {
      case '/api/dashboard/kpis':
        return await dataService.getDashboardKPIs(params.period);
        
      case '/api/charts/revenue':
        return await dataService.getRevenueChart(params.period);
        
      case '/api/charts/categories':
        return await dataService.getCategoryChart();
        
      case '/api/charts/traffic':
        return await dataService.getTrafficChart();
        
      case '/api/charts/daily-users':
        return await dataService.getDailyActiveUsers(params.days);
        
      case '/api/products/top':
        return await dataService.getTopProducts(params.limit);
        
      case '/api/users/recent':
        return await dataService.getRecentUsers(params.limit);
        
      case '/api/analytics/overview':
        return await dataService.getAnalyticsData();
        
      case '/api/historical/monthly':
        return historicalData.getMonthlyData();
        
      case '/api/historical/daily':
        return historicalData.getDailyData(params.days);
        
      case '/api/historical/yoy':
        return historicalData.getYearOverYearComparison();
        
      case '/api/historical/quarterly':
        return historicalData.getQuarterlyData();
        
      case '/api/cohort/analysis':
        return historicalData.getCohortData();
        
      case '/api/geographic/data':
        return historicalData.getGeographicData();
        
      case '/api/funnel/conversion':
        return historicalData.getFunnelData();
        
      case '/api/heatmap/activity':
        return historicalData.getHeatmapData();
        
      default:
        throw new APIError(`Endpoint not found: ${endpoint}`, 404);
    }
  }

  async post(endpoint, data) {
    if (!this.isOnline) {
      throw new APIError('No internet connection', 0);
    }

    await this.simulateNetworkConditions();
    
    switch (endpoint) {
      case '/api/settings/update':
        return { success: true, message: 'Settings updated successfully' };
        
      case '/api/export/report':
        return { success: true, url: '/downloads/report.pdf', message: 'Report generated' };
        
      default:
        throw new APIError(`Endpoint not found: ${endpoint}`, 404);
    }
  }

  setNetworkConditions(options = {}) {
    this.isOnline = options.online !== undefined ? options.online : this.isOnline;
    this.errorRate = options.errorRate !== undefined ? options.errorRate : this.errorRate;
    this.latency = options.latency !== undefined ? options.latency : this.latency;
  }

  simulateOffline() {
    this.isOnline = false;
  }

  simulateOnline() {
    this.isOnline = true;
  }

  simulateSlowNetwork() {
    this.latency = { min: 2000, max: 5000 };
    this.errorRate = 0.1;
  }

  simulateFastNetwork() {
    this.latency = { min: 100, max: 300 };
    this.errorRate = 0.01;
  }

  resetNetworkConditions() {
    this.isOnline = true;
    this.errorRate = 0.02;
    this.latency = { min: 200, max: 1200 };
  }
}

export class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

export const apiService = new APIService();

export const useAPI = () => {
  const fetchData = async (endpoint, params = {}) => {
    try {
      const data = await apiService.get(endpoint, params);
      return { data, error: null, loading: false };
    } catch (error) {
      return { data: null, error, loading: false };
    }
  };

  const postData = async (endpoint, data) => {
    try {
      const response = await apiService.post(endpoint, data);
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return { fetchData, postData };
};