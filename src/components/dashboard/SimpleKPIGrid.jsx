import { DollarSign, ShoppingCart, Users, Target, TrendingUp, Clock } from 'lucide-react';
import KPICard from '../ui/KPICard';
import { useKPIs } from '../../hooks/useSimpleData';
import { useSimpleDateRange } from '../../contexts/SimpleDateContext';
import styles from './KPIGrid.module.css';

function SimpleKPIGrid() {
  const { selectedPeriod, getPeriodLabel } = useSimpleDateRange();
  const { data: kpis, loading, error } = useKPIs(selectedPeriod);

  const kpiCards = [
    {
      id: 'revenue',
      title: 'Receita Total',
      icon: DollarSign,
      prefix: 'R$ ',
      decimals: 0,
      getValue: () => kpis?.revenue?.current || 2847392,
      getChange: () => kpis?.revenue?.change || 12.5,
      getTrend: () => 'up'
    },
    {
      id: 'orders',
      title: 'Pedidos',
      icon: ShoppingCart,
      decimals: 0,
      getValue: () => kpis?.orders?.current || 18432,
      getChange: () => kpis?.orders?.change || 8.2,
      getTrend: () => 'up'
    },
    {
      id: 'users',
      title: 'Usuários Ativos',
      icon: Users,
      decimals: 0,
      getValue: () => kpis?.users?.current || 45678,
      getChange: () => kpis?.users?.change || 15.1,
      getTrend: () => 'up'
    },
    {
      id: 'conversionRate',
      title: 'Taxa de Conversão',
      icon: Target,
      suffix: '%',
      decimals: 2,
      getValue: () => kpis?.conversionRate?.current || 3.24,
      getChange: () => kpis?.conversionRate?.change || -0.3,
      getTrend: () => 'down'
    },
    {
      id: 'averageOrder',
      title: 'Ticket Médio',
      icon: TrendingUp,
      prefix: 'R$ ',
      decimals: 2,
      getValue: () => kpis?.averageOrder?.current || 154.50,
      getChange: () => kpis?.averageOrder?.change || 3.8,
      getTrend: () => 'up'
    },
    {
      id: 'customerLifetimeValue',
      title: 'LTV do Cliente',
      icon: Clock,
      prefix: 'R$ ',
      decimals: 2,
      getValue: () => kpis?.customerLifetimeValue?.current || 890.25,
      getChange: () => kpis?.customerLifetimeValue?.change || 5.2,
      getTrend: () => 'up'
    }
  ];

  if (error) {
    return (
      <div className={styles.error}>
        <p>Erro ao carregar KPIs</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Métricas Principais</h2>
          <p className={styles.subtitle}>Resumo do desempenho - {getPeriodLabel()}</p>
        </div>
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
    </div>
  );
}

export default SimpleKPIGrid;