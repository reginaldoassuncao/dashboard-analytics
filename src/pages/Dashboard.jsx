import { useState } from 'react';
import { ToggleLeft, ToggleRight, Database, Package } from 'lucide-react';
import SimpleKPIGrid from '../components/dashboard/SimpleKPIGrid';
import RealKPIGrid from '../components/dashboard/RealKPIGrid';
import QuickStats from '../components/ui/QuickStats';
import ChartsGrid from '../components/dashboard/ChartsGrid';
import RealChartsGrid from '../components/dashboard/RealChartsGrid';
import ChartStats from '../components/ui/ChartStats';
import SimpleDateFilters from '../components/ui/SimpleDateFilters';
import { useProducts } from '../contexts/ProductsContext';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [useRealData, setUseRealData] = useState(true);
  const { products, stats } = useProducts();

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Dashboard Analytics</h1>
            <p className={styles.subtitle}>
              {useRealData 
                ? `Dados reais baseados em ${stats?.total || 0} produtos` 
                : 'Dados simulados para demonstração'
              }
            </p>
          </div>
          
          <div className={styles.dataToggle}>
            <div className={styles.toggleContainer}>
              <div className={styles.toggleLabel}>
                <Database size={16} />
                <span>Demo</span>
              </div>
              <button
                className={`${styles.toggle} ${useRealData ? styles.toggleActive : ''}`}
                onClick={() => setUseRealData(!useRealData)}
                aria-label={`Usar ${useRealData ? 'dados demo' : 'dados reais'}`}
              >
                {useRealData ? (
                  <ToggleRight size={20} />
                ) : (
                  <ToggleLeft size={20} />
                )}
              </button>
              <div className={styles.toggleLabel}>
                <Package size={16} />
                <span>Real</span>
              </div>
            </div>
            
            {useRealData && (
              <div className={styles.realDataInfo}>
                <span className={styles.realDataIndicator}>
                  🔴 Dados em tempo real
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <SimpleDateFilters />
      
      {useRealData ? (
        <>
          <RealKPIGrid />
          <RealChartsGrid />
        </>
      ) : (
        <>
          <SimpleKPIGrid />
          <QuickStats />
          <ChartStats />
          <ChartsGrid />
        </>
      )}
      
      {useRealData && products.length === 0 && (
        <div className={styles.noDataMessage}>
          <Package size={48} />
          <h3>Nenhum produto encontrado</h3>
          <p>
            Adicione produtos na seção "Produtos" para ver dados reais no dashboard.
          </p>
          <a href="/products" className={styles.addProductsLink}>
            Adicionar Produtos
          </a>
        </div>
      )}
    </div>
  )
}

export default Dashboard