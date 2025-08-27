// Products Service - CRUD Operations with localStorage
// Manages product data persistence and business logic

const STORAGE_KEY = 'dashboard_products';
const PRODUCTS_VERSION = '1.0';

// Product categories available in the system
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion', 
  'Home & Garden',
  'Sports',
  'Books',
  'Beauty',
  'Automotive',
  'Health',
  'Toys',
  'Food'
];

// Product status options
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive', 
  DRAFT: 'draft',
  DISCONTINUED: 'discontinued'
};

class ProductsService {
  constructor() {
    this.products = [];
    this.initialized = false;
  }

  // Initialize with sample data if localStorage is empty
  async initialize() {
    if (this.initialized) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        const data = JSON.parse(stored);
        this.products = data.products || [];
      } else {
        // Create initial sample products
        this.products = this.generateSampleProducts();
        await this.saveToStorage();
      }
    } catch (error) {
      console.error('Error initializing products:', error);
      this.products = this.generateSampleProducts();
      await this.saveToStorage();
    }

    this.initialized = true;
  }

  // Generate sample products for demo
  generateSampleProducts() {
    const sampleProducts = [
      {
        id: this.generateId(),
        name: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with advanced camera system and A17 Pro chip',
        category: 'Electronics',
        price: 1199.99,
        cost: 800.00,
        sku: 'IPH-15-PM-256',
        stock: 45,
        minStock: 10,
        maxStock: 100,
        status: PRODUCT_STATUS.ACTIVE,
        tags: ['apple', 'smartphone', 'premium'],
        images: ['https://via.placeholder.com/300x300?text=iPhone+15+Pro'],
        weight: 0.221,
        dimensions: { length: 15.9, width: 7.69, height: 0.83 },
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString(),
        createdBy: 1,
        updatedBy: 1
      },
      {
        id: this.generateId(),
        name: 'Nike Air Jordan 1',
        description: 'Classic basketball sneakers with premium leather construction',
        category: 'Fashion',
        price: 170.00,
        cost: 85.00,
        sku: 'NIKE-AJ1-BRW-42',
        stock: 28,
        minStock: 15,
        maxStock: 80,
        status: PRODUCT_STATUS.ACTIVE,
        tags: ['nike', 'sneakers', 'basketball'],
        images: ['https://via.placeholder.com/300x300?text=Air+Jordan+1'],
        weight: 0.8,
        dimensions: { length: 32, width: 20, height: 12 },
        createdAt: new Date('2024-01-20').toISOString(),
        updatedAt: new Date('2024-01-20').toISOString(),
        createdBy: 1,
        updatedBy: 1
      },
      {
        id: this.generateId(),
        name: 'Samsung 55" 4K Smart TV',
        description: 'Crystal UHD 4K Smart TV with Tizen OS and HDR10+ support',
        category: 'Electronics',
        price: 799.99,
        cost: 500.00,
        sku: 'SAM-55-4K-CU8000',
        stock: 12,
        minStock: 5,
        maxStock: 30,
        status: PRODUCT_STATUS.ACTIVE,
        tags: ['samsung', 'tv', '4k', 'smart'],
        images: ['https://via.placeholder.com/300x300?text=Samsung+TV'],
        weight: 15.5,
        dimensions: { length: 123.1, width: 70.7, height: 5.9 },
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-02-01').toISOString(),
        createdBy: 1,
        updatedBy: 1
      },
      {
        id: this.generateId(),
        name: 'Ergonomic Office Chair',
        description: 'High-back mesh office chair with lumbar support and adjustable arms',
        category: 'Home & Garden',
        price: 299.99,
        cost: 150.00,
        sku: 'OFF-CHAIR-ERG-BLK',
        stock: 18,
        minStock: 8,
        maxStock: 40,
        status: PRODUCT_STATUS.ACTIVE,
        tags: ['office', 'chair', 'ergonomic', 'furniture'],
        images: ['https://via.placeholder.com/300x300?text=Office+Chair'],
        weight: 18.2,
        dimensions: { length: 66, width: 66, height: 114 },
        createdAt: new Date('2024-02-10').toISOString(),
        updatedAt: new Date('2024-02-10').toISOString(),
        createdBy: 1,
        updatedBy: 1
      },
      {
        id: this.generateId(),
        name: 'Wireless Gaming Headset',
        description: '7.1 surround sound gaming headset with noise cancellation',
        category: 'Electronics',
        price: 129.99,
        cost: 65.00,
        sku: 'GAME-HEAD-WL-RGB',
        stock: 35,
        minStock: 20,
        maxStock: 60,
        status: PRODUCT_STATUS.ACTIVE,
        tags: ['gaming', 'headset', 'wireless', 'rgb'],
        images: ['https://via.placeholder.com/300x300?text=Gaming+Headset'],
        weight: 0.32,
        dimensions: { length: 19, width: 17, height: 9 },
        createdAt: new Date('2024-02-15').toISOString(),
        updatedAt: new Date('2024-02-15').toISOString(),
        createdBy: 1,
        updatedBy: 1
      }
    ];

    return sampleProducts;
  }

  // Generate unique ID
  generateId() {
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate SKU automatically
  generateSKU(name, category) {
    const categoryCode = category.substring(0, 3).toUpperCase();
    const nameCode = name.split(' ')
      .map(word => word.substring(0, 2).toUpperCase())
      .join('')
      .substring(0, 6);
    const timestamp = Date.now().toString().slice(-4);
    
    return `${categoryCode}-${nameCode}-${timestamp}`;
  }

  // Save to localStorage
  async saveToStorage() {
    try {
      const data = {
        version: PRODUCTS_VERSION,
        products: this.products,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving products to storage:', error);
      throw new Error('Failed to save products');
    }
  }

  // Simulate API delay for realistic UX
  async simulateDelay(min = 300, max = 800) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Validate product data
  validateProduct(productData) {
    const errors = {};

    if (!productData.name || productData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!productData.description || productData.description.trim().length < 10) {
      errors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }

    if (!productData.category || !PRODUCT_CATEGORIES.includes(productData.category)) {
      errors.category = 'Categoria inválida';
    }

    const price = parseFloat(productData.price);
    if (isNaN(price) || price <= 0) {
      errors.price = 'Preço deve ser um número positivo';
    }

    const cost = parseFloat(productData.cost || 0);
    if (isNaN(cost) || cost < 0) {
      errors.cost = 'Custo deve ser um número não-negativo';
    }

    if (cost > 0 && price > 0 && cost >= price) {
      errors.cost = 'Custo deve ser menor que o preço';
    }

    const stock = parseInt(productData.stock);
    if (isNaN(stock) || stock < 0) {
      errors.stock = 'Estoque deve ser um número não-negativo';
    }

    const minStock = parseInt(productData.minStock || 0);
    if (isNaN(minStock) || minStock < 0) {
      errors.minStock = 'Estoque mínimo deve ser um número não-negativo';
    }

    if (minStock > stock) {
      errors.minStock = 'Estoque mínimo não pode ser maior que o estoque atual';
    }

    if (!productData.status || !Object.values(PRODUCT_STATUS).includes(productData.status)) {
      errors.status = 'Status inválido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Get all products
  async getAllProducts() {
    await this.initialize();
    await this.simulateDelay();
    return [...this.products];
  }

  // Get product by ID
  async getProductById(id) {
    await this.initialize();
    await this.simulateDelay(100, 300);
    
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }
    
    return { ...product };
  }

  // Create new product
  async createProduct(productData) {
    await this.initialize();
    await this.simulateDelay();

    const validation = this.validateProduct(productData);
    if (!validation.isValid) {
      throw new Error(`Dados inválidos: ${Object.values(validation.errors).join(', ')}`);
    }

    // Check for duplicate SKU
    if (productData.sku) {
      const existingSKU = this.products.find(p => 
        p.sku.toLowerCase() === productData.sku.toLowerCase()
      );
      if (existingSKU) {
        throw new Error('SKU já existe no sistema');
      }
    }

    const newProduct = {
      id: this.generateId(),
      name: productData.name.trim(),
      description: productData.description.trim(),
      category: productData.category,
      price: parseFloat(productData.price),
      cost: parseFloat(productData.cost || 0),
      sku: productData.sku || this.generateSKU(productData.name, productData.category),
      stock: parseInt(productData.stock),
      minStock: parseInt(productData.minStock || 0),
      maxStock: parseInt(productData.maxStock || 100),
      status: productData.status || PRODUCT_STATUS.ACTIVE,
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      images: Array.isArray(productData.images) ? productData.images : [],
      weight: parseFloat(productData.weight || 0),
      dimensions: productData.dimensions || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: productData.createdBy,
      updatedBy: productData.updatedBy || productData.createdBy
    };

    this.products.push(newProduct);
    await this.saveToStorage();

    return { ...newProduct };
  }

  // Update existing product
  async updateProduct(id, productData) {
    await this.initialize();
    await this.simulateDelay();

    const existingIndex = this.products.findIndex(p => p.id === id);
    if (existingIndex === -1) {
      throw new Error('Produto não encontrado');
    }

    const validation = this.validateProduct(productData);
    if (!validation.isValid) {
      throw new Error(`Dados inválidos: ${Object.values(validation.errors).join(', ')}`);
    }

    // Check for duplicate SKU (excluding current product)
    if (productData.sku) {
      const existingSKU = this.products.find(p => 
        p.id !== id && p.sku.toLowerCase() === productData.sku.toLowerCase()
      );
      if (existingSKU) {
        throw new Error('SKU já existe no sistema');
      }
    }

    const existing = this.products[existingIndex];
    const updatedProduct = {
      ...existing,
      name: productData.name.trim(),
      description: productData.description.trim(),
      category: productData.category,
      price: parseFloat(productData.price),
      cost: parseFloat(productData.cost || 0),
      sku: productData.sku || existing.sku,
      stock: parseInt(productData.stock),
      minStock: parseInt(productData.minStock || 0),
      maxStock: parseInt(productData.maxStock || 100),
      status: productData.status || existing.status,
      tags: Array.isArray(productData.tags) ? productData.tags : existing.tags,
      images: Array.isArray(productData.images) ? productData.images : existing.images,
      weight: parseFloat(productData.weight || 0),
      dimensions: productData.dimensions || existing.dimensions,
      updatedAt: new Date().toISOString(),
      updatedBy: productData.updatedBy
    };

    this.products[existingIndex] = updatedProduct;
    await this.saveToStorage();

    return { ...updatedProduct };
  }

  // Delete product
  async deleteProduct(id) {
    await this.initialize();
    await this.simulateDelay(200, 500);

    const existingIndex = this.products.findIndex(p => p.id === id);
    if (existingIndex === -1) {
      throw new Error('Produto não encontrado');
    }

    this.products.splice(existingIndex, 1);
    await this.saveToStorage();

    return { success: true, message: 'Produto removido com sucesso' };
  }

  // Get products by category
  async getProductsByCategory(category) {
    await this.initialize();
    await this.simulateDelay(200, 400);

    return this.products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search products
  async searchProducts(searchTerm) {
    await this.initialize();
    await this.simulateDelay(300, 600);

    const term = searchTerm.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term) ||
      product.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  // Get low stock products
  async getLowStockProducts() {
    await this.initialize();
    await this.simulateDelay(200, 400);

    return this.products.filter(p => p.stock <= p.minStock);
  }

  // Clear all products (for testing)
  async clearAllProducts() {
    this.products = [];
    await this.saveToStorage();
    return { success: true, message: 'Todos os produtos foram removidos' };
  }

  // Import products (bulk create)
  async importProducts(productsData) {
    await this.initialize();
    await this.simulateDelay(1000, 2000);

    const results = {
      success: [],
      errors: []
    };

    for (const productData of productsData) {
      try {
        const newProduct = await this.createProduct(productData);
        results.success.push(newProduct);
      } catch (error) {
        results.errors.push({
          product: productData,
          error: error.message
        });
      }
    }

    return results;
  }
}

// Create singleton instance
export const productsService = new ProductsService();

// Helper functions
export const getAllProducts = () => productsService.getAllProducts();
export const getProductById = (id) => productsService.getProductById(id);
export const createProduct = (data) => productsService.createProduct(data);
export const updateProduct = (id, data) => productsService.updateProduct(id, data);
export const deleteProduct = (id) => productsService.deleteProduct(id);