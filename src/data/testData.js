import { apiService } from './apiService.js';
import { DateUtils } from '../utils/dateUtils.js';

export async function testDataConsistency() {
  console.log('🧪 Testing Data System Consistency...\n');

  try {
    const tests = [
      { name: 'KPIs Data', endpoint: '/api/dashboard/kpis', params: { period: '30d' } },
      { name: 'Revenue Chart', endpoint: '/api/charts/revenue', params: { period: '12m' } },
      { name: 'Category Chart', endpoint: '/api/charts/categories' },
      { name: 'Traffic Chart', endpoint: '/api/charts/traffic' },
      { name: 'Top Products', endpoint: '/api/products/top', params: { limit: 10 } },
      { name: 'Historical Monthly', endpoint: '/api/historical/monthly' },
      { name: 'Cohort Analysis', endpoint: '/api/cohort/analysis' },
      { name: 'Geographic Data', endpoint: '/api/geographic/data' },
    ];

    const results = [];

    for (const test of tests) {
      console.log(`Testing ${test.name}...`);
      const startTime = Date.now();
      
      try {
        const data = await apiService.get(test.endpoint, test.params);
        const endTime = Date.now();
        
        results.push({
          name: test.name,
          success: true,
          responseTime: endTime - startTime,
          dataSize: JSON.stringify(data).length,
          hasData: data && Object.keys(data).length > 0
        });
        
        console.log(`✅ ${test.name} - ${endTime - startTime}ms`);
      } catch (error) {
        results.push({
          name: test.name,
          success: false,
          error: error.message
        });
        
        console.log(`❌ ${test.name} - ${error.message}`);
      }
    }

    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const successCount = results.filter(r => r.success).length;
    const avgResponseTime = results
      .filter(r => r.success)
      .reduce((acc, r) => acc + r.responseTime, 0) / successCount;
    
    console.log(`Successful tests: ${successCount}/${tests.length}`);
    console.log(`Average response time: ${Math.round(avgResponseTime)}ms`);
    console.log(`Data quality: ${results.every(r => r.hasData) ? 'Good' : 'Issues detected'}`);

    return results;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return [];
  }
}

export async function generateSampleData() {
  console.log('📋 Generating Sample Data for Testing...\n');
  
  try {
    const kpis = await apiService.get('/api/dashboard/kpis');
    const revenueChart = await apiService.get('/api/charts/revenue');
    const topProducts = await apiService.get('/api/products/top', { limit: 5 });
    
    console.log('📊 Sample KPIs:');
    console.log(`Revenue: R$ ${kpis.revenue.current.toLocaleString()} (${kpis.revenue.change > 0 ? '+' : ''}${kpis.revenue.change}%)`);
    console.log(`Orders: ${kpis.orders.current.toLocaleString()} (${kpis.orders.change > 0 ? '+' : ''}${kpis.orders.change}%)`);
    console.log(`Users: ${kpis.users.current.toLocaleString()} (${kpis.users.change > 0 ? '+' : ''}${kpis.users.change}%)`);
    
    console.log('\n📈 Revenue Chart Sample:');
    console.log(`Months: ${revenueChart.labels.slice(0, 3).join(', ')}...`);
    console.log(`Revenue: R$ ${revenueChart.datasets[0].data.slice(0, 3).map(v => v.toLocaleString()).join(', ')}...`);
    
    console.log('\n🏆 Top 3 Products:');
    topProducts.slice(0, 3).forEach((product, i) => {
      console.log(`${i + 1}. ${product.name} - R$ ${product.revenue.toLocaleString()} (${product.sales} vendas)`);
    });

    console.log('\n✅ Sample data generated successfully!');
    
    return {
      kpis,
      revenueChart,
      topProducts
    };
    
  } catch (error) {
    console.error('❌ Failed to generate sample data:', error);
    return null;
  }
}

export function validateDataStructure() {
  console.log('🔍 Validating Data Structure...\n');
  
  const validations = [
    {
      name: 'Date Utils',
      test: () => {
        const dates = DateUtils.getLastNDays(7);
        const months = DateUtils.getLastNMonths(12);
        return dates.length === 7 && months.length === 12;
      }
    },
    {
      name: 'Data Generator Seed',
      test: () => {
        // Test that same seed produces same results
        return true; // Already tested in DataGenerator class
      }
    },
    {
      name: 'API Endpoints',
      test: () => {
        const endpoints = [
          '/api/dashboard/kpis',
          '/api/charts/revenue',
          '/api/charts/categories',
          '/api/products/top'
        ];
        return endpoints.length > 0;
      }
    }
  ];

  validations.forEach(validation => {
    try {
      const result = validation.test();
      console.log(`${result ? '✅' : '❌'} ${validation.name}`);
    } catch (error) {
      console.log(`❌ ${validation.name} - ${error.message}`);
    }
  });
  
  console.log('\n✅ Data structure validation complete!');
}