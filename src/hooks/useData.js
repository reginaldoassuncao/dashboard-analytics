import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../data/apiService.js';

export function useData(endpoint, params = {}, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const {
    refetchInterval = null,
    refetchOnMount = true,
    cacheTime = 300000, // 5 minutes
  } = options;

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const result = await apiService.get(endpoint, params);
      setData(result);
      setLastFetch(Date.now());
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err);
      console.warn(`Error fetching ${endpoint}:`, err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const silentRefetch = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    if (refetchOnMount) {
      // Adicionar um pequeno delay para evitar múltiplas requisições simultâneas
      const timeout = setTimeout(() => {
        fetchData(true);
      }, Math.random() * 100); // 0-100ms de delay aleatório
      
      return () => clearTimeout(timeout);
    }
  }, [fetchData, refetchOnMount]);

  useEffect(() => {
    if (!refetchInterval) return;

    const interval = setInterval(() => {
      if (!loading) {
        silentRefetch();
      }
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, loading, silentRefetch]);

  const isStale = useCallback(() => {
    if (!lastFetch) return true;
    return Date.now() - lastFetch > cacheTime;
  }, [lastFetch, cacheTime]);

  return {
    data,
    loading,
    error,
    refetch,
    silentRefetch,
    isStale: isStale(),
    lastFetch
  };
}

export function useKPIs(period = '30d', dateRange = null) {
  return useData('/api/dashboard/kpis', { period, dateRange }, {
    refetchInterval: 30000, // 30 seconds
    cacheTime: 60000 // 1 minute
  });
}

export function useRevenueChart(period = '12m', dateRange = null) {
  return useData('/api/charts/revenue', { period, dateRange });
}

export function useCategoryChart(dateRange = null) {
  return useData('/api/charts/categories', { dateRange });
}

export function useTrafficChart(dateRange = null) {
  return useData('/api/charts/traffic', { dateRange });
}

export function useDailyUsers(days = 30, dateRange = null) {
  return useData('/api/charts/daily-users', { days, dateRange });
}

export function useTopProducts(limit = 10) {
  return useData('/api/products/top', { limit });
}

export function useRecentUsers(limit = 20) {
  return useData('/api/users/recent', { limit });
}

export function useAnalyticsData() {
  return useData('/api/analytics/overview');
}

export function useHistoricalData(type = 'monthly', params = {}) {
  const endpoint = `/api/historical/${type}`;
  return useData(endpoint, params);
}

export function useCohortAnalysis() {
  return useData('/api/cohort/analysis');
}

export function useGeographicData() {
  return useData('/api/geographic/data');
}

export function useFunnelData() {
  return useData('/api/funnel/conversion');
}

export function useHeatmapData() {
  return useData('/api/heatmap/activity');
}

export function useBatchData(requests) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchBatchData = async () => {
      setLoading(true);
      const results = {};
      const batchErrors = {};

      await Promise.all(
        requests.map(async (request) => {
          try {
            const result = await apiService.get(request.endpoint, request.params);
            results[request.key] = result;
          } catch (error) {
            batchErrors[request.key] = error;
          }
        })
      );

      setData(results);
      setErrors(batchErrors);
      setLoading(false);
    };

    fetchBatchData();
  }, [JSON.stringify(requests)]);

  const refetch = useCallback(async () => {
    setLoading(true);
    const results = {};
    const batchErrors = {};

    await Promise.all(
      requests.map(async (request) => {
        try {
          const result = await apiService.get(request.endpoint, request.params);
          results[request.key] = result;
        } catch (error) {
          batchErrors[request.key] = error;
        }
      })
    );

    setData(results);
    setErrors(batchErrors);
    setLoading(false);
  }, [requests]);

  return {
    data,
    loading,
    errors,
    refetch,
    hasErrors: Object.keys(errors).length > 0
  };
}