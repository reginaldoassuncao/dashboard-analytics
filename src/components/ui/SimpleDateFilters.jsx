import { useSimpleDateRange } from '../../contexts/SimpleDateContext';
import styles from './SimpleDateFilters.module.css';

const FILTERS = [
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: '90d', label: '90 dias' },
  { key: '1y', label: '1 ano' }
];

function SimpleDateFilters() {
  const { selectedPeriod, setSelectedPeriod, compareMode, setCompareMode, getPeriodLabel } = useSimpleDateRange();

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            className={`${styles.filter} ${selectedPeriod === filter.key ? styles.active : ''}`}
            onClick={() => setSelectedPeriod(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      <div className={styles.info}>
        <span>📅 {getPeriodLabel()}</span>
        {compareMode && <span>🔄 Modo comparação ativo</span>}
      </div>
    </div>
  );
}

export default SimpleDateFilters;