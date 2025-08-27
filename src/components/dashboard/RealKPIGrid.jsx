import { 
  Package,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { useRealKPIs } from '../../hooks/useRealData';
import KPICard from '../ui/KPICard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import styles from './RealKPIGrid.module.css';

function RealKPIGrid() {
  const { kpis, loading, error, refresh } = useRealKPIs();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <p className={styles.loadingText}>Carregando métricas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={refresh}
        className={styles.errorContainer}
      />
    );
  }

  if (!kpis) {
    return (
      <div className={styles.emptyContainer}>
        <Package size={48} />
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Format number
  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(value));
  };

  return (
    <div className={styles.kpiGrid}>
      <KPICard
        title="Valor Total do Estoque"
        value={kpis.revenue.current}
        previousValue={kpis.revenue.previous}
        change={kpis.revenue.change}
        trend={kpis.revenue.trend}
        icon={DollarSign}
        prefix="R$ "
        decimals={0}
      />

      <KPICard
        title="Total de Produtos"
        value={kpis.products.current}
        previousValue={kpis.products.previous}
        change={kpis.products.change}
        trend={kpis.products.trend}
        icon={Package}
        decimals={0}
      />

      <KPICard
        title="Unidades em Estoque"
        value={kpis.orders.current}
        previousValue={kpis.orders.previous}
        change={kpis.orders.change}
        trend={kpis.orders.trend}
        icon={ShoppingBag}
        decimals={0}
        suffix=" un"
      />

      <KPICard
        title="Categorias Ativas"
        value={kpis.categories.current}
        previousValue={kpis.categories.previous}
        change={kpis.categories.change}
        trend={kpis.categories.trend}
        icon={BarChart3}
        decimals={0}
      />

      <KPICard
        title="Preço Médio"
        value={kpis.averagePrice.current}
        previousValue={kpis.averagePrice.previous}
        change={kpis.averagePrice.change}
        trend={kpis.averagePrice.trend}
        icon={TrendingUp}
        prefix="R$ "
        decimals={2}
      />

      <KPICard
        title="Produtos em Estoque Baixo"
        value={kpis.lowStock.current}
        previousValue={kpis.lowStock.previous}
        change={kpis.lowStock.change}
        trend={kpis.lowStock.trend === 'up' ? 'down' : kpis.lowStock.trend === 'down' ? 'up' : 'neutral'} // Invert trend for low stock (less is better)
        icon={AlertTriangle}
        decimals={0}
      />
    </div>
  );
}

export default RealKPIGrid;