import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  AlertCircle, 
  Package, 
  DollarSign, 
  Tag,
  FileText,
  BarChart3,
  Image,
  Truck
} from 'lucide-react';
import { useProducts } from '../contexts/ProductsContext';
import { PRODUCT_CATEGORIES, PRODUCT_STATUS } from '../services/productsService';
import { 
  validateForm, 
  getProductValidationRules,
  validateCostVsPrice,
  validateMinStockVsStock 
} from '../utils/validators';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import styles from './ProductForm.module.css';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createProduct, updateProduct, getProduct, loading } = useProducts();
  
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    cost: '',
    sku: '',
    stock: '',
    minStock: '',
    maxStock: '',
    status: PRODUCT_STATUS.ACTIVE,
    tags: [],
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    }
  });
  
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({});
  const [newTag, setNewTag] = useState('');

  // Load product data for editing
  useEffect(() => {
    if (isEditMode) {
      const product = getProduct(id);
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          category: product.category || '',
          price: product.price?.toString() || '',
          cost: product.cost?.toString() || '',
          sku: product.sku || '',
          stock: product.stock?.toString() || '',
          minStock: product.minStock?.toString() || '',
          maxStock: product.maxStock?.toString() || '',
          status: product.status || PRODUCT_STATUS.ACTIVE,
          tags: product.tags || [],
          weight: product.weight?.toString() || '',
          dimensions: {
            length: product.dimensions?.length?.toString() || '',
            width: product.dimensions?.width?.toString() || '',
            height: product.dimensions?.height?.toString() || ''
          }
        });
      } else {
        navigate('/products');
      }
    }
  }, [id, isEditMode, getProduct, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle tag operations
  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'newTag') {
      e.preventDefault();
      addTag();
    }
  };

  // Validate form
  const validateFormData = () => {
    const rules = getProductValidationRules(PRODUCT_CATEGORIES);
    const { isValid, errors: validationErrors } = validateForm(formData, rules);
    
    // Additional cross-field validations
    const costVsPriceError = validateCostVsPrice(formData.cost, formData.price);
    if (costVsPriceError) {
      validationErrors.cost = costVsPriceError;
    }
    
    const minStockError = validateMinStockVsStock(formData.minStock, formData.stock);
    if (minStockError) {
      validationErrors.minStock = minStockError;
    }
    
    return {
      isValid: isValid && !costVsPriceError && !minStockError,
      errors: validationErrors
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateFormData();
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setSaving(true);
    setErrors({});
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost || 0),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock || 0),
        maxStock: parseInt(formData.maxStock || 100),
        weight: parseFloat(formData.weight || 0),
        dimensions: {
          length: parseFloat(formData.dimensions.length || 0),
          width: parseFloat(formData.dimensions.width || 0),
          height: parseFloat(formData.dimensions.height || 0)
        }
      };

      let result;
      if (isEditMode) {
        result = await updateProduct(id, productData);
      } else {
        result = await createProduct(productData);
      }

      if (result.success) {
        navigate('/products', { 
          state: { 
            message: result.message,
            type: 'success'
          } 
        });
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ general: 'Erro inesperado. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Deseja cancelar? Todas as alterações serão perdidas.')) {
      navigate('/products');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <p>Carregando produto...</p>
      </div>
    );
  }

  return (
    <div className={styles.productForm}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>
              <Package size={24} />
              {isEditMode ? 'Editar Produto' : 'Novo Produto'}
            </h1>
            <p className={styles.subtitle}>
              {isEditMode 
                ? 'Modifique as informações do produto abaixo'
                : 'Preencha as informações para criar um novo produto'
              }
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={saving}
            >
              <X size={20} />
              Cancelar
            </button>
            <button
              type="submit"
              form="product-form"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? (
                <>
                  <LoadingSpinner size="small" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isEditMode ? 'Salvar Alterações' : 'Criar Produto'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className={styles.generalError}>
          <AlertCircle size={20} />
          <span>{errors.general}</span>
        </div>
      )}

      <form id="product-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Basic Information */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText size={20} />
              <h2>Informações Básicas</h2>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nome do Produto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Ex: iPhone 15 Pro Max"
                disabled={saving}
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Descrição *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                placeholder="Descreva as características principais do produto..."
                rows={4}
                disabled={saving}
              />
              {errors.description && (
                <span className={styles.errorText}>{errors.description}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>
                  Categoria *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                  disabled={saving}
                >
                  <option value="">Selecione uma categoria</option>
                  {PRODUCT_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className={styles.errorText}>{errors.category}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status" className={styles.label}>
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={saving}
                >
                  <option value={PRODUCT_STATUS.ACTIVE}>Ativo</option>
                  <option value={PRODUCT_STATUS.INACTIVE}>Inativo</option>
                  <option value={PRODUCT_STATUS.DRAFT}>Rascunho</option>
                  <option value={PRODUCT_STATUS.DISCONTINUED}>Descontinuado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <DollarSign size={20} />
              <h2>Preços</h2>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>
                  Preço de Venda *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={saving}
                />
                {errors.price && (
                  <span className={styles.errorText}>{errors.price}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cost" className={styles.label}>
                  Custo
                </label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.cost ? styles.inputError : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={saving}
                />
                {errors.cost && (
                  <span className={styles.errorText}>{errors.cost}</span>
                )}
              </div>
            </div>

            {formData.price && formData.cost && (
              <div className={styles.marginInfo}>
                <span>
                  Margem: {((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.price) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Inventory */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <BarChart3 size={20} />
              <h2>Estoque</h2>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="sku" className={styles.label}>
                  SKU
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.sku ? styles.inputError : ''}`}
                  placeholder="Ex: IPH-15-PM-256"
                  disabled={saving}
                />
                {errors.sku && (
                  <span className={styles.errorText}>{errors.sku}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="stock" className={styles.label}>
                  Estoque Atual *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.stock ? styles.inputError : ''}`}
                  placeholder="0"
                  min="0"
                  disabled={saving}
                />
                {errors.stock && (
                  <span className={styles.errorText}>{errors.stock}</span>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="minStock" className={styles.label}>
                  Estoque Mínimo
                </label>
                <input
                  type="number"
                  id="minStock"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.minStock ? styles.inputError : ''}`}
                  placeholder="0"
                  min="0"
                  disabled={saving}
                />
                {errors.minStock && (
                  <span className={styles.errorText}>{errors.minStock}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="maxStock" className={styles.label}>
                  Estoque Máximo
                </label>
                <input
                  type="number"
                  id="maxStock"
                  name="maxStock"
                  value={formData.maxStock}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="100"
                  min="0"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Physical Properties */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Truck size={20} />
              <h2>Propriedades Físicas</h2>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="weight" className={styles.label}>
                Peso (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.weight ? styles.inputError : ''}`}
                placeholder="0.0"
                step="0.01"
                min="0"
                disabled={saving}
              />
              {errors.weight && (
                <span className={styles.errorText}>{errors.weight}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="dimensions.length" className={styles.label}>
                  Comprimento (cm)
                </label>
                <input
                  type="number"
                  id="dimensions.length"
                  name="dimensions.length"
                  value={formData.dimensions.length}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  disabled={saving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dimensions.width" className={styles.label}>
                  Largura (cm)
                </label>
                <input
                  type="number"
                  id="dimensions.width"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  disabled={saving}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dimensions.height" className={styles.label}>
                  Altura (cm)
                </label>
                <input
                  type="number"
                  id="dimensions.height"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Tag size={20} />
              <h2>Tags</h2>
            </div>
            
            <div className={styles.tagsContainer}>
              <div className={styles.tagsList}>
                {formData.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className={styles.tagRemove}
                      disabled={saving}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className={styles.tagInput}>
                <input
                  type="text"
                  name="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={styles.input}
                  placeholder="Adicionar tag..."
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className={styles.addTagButton}
                  disabled={saving || !newTag.trim()}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;