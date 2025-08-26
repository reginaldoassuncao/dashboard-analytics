import SimpleKPIGrid from '../components/dashboard/SimpleKPIGrid';
import QuickStats from '../components/ui/QuickStats';
import ChartsGrid from '../components/dashboard/ChartsGrid';
import ChartStats from '../components/ui/ChartStats';
import SimpleDateFilters from '../components/ui/SimpleDateFilters';
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
      
      <SimpleDateFilters />
      <SimpleKPIGrid />
      <QuickStats />
      <ChartStats />
      <ChartsGrid />
    </div>
  )
}

export default Dashboard