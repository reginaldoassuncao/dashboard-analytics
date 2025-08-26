import KPIGrid from '../components/dashboard/KPIGrid';
import styles from './Dashboard.module.css';

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Analytics</h1>
        <p className={styles.subtitle}>
          Visão geral do desempenho e métricas principais
        </p>
      </div>
      
      <KPIGrid />
    </div>
  )
}

export default Dashboard