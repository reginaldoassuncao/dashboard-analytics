// useRealData Hook - Provides real data for dashboard components
// Connects dashboard to actual product data with loading states and error handling

import { useState, useEffect, useCallback } from 'react';
import { realDataService } from '../services/realDataService';
import { useProducts } from '../contexts/ProductsContext';

// Main hook for dashboard data
export function useRealData() {
  const [data, setData] = useState({
    kpis: null,
    categoryChart: null,
    revenueChart: null,
    stockChart: null,
    quickStats: null,
    productPerformance: null
  });
  
  const [loading, setLoading] = useState({
    kpis: false,
    categoryChart: false,
    revenueChart: false,
    stockChart: false,
    quickStats: false,
    productPerformance: false
  });
  
  const [errors, setErrors] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Watch for product changes to refresh data
  const { products } = useProducts();

  // Generic data fetcher with error handling
  const fetchData = useCallback(async (key, fetchFunction, dependencies = []) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));
    
    try {
      const result = await fetchFunction();
      setData(prev => ({ ...prev, [key]: result }));
      return result;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [key]: `Erro ao carregar ${key}. Tente novamente.` 
      }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  // Fetch all dashboard data
  const fetchAllData = useCallback(async () => {
    const promises = [
      fetchData('kpis', () => realDataService.getRealKPIs()),
      fetchData('categoryChart', () => realDataService.getCategoryChart()),
      fetchData('revenueChart', () => realDataService.getRevenueChart()),
      fetchData('stockChart', () => realDataService.getStockChart()),
      fetchData('quickStats', () => realDataService.getQuickStats()),
      fetchData('productPerformance', () => realDataService.getProductPerformance())
    ];

    await Promise.allSettled(promises);
    setLastUpdated(new Date().toISOString());
  }, [fetchData]);

  // Refresh specific data type
  const refreshData = useCallback(async (dataType) => {
    const fetchFunctions = {
      kpis: () => realDataService.getRealKPIs(),
      categoryChart: () => realDataService.getCategoryChart(),
      revenueChart: () => realDataService.getRevenueChart(),
      stockChart: () => realDataService.getStockChart(),
      quickStats: () => realDataService.getQuickStats(),
      productPerformance: () => realDataService.getProductPerformance()
    };

    if (fetchFunctions[dataType]) {
      await fetchData(dataType, fetchFunctions[dataType]);
    }
  }, [fetchData]);

  // Initial data load
  useEffect(() => {
    fetchAllData();
  }, []); // Run once on mount

  // Refresh data when products change
  useEffect(() => {
    if (products && products.length >= 0) {
      // Clear cache to ensure fresh data
      realDataService.clearCache();
      fetchAllData();
    }
  }, [products.length, fetchAllData]); // Only trigger when product count changes

  // Check if all data is loaded
  const isDataLoaded = Object.values(data).every(value => value !== null);
  const isLoading = Object.values(loading).some(value => value === true);
  const hasErrors = Object.values(errors).some(error => error !== null && error !== undefined);

  return {
    // Data
    data,
    
    // Loading states
    loading,
    isLoading,
    isDataLoaded,
    
    // Error states
    errors,
    hasErrors,
    
    // Actions
    refreshData,
    refreshAllData: fetchAllData,
    
    // Meta
    lastUpdated
  };
}

// Hook for KPIs only (lighter weight)
export function useRealKPIs() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { products } = useProducts();

  const fetchKPIs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await realDataService.getRealKPIs();
      setKpis(result);
    } catch (err) {
      console.error('Error fetching KPIs:', err);
      setError('Erro ao carregar KPIs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  // Refresh when products change
  useEffect(() => {
    if (products.length >= 0) {
      realDataService.clearCache();
      fetchKPIs();
    }
  }, [products.length, fetchKPIs]);

  return {
    kpis,
    loading,
    error,
    refresh: fetchKPIs
  };
}

// Hook for charts only
export function useRealCharts() {
  const [charts, setCharts] = useState({
    category: null,
    revenue: null,
    stock: null
  });
  
  const [loading, setLoading] = useState({
    category: false,
    revenue: false,
    stock: false
  });
  
  const [errors, setErrors] = useState({});
  const { products } = useProducts();

  const fetchChart = useCallback(async (chartType, fetchFunction) => {
    setLoading(prev => ({ ...prev, [chartType]: true }));
    setErrors(prev => ({ ...prev, [chartType]: null }));
    
    try {
      const result = await fetchFunction();
      setCharts(prev => ({ ...prev, [chartType]: result }));
    } catch (error) {
      console.error(`Error fetching ${chartType} chart:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [chartType]: `Erro ao carregar gráfico de ${chartType}` 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [chartType]: false }));
    }
  }, []);

  const fetchAllCharts = useCallback(async () => {
    const promises = [
      fetchChart('category', () => realDataService.getCategoryChart()),
      fetchChart('revenue', () => realDataService.getRevenueChart()),
      fetchChart('stock', () => realDataService.getStockChart())
    ];
    
    await Promise.allSettled(promises);
  }, [fetchChart]);

  useEffect(() => {
    fetchAllCharts();
  }, []);

  useEffect(() => {
    if (products.length >= 0) {
      realDataService.clearCache();
      fetchAllCharts();
    }
  }, [products.length, fetchAllCharts]);

  return {
    charts,
    loading,
    errors,
    refresh: fetchAllCharts,
    refreshChart: (chartType) => {
      const fetchFunctions = {
        category: () => realDataService.getCategoryChart(),
        revenue: () => realDataService.getRevenueChart(),
        stock: () => realDataService.getStockChart()
      };
      
      if (fetchFunctions[chartType]) {
        fetchChart(chartType, fetchFunctions[chartType]);
      }
    }
  };
}

// Hook for product performance data
export function useProductPerformance() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { products } = useProducts();

  const fetchPerformance = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await realDataService.getProductPerformance();
      setPerformance(result);
    } catch (err) {
      console.error('Error fetching product performance:', err);
      setError('Erro ao carregar performance de produtos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  useEffect(() => {
    if (products.length >= 0) {
      realDataService.clearCache();
      fetchPerformance();
    }
  }, [products.length, fetchPerformance]);

  return {
    performance,
    loading,
    error,
    refresh: fetchPerformance,
    
    // Helper getters
    topProducts: performance?.topProducts || [],
    lowStockProducts: performance?.lowStockProducts || [],
    categoryStats: performance?.categoryStats || {}
  };
}

// Hook for quick stats (lightweight, frequent updates)
export function useQuickStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { products } = useProducts();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await realDataService.getQuickStats();
      setStats(result);
    } catch (err) {
      console.error('Error fetching quick stats:', err);
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (products.length >= 0) {
      realDataService.clearCache();
      fetchStats();
    }
  }, [products.length, fetchStats]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
    lastUpdated: stats?.lastUpdated
  };
}