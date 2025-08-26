import { useEffect, useState } from 'react';
import { testDataConsistency, generateSampleData } from '../data/testData.js';
import { useKPIs } from '../hooks/useData.js';

function DataTest() {
  const [testResults, setTestResults] = useState(null);
  const [sampleData, setSampleData] = useState(null);
  const { data: kpis, loading, error } = useKPIs();

  const runTests = async () => {
    console.log('Running data consistency tests...');
    const results = await testDataConsistency();
    setTestResults(results);
    
    const sample = await generateSampleData();
    setSampleData(sample);
  };

  useEffect(() => {
    runTests();
  }, []);

  if (loading) return <div>Loading KPIs...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🧪 Data System Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Real-time KPIs (using hooks):</h3>
        {kpis && (
          <div>
            <p>💰 Revenue: R$ {kpis.revenue.current.toLocaleString()} ({kpis.revenue.change > 0 ? '+' : ''}{kpis.revenue.change}%)</p>
            <p>📦 Orders: {kpis.orders.current.toLocaleString()} ({kpis.orders.change > 0 ? '+' : ''}{kpis.orders.change}%)</p>
            <p>👥 Users: {kpis.users.current.toLocaleString()} ({kpis.users.change > 0 ? '+' : ''}{kpis.users.change}%)</p>
            <p>📊 Conversion Rate: {kpis.conversionRate.current}% ({kpis.conversionRate.change > 0 ? '+' : ''}{kpis.conversionRate.change}%)</p>
          </div>
        )}
      </div>

      {testResults && (
        <div>
          <h3>Test Results:</h3>
          <p>✅ Successful tests: {testResults.filter(r => r.success).length}/{testResults.length}</p>
          <p>⚡ Average response time: {Math.round(testResults.filter(r => r.success).reduce((acc, r) => acc + r.responseTime, 0) / testResults.filter(r => r.success).length)}ms</p>
        </div>
      )}

      {sampleData && (
        <div>
          <h3>Sample Data Generated:</h3>
          <p>✅ KPIs, Revenue Chart, and Products data generated successfully</p>
          <p>📊 Chart has {sampleData.revenueChart.labels.length} data points</p>
          <p>🏆 {sampleData.topProducts.length} products generated</p>
        </div>
      )}

      <button onClick={runTests} style={{ padding: '10px 20px', marginTop: '10px' }}>
        Run Tests Again
      </button>
    </div>
  );
}

export default DataTest;