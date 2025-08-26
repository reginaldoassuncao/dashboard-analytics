import { useGeographicData } from '../../hooks/useSimpleData';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import styles from './GeographicMap.module.css';

function GeographicMap() {
  const { data: geoData, loading, error } = useGeographicData();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!geoData) return <ErrorMessage message="Nenhum dados disponíveis" />;

  const maxSales = Math.max(...geoData.map(state => state.sales));
  const maxUsers = Math.max(...geoData.map(state => state.users));
  const totalSales = geoData.reduce((sum, state) => sum + state.sales, 0);
  const totalUsers = geoData.reduce((sum, state) => sum + state.users, 0);

  return (
    <div className={styles.geoMap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Distribuição Geográfica</h3>
        <p className={styles.subtitle}>
          Performance de vendas e usuários por estado
        </p>
      </div>

      <div className={styles.content}>
        {/* Simulated map visualization */}
        <div className={styles.mapContainer}>
          <div className={styles.mapTitle}>Brasil - Mapa de Calor de Vendas</div>
          
          <div className={styles.mapGrid}>
            {geoData.slice(0, 8).map((state, index) => {
              const intensity = state.sales / maxSales;
              const size = Math.max(60, intensity * 120);
              
              return (
                <div
                  key={state.code}
                  className={styles.stateNode}
                  style={{
                    '--intensity': intensity,
                    '--size': `${size}px`,
                    backgroundColor: state.color,
                    opacity: 0.7 + (intensity * 0.3),
                    gridColumn: (index % 4) + 1,
                    gridRow: Math.floor(index / 4) + 1
                  }}
                  title={`${state.name}: ${formatCurrency(state.sales)}`}
                >
                  <span className={styles.stateCode}>{state.code}</span>
                  <span className={styles.stateSales}>
                    {formatCurrency(state.sales, true)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.mapLegend}>
            <span>Vendas: Baixas</span>
            <div className={styles.legendBar}>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={styles.legendStep}
                  style={{
                    backgroundColor: `rgba(220, 38, 38, ${0.3 + (i * 0.15)})`
                  }}
                />
              ))}
            </div>
            <span>Altas</span>
          </div>
        </div>

        {/* States ranking */}
        <div className={styles.ranking}>
          <h4 className={styles.rankingTitle}>Ranking por Estado</h4>
          
          <div className={styles.rankingList}>
            {geoData.map((state, index) => {
              const salesPercentage = (state.sales / totalSales) * 100;
              const usersPercentage = (state.users / totalUsers) * 100;
              const avgSalePerUser = state.sales / state.users;
              
              return (
                <div key={state.code} className={styles.rankingItem}>
                  <div className={styles.rankingPosition}>#{index + 1}</div>
                  
                  <div className={styles.stateInfo}>
                    <div className={styles.stateName}>
                      <span className={styles.stateFullName}>{state.name}</span>
                      <span className={styles.stateCodeSmall}>({state.code})</span>
                    </div>
                    
                    <div className={styles.stateMetrics}>
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>Vendas</span>
                        <span className={styles.metricValue}>
                          {formatCurrency(state.sales)}
                        </span>
                        <span className={styles.metricPercentage}>
                          {salesPercentage.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>Usuários</span>
                        <span className={styles.metricValue}>
                          {formatNumber(state.users)}
                        </span>
                        <span className={styles.metricPercentage}>
                          {usersPercentage.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className={styles.metric}>
                        <span className={styles.metricLabel}>Ticket Médio</span>
                        <span className={styles.metricValue}>
                          {formatCurrency(avgSalePerUser)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.progressBars}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ 
                          width: `${salesPercentage}%`,
                          backgroundColor: state.color 
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Estados Ativos</span>
          <span className={styles.summaryValue}>{geoData.length}</span>
        </div>
        
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Estado Líder</span>
          <span className={styles.summaryValue}>{geoData[0].name}</span>
        </div>
        
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Concentração SP+RJ</span>
          <span className={styles.summaryValue}>
            {(((geoData[0].sales + geoData[1].sales) / totalSales) * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Ticket Médio Nacional</span>
          <span className={styles.summaryValue}>
            {formatCurrency(totalSales / totalUsers)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GeographicMap;