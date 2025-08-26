import ActivityHeatmap from '../components/charts/ActivityHeatmap';
import ConversionFunnel from '../components/charts/ConversionFunnel';
import ScatterPlot from '../components/charts/ScatterPlot';
import GeographicMap from '../components/charts/GeographicMap';
import CohortAnalysis from '../components/charts/CohortAnalysis';
import styles from './Analytics.module.css';

function Analytics() {
  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics Avançadas</h1>
        <p className={styles.subtitle}>
          Análises aprofundadas com visualizações complexas e insights estratégicos
        </p>
      </div>

      <div className={styles.content}>
        {/* Top row - Heatmap and Funnel */}
        <div className={styles.topRow}>
          <div className={styles.heatmapSection}>
            <ActivityHeatmap period="7d" />
          </div>
          <div className={styles.funnelSection}>
            <ConversionFunnel />
          </div>
        </div>

        {/* Middle row - Scatter Plot (full width) */}
        <div className={styles.middleRow}>
          <ScatterPlot />
        </div>

        {/* Bottom row - Geographic and Cohort */}
        <div className={styles.bottomRow}>
          <div className={styles.geoSection}>
            <GeographicMap />
          </div>
          <div className={styles.cohortSection}>
            <CohortAnalysis />
          </div>
        </div>
      </div>

      {/* Quick filters for different periods */}
      <div className={styles.quickFilters}>
        <h3 className={styles.filtersTitle}>Análises Rápidas</h3>
        <div className={styles.filterButtons}>
          <button className={styles.filterButton}>
            🔥 Últimos 7 dias
          </button>
          <button className={styles.filterButton}>
            📊 Último mês
          </button>
          <button className={styles.filterButton}>
            📈 Último trimestre  
          </button>
          <button className={styles.filterButton}>
            🎯 Comparar períodos
          </button>
        </div>
        
        <div className={styles.analysisTypes}>
          <span className={styles.analysisType}>
            🗺️ <strong>Geográfico:</strong> Performance por região
          </span>
          <span className={styles.analysisType}>
            📈 <strong>Correlação:</strong> Investimento vs Vendas
          </span>
          <span className={styles.analysisType}>
            🔄 <strong>Retenção:</strong> Análise de coortes
          </span>
          <span className={styles.analysisType}>
            ⏰ <strong>Temporal:</strong> Padrões de atividade
          </span>
          <span className={styles.analysisType}>
            🎯 <strong>Conversão:</strong> Funil de vendas
          </span>
        </div>
      </div>
    </div>
  );
}

export default Analytics