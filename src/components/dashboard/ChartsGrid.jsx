import RevenueChart from '../charts/RevenueChart';
import CategoryChart from '../charts/CategoryChart';
import TrafficChart from '../charts/TrafficChart';
import UsersChart from '../charts/UsersChart';
import styles from './ChartsGrid.module.css';

function ChartsGrid() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Análises e Tendências</h2>
        <p className={styles.subtitle}>Visualização detalhada dos dados de desempenho</p>
      </div>
      
      <div className={styles.grid}>
        {/* Row 1 - Large charts */}
        <div className={styles.chartLarge}>
          <RevenueChart height={400} />
        </div>
        
        <div className={styles.chartLarge}>
          <UsersChart height={400} />
        </div>
        
        {/* Row 2 - Medium charts */}
        <div className={styles.chartMedium}>
          <CategoryChart height={350} />
        </div>
        
        <div className={styles.chartMedium}>
          <TrafficChart height={350} />
        </div>
      </div>
    </div>
  );
}

export default ChartsGrid;