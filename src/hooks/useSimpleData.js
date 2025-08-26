import { useState, useEffect } from 'react';
import { apiService } from '../data/apiService.js';

export function useSimpleData(endpoint, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiService.get(endpoint, params);
        
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          console.warn(`Error fetching ${endpoint}:`, err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [endpoint, JSON.stringify(params)]);

  return { data, loading, error };
}

// Hooks específicos simplificados
export function useKPIs(period = '30d') {
  return useSimpleData('/api/dashboard/kpis', { period });
}

export function useRevenueChart(period = '12m') {
  return useSimpleData('/api/charts/revenue', { period });
}

export function useCategoryChart() {
  return useSimpleData('/api/charts/categories');
}

export function useTrafficChart() {
  return useSimpleData('/api/charts/traffic');
}

export function useDailyUsers(days = 30) {
  return useSimpleData('/api/charts/daily-users', { days });
}

export function useTopProducts(limit = 50) {
  return useSimpleData('/api/products/top', { limit });
}

export function useRecentUsers(limit = 50) {
  return useSimpleData('/api/users/recent', { limit });
}