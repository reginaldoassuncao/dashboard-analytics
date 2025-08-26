import { useState, useMemo, useCallback } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Eye,
  Star
} from 'lucide-react';
import styles from './DataTable.module.css';

function DataTable({ 
  data = [], 
  columns = [], 
  loading = false,
  searchPlaceholder = "Buscar...",
  title = "Tabela de Dados",
  subtitle = "",
  pageSize = 10,
  showSearch = true,
  showFilters = true,
  showPagination = true
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Filter data based on search term
  const searchedData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => {
      return columns.some(column => {
        const value = row[column.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Apply filters
  const filteredData = useMemo(() => {
    let filtered = searchedData;
    
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(row => row[key] === value);
      }
    });
    
    return filtered;
  }, [searchedData, selectedFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, sortedData.length);

  // Handle sorting
  const handleSort = useCallback((columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Get unique values for filter options
  const getFilterOptions = useCallback((columnKey) => {
    const uniqueValues = [...new Set(data.map(row => row[columnKey]))];
    return uniqueValues.filter(value => value !== null && value !== undefined);
  }, [data]);

  // Format cell value
  const formatCellValue = useCallback((value, column) => {
    if (value === null || value === undefined) return '-';
    
    if (column.format === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    
    if (column.format === 'number') {
      return new Intl.NumberFormat('pt-BR').format(value);
    }
    
    if (column.format === 'date') {
      return new Date(value).toLocaleDateString('pt-BR');
    }
    
    if (column.format === 'percentage') {
      return `${value}%`;
    }
    
    return value;
  }, []);

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'ativo':
        return styles.statusActive;
      case 'inactive':
      case 'inativo':
        return styles.statusInactive;
      case 'out-of-stock':
      case 'sem estoque':
        return styles.statusOutOfStock;
      default:
        return styles.statusDefault;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSkeleton}></div>
          <div className={styles.controlsSkeleton}></div>
        </div>
        <div className={styles.tableSkeleton}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando tabela...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        
        <div className={styles.controls}>
          {showSearch && (
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          )}
          
          {showFilters && (
            <button
              className={`${styles.filterButton} ${showFiltersPanel ? styles.active : ''}`}
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            >
              <Filter size={16} />
              Filtros
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFiltersPanel && showFilters && (
        <div className={styles.filtersPanel}>
          {columns
            .filter(col => col.filterable)
            .map(column => (
              <div key={column.key} className={styles.filterGroup}>
                <label className={styles.filterLabel}>{column.label}</label>
                <select
                  value={selectedFilters[column.key] || 'all'}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">Todos</option>
                  {getFilterOptions(column.key).map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
      )}

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`${styles.tableHeader} ${column.sortable ? styles.sortable : ''}`}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className={styles.headerContent}>
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className={styles.sortIcons}>
                        <ChevronUp 
                          size={12} 
                          className={`${styles.sortIcon} ${
                            sortColumn === column.key && sortDirection === 'asc' ? styles.active : ''
                          }`}
                        />
                        <ChevronDown 
                          size={12} 
                          className={`${styles.sortIcon} ${
                            sortColumn === column.key && sortDirection === 'desc' ? styles.active : ''
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className={styles.tableRow}>
                  {columns.map(column => (
                    <td key={column.key} className={styles.tableCell}>
                      {column.key === 'status' ? (
                        <span className={`${styles.statusBadge} ${getStatusClass(row[column.key])}`}>
                          {row[column.key]}
                        </span>
                      ) : column.key === 'rating' ? (
                        <div className={styles.rating}>
                          <Star size={14} className={styles.starIcon} />
                          {formatCellValue(row[column.key], column)}
                        </div>
                      ) : (
                        formatCellValue(row[column.key], column)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.emptyState}>
                  <div className={styles.emptyContent}>
                    <Eye size={48} className={styles.emptyIcon} />
                    <h3>Nenhum resultado encontrado</h3>
                    <p>Tente ajustar seus filtros ou termo de busca</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Mostrando {startItem} a {endItem} de {sortedData.length} resultados
          </div>
          
          <div className={styles.paginationControls}>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>
            
            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageButton} ${
                      pageNum === currentPage ? styles.active : ''
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              Próximo
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;