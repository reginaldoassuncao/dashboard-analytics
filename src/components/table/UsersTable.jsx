import DataTable from './DataTable';
import { useRecentUsers } from '../../hooks/useSimpleData';

const columns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    filterable: false
  },
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    filterable: false
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    filterable: false
  },
  {
    key: 'city',
    label: 'Cidade',
    sortable: true,
    filterable: true
  },
  {
    key: 'registrationDate',
    label: 'Cadastro',
    sortable: true,
    filterable: false,
    format: 'date'
  },
  {
    key: 'lastActivity',
    label: 'Última Atividade',
    sortable: true,
    filterable: false,
    format: 'date'
  },
  {
    key: 'totalSpent',
    label: 'Total Gasto',
    sortable: true,
    filterable: false,
    format: 'currency'
  },
  {
    key: 'orderCount',
    label: 'Pedidos',
    sortable: true,
    filterable: false,
    format: 'number'
  },
  {
    key: 'source',
    label: 'Origem',
    sortable: true,
    filterable: true
  },
  {
    key: 'isActive',
    label: 'Status',
    sortable: true,
    filterable: true
  }
];

function UsersTable() {
  const { data: users, loading, error } = useRecentUsers(100);

  // Transform boolean isActive to readable status
  const transformedUsers = users?.map(user => ({
    ...user,
    isActive: user.isActive ? 'Ativo' : 'Inativo'
  }));

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
          ❌ Erro ao carregar usuários: {error.message}
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
      data={transformedUsers || []}
      columns={columns}
      loading={loading}
      title="Usuários"
      subtitle={`${users?.length || 0} usuários cadastrados`}
      searchPlaceholder="Buscar usuários..."
      pageSize={20}
      showSearch={true}
      showFilters={true}
      showPagination={true}
    />
  );
}

export default UsersTable;