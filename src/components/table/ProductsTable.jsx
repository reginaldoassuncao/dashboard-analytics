import DataTable from './DataTable';
import { useTopProducts } from '../../hooks/useSimpleData';

const columns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    filterable: false
  },
  {
    key: 'name',
    label: 'Produto',
    sortable: true,
    filterable: false
  },
  {
    key: 'category',
    label: 'Categoria',
    sortable: true,
    filterable: true
  },
  {
    key: 'price',
    label: 'Preço',
    sortable: true,
    filterable: false,
    format: 'currency'
  },
  {
    key: 'sales',
    label: 'Vendas',
    sortable: true,
    filterable: false,
    format: 'number'
  },
  {
    key: 'revenue',
    label: 'Receita',
    sortable: true,
    filterable: false,
    format: 'currency'
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filterable: true
  },
  {
    key: 'rating',
    label: 'Avaliação',
    sortable: true,
    filterable: false
  },
  {
    key: 'stock',
    label: 'Estoque',
    sortable: true,
    filterable: false,
    format: 'number'
  }
];

function ProductsTable() {
  const { data: products, loading, error } = useTopProducts(100);

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        background: 'white', 
        borderRadius: '12px',
        border: '1px solid var(--gray-200)' 
      }}>
        <p style={{ color: 'var(--danger-600)' }}>
          ❌ Erro ao carregar produtos: {error.message}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--primary-500)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <DataTable
      data={products || []}
      columns={columns}
      loading={loading}
      title="Produtos"
      subtitle={`${products?.length || 0} produtos cadastrados`}
      searchPlaceholder="Buscar produtos..."
      pageSize={15}
      showSearch={true}
      showFilters={true}
      showPagination={true}
    />
  );
}

export default ProductsTable;