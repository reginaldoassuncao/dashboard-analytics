import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Target,
  Clock,
  Eye,
  MousePointer
} from 'lucide-react';
import KPICard from '../ui/KPICard';
import RefreshIndicator from '../ui/RefreshIndicator';
import { useKPIs } from '../../hooks/useData';
import styles from './KPIGrid.module.css';

function KPIGrid() {
  const { data: kpis, loading, error, refetch, lastFetch } = useKPIs('30d');

  const kpiCards = [
    {
      id: 'revenue',
      title: 'Receita Total',
      icon: DollarSign,
      prefix: 'R$ ',
      decimals: 0,
      getValue: () => kpis?.revenue?.current || 0,
      getChange: () => kpis?.revenue?.change || 0,
      getTrend: () => kpis?.revenue?.trend || 'neutral'
    },
    {
      id: 'orders',
      title: 'Pedidos',
      icon: ShoppingCart,
      decimals: 0,
      getValue: () => kpis?.orders?.current || 0,
      getChange: () => kpis?.orders?.change || 0,
      getTrend: () => kpis?.orders?.trend || 'neutral'
    },
    {
      id: 'users',
      title: 'Usuários Ativos',
      icon: Users,
      decimals: 0,
      getValue: () => kpis?.users?.current || 0,
      getChange: () => kpis?.users?.change || 0,
      getTrend: () => kpis?.users?.trend || 'neutral'
    },
    {
      id: 'conversionRate',
      title: 'Taxa de Conversão',
      icon: Target,
      suffix: '%',
      decimals: 2,
      getValue: () => kpis?.conversionRate?.current || 0,
      getChange: () => kpis?.conversionRate?.change || 0,
      getTrend: () => kpis?.conversionRate?.trend || 'neutral'
    },
    {
      id: 'averageOrder',
      title: 'Ticket Médio',
      icon: TrendingUp,
      prefix: 'R$ ',
      decimals: 2,
      getValue: () => kpis?.averageOrder?.current || 0,
      getChange: () => kpis?.averageOrder?.change || 0,
      getTrend: () => kpis?.averageOrder?.trend || 'neutral'
    },
    {
      id: 'customerLifetimeValue',
      title: 'LTV do Cliente',
      icon: Clock,
      prefix: 'R$ ',
      decimals: 2,
      getValue: () => kpis?.customerLifetimeValue?.current || 0,
      getChange: () => kpis?.customerLifetimeValue?.change || 0,
      getTrend: () => kpis?.customerLifetimeValue?.trend || 'neutral'
    },
    {
      id: 'pageViews',
      title: 'Visualizações',
      icon: Eye,
      decimals: 0,
      getValue: () => loading ? 0 : 2847392,
      getChange: () => 8.7,
      getTrend: () => 'up'
    },
    {
      id: 'clickThrough',
      title: 'CTR Médio',
      icon: MousePointer,
      suffix: '%',
      decimals: 2,
      getValue: () => loading ? 0 : 2.45,
      getChange: () => -0.3,
      getTrend: () => 'down'
    }
  ];

  if (error) {
    return (
      <div className={styles.error}>
        <p>Erro ao carregar KPIs: {error.message}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Métricas Principais</h2>
          <p className={styles.subtitle}>Resumo do desempenho dos últimos 30 dias</p>
        </div>
        <RefreshIndicator 
          isRefreshing={loading}
          lastUpdate={lastFetch}
          onRefresh={refetch}
          autoRefresh={true}
          interval={60000}
        />
      </div>
      
      <div className={styles.grid}>
        {kpiCards.map((card, index) => (
          <KPICard
            key={card.id}
            title={card.title}
            value={card.getValue()}
            change={card.getChange()}
            trend={card.getTrend()}
            icon={card.icon}
            prefix={card.prefix}
            suffix={card.suffix}
            decimals={card.decimals}
            loading={loading}
            className={`${styles.card} ${styles[`card${index + 1}`]}`}
          />
        ))}
      </div>

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando métricas...</p>
        </div>
      )}
    </div>
  );
}

export default KPIGrid;