import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MoreVertical
} from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import { PRODUCT_CATEGORIES } from '../../services/productsService';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from './ProductsList.module.css';

function ProductsList() {
  const navigate = useNavigate();
  const {
    filteredProducts,
    categories,
    stats,
    loading,
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder,
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    setSortOrder,
    deleteProduct,
    clearFilters
  } = useProducts();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Handle product selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle product actions
  const handleCreateProduct = () => {
    navigate('/products/new');
  };

  const handleEditProduct = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja remover este produto?')) {
      setDeletingId(productId);
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          setSelectedProducts(prev => prev.filter(id => id !== productId));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Get stock status
  const getStockStatus = (product) => {
    if (product.stock === 0) {
      return { status: 'out', label: 'Sem estoque', color: 'danger' };
    } else if (product.stock <= product.minStock) {
      return { status: 'low', label: 'Estoque baixo', color: 'warning' };
    } else {
      return { status: 'ok', label: 'Em estoque', color: 'success' };
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Ativo', color: 'success' },
      inactive: { label: 'Inativo', color: 'gray' },
      draft: { label: 'Rascunho', color: 'warning' },
      discontinued: { label: 'Descontinuado', color: 'danger' }
    };
    
    return badges[status] || badges.active;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className={styles.productsList}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>
              <Package size={24} />
              Produtos
              <span className={styles.count}>({stats.total})</span>
            </h1>
            <p className={styles.subtitle}>
              Gerencie seu catálogo de produtos
            </p>
          </div>
          
          <button
            onClick={handleCreateProduct}
            className={styles.createButton}
          >
            <Plus size={20} />
            Novo Produto
          </button>
        </div>

        {/* Stats Cards */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Package size={20} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.total}</div>
              <div className={styles.statLabel}>Total de Produtos</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {formatCurrency(stats.totalValue)}
              </div>
              <div className={styles.statLabel}>Valor Total</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <AlertTriangle size={20} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.lowStock}</div>
              <div className={styles.statLabel}>Estoque Baixo</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Eye size={20} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.activeProducts}</div>
              <div className={styles.statLabel}>Ativos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produtos por nome, descrição, SKU ou tags..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterActions}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
          >
            <Filter size={20} />
            Filtros
          </button>
          
          {(searchTerm || selectedCategory !== 'all') && (
            <button
              onClick={clearFilters}
              className={styles.clearButton}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className={styles.advancedFilters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Categoria:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="name">Nome</option>
              <option value="price">Preço</option>
              <option value="createdAt">Data de Criação</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Ordem:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableContainer}>
        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <Package size={48} />
            <h3>Nenhum produto encontrado</h3>
            <p>
              {searchTerm || selectedCategory !== 'all'
                ? 'Tente ajustar os filtros para encontrar produtos.'
                : 'Comece criando seu primeiro produto.'
              }
            </p>
            <button
              onClick={handleCreateProduct}
              className={styles.emptyButton}
            >
              <Plus size={20} />
              Novo Produto
            </button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxColumn}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                  />
                </th>
                <th 
                  className={styles.sortable}
                  onClick={() => handleSort('name')}
                >
                  Produto
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? <TrendingUp size={16} /> : <TrendingDown size={16} />
                  )}
                </th>
                <th>SKU</th>
                <th>Categoria</th>
                <th 
                  className={styles.sortable}
                  onClick={() => handleSort('price')}
                >
                  Preço
                  {sortBy === 'price' && (
                    sortOrder === 'asc' ? <TrendingUp size={16} /> : <TrendingDown size={16} />
                  )}
                </th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const statusBadge = getStatusBadge(product.status);
                
                return (
                  <tr key={product.id} className={styles.tableRow}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className={styles.checkbox}
                      />
                    </td>
                    <td className={styles.productCell}>
                      <div className={styles.productInfo}>
                        <div className={styles.productImage}>
                          <Package size={24} />
                        </div>
                        <div className={styles.productDetails}>
                          <div className={styles.productName}>{product.name}</div>
                          <div className={styles.productDescription}>
                            {product.description.slice(0, 60)}
                            {product.description.length > 60 && '...'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.sku}>{product.sku}</td>
                    <td>
                      <span className={styles.category}>{product.category}</span>
                    </td>
                    <td className={styles.price}>
                      {formatCurrency(product.price)}
                    </td>
                    <td>
                      <div className={styles.stockInfo}>
                        <span className={styles.stockValue}>{product.stock}</span>
                        <span className={`${styles.stockStatus} ${styles[stockStatus.color]}`}>
                          {stockStatus.label}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[statusBadge.color]}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleEditProduct(product.id)}
                          className={styles.actionButton}
                          title="Editar produto"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className={`${styles.actionButton} ${styles.danger}`}
                          disabled={deletingId === product.id}
                          title="Remover produto"
                        >
                          {deletingId === product.id ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {filteredProducts.length > 0 && (
        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            Mostrando {filteredProducts.length} de {stats.total} produtos
            {selectedProducts.length > 0 && (
              <span className={styles.selectedInfo}>
                • {selectedProducts.length} selecionado{selectedProducts.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {selectedProducts.length > 0 && (
            <div className={styles.bulkActions}>
              <button className={styles.bulkButton}>
                Ações em lote
                <MoreVertical size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductsList;