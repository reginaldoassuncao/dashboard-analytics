import { createContext, useContext, useState, useEffect } from 'react';
import { productsService } from '../services/productsService';
import { useAuth } from './AuthContext';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // name, price, createdAt
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const { user } = useAuth();

  // Initialize products from localStorage
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const savedProducts = await productsService.getAllProducts();
        setProducts(savedProducts || []);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Erro ao carregar produtos');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Get filtered and sorted products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'price':
          valueA = parseFloat(a.price);
          valueB = parseFloat(b.price);
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
          break;
        case 'name':
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
      }

      if (sortOrder === 'desc') {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    });

    return filtered;
  };

  // Get unique categories
  const getCategories = () => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories.sort();
  };

  // Get product statistics
  const getStats = () => {
    const total = products.length;
    const totalValue = products.reduce((sum, product) => sum + (parseFloat(product.price) * product.stock), 0);
    const categories = getCategories().length;
    const lowStock = products.filter(p => p.stock <= p.minStock).length;
    const activeProducts = products.filter(p => p.status === 'active').length;

    return {
      total,
      totalValue,
      categories,
      lowStock,
      activeProducts,
      averagePrice: total > 0 ? totalValue / total : 0
    };
  };

  // CRUD Operations
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);

      const newProduct = await productsService.createProduct({
        ...productData,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setProducts(prev => [...prev, newProduct]);
      
      return { 
        success: true, 
        product: newProduct,
        message: 'Produto criado com sucesso!' 
      };
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);

      const updatedProduct = await productsService.updateProduct(id, {
        ...productData,
        updatedBy: user?.id,
        updatedAt: new Date().toISOString()
      });

      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );

      return { 
        success: true, 
        product: updatedProduct,
        message: 'Produto atualizado com sucesso!' 
      };
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await productsService.deleteProduct(id);
      
      setProducts(prev => prev.filter(product => product.id !== id));

      return { 
        success: true,
        message: 'Produto removido com sucesso!' 
      };
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  const getProduct = (id) => {
    return products.find(product => product.id === id);
  };

  // Bulk operations
  const bulkDelete = async (ids) => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all(ids.map(id => productsService.deleteProduct(id)));
      
      setProducts(prev => prev.filter(product => !ids.includes(product.id)));

      return { 
        success: true,
        message: `${ids.length} produtos removidos com sucesso!` 
      };
    } catch (err) {
      console.error('Error bulk deleting products:', err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdateStatus = async (ids, status) => {
    try {
      setLoading(true);
      setError(null);

      const updates = await Promise.all(
        ids.map(id => productsService.updateProduct(id, { 
          status,
          updatedBy: user?.id,
          updatedAt: new Date().toISOString()
        }))
      );

      setProducts(prev => 
        prev.map(product => {
          const update = updates.find(u => u.id === product.id);
          return update || product;
        })
      );

      return { 
        success: true,
        message: `Status de ${ids.length} produtos atualizado!` 
      };
    } catch (err) {
      console.error('Error bulk updating status:', err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const value = {
    // Data
    products,
    filteredProducts: getFilteredProducts(),
    categories: getCategories(),
    stats: getStats(),
    
    // State
    loading,
    error,
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder,
    
    // Actions
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    bulkDelete,
    bulkUpdateStatus,
    
    // Filters
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    setSortOrder,
    clearFilters,
    
    // Utils
    setError: (error) => setError(error),
    clearError: () => setError(null)
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}

// Helper hook for single product operations
export function useProduct(id) {
  const { getProduct, updateProduct, deleteProduct } = useProducts();
  
  const product = getProduct(id);
  
  return {
    product,
    update: (data) => updateProduct(id, data),
    delete: () => deleteProduct(id),
    exists: !!product
  };
}