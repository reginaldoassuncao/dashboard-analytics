// Validation utilities for forms and data
// Provides consistent validation logic across the application

// Required field validator
export const validateRequired = (value, fieldName = 'Campo') => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return `${fieldName} é obrigatório`;
  }
  return null;
};

// String length validator
export const validateLength = (value, min, max, fieldName = 'Campo') => {
  if (!value) return null; // Let required validator handle empty values
  
  const length = typeof value === 'string' ? value.trim().length : 0;
  
  if (min && length < min) {
    return `${fieldName} deve ter pelo menos ${min} caracteres`;
  }
  
  if (max && length > max) {
    return `${fieldName} deve ter no máximo ${max} caracteres`;
  }
  
  return null;
};

// Email validator
export const validateEmail = (email, fieldName = 'Email') => {
  if (!email) return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return `${fieldName} deve ter um formato válido`;
  }
  
  return null;
};

// Number validator
export const validateNumber = (value, fieldName = 'Campo') => {
  if (!value && value !== 0) return null;
  
  const num = parseFloat(value);
  if (isNaN(num)) {
    return `${fieldName} deve ser um número válido`;
  }
  
  return null;
};

// Positive number validator
export const validatePositiveNumber = (value, fieldName = 'Campo') => {
  const numberError = validateNumber(value, fieldName);
  if (numberError) return numberError;
  
  if (!value && value !== 0) return null;
  
  const num = parseFloat(value);
  if (num < 0) {
    return `${fieldName} deve ser um número positivo`;
  }
  
  return null;
};

// Integer validator
export const validateInteger = (value, fieldName = 'Campo') => {
  if (!value && value !== 0) return null;
  
  const num = parseInt(value);
  if (isNaN(num) || num !== parseFloat(value)) {
    return `${fieldName} deve ser um número inteiro`;
  }
  
  return null;
};

// Price validator (allows decimals, must be positive)
export const validatePrice = (value, fieldName = 'Preço') => {
  if (!value && value !== 0) return null;
  
  const num = parseFloat(value);
  if (isNaN(num)) {
    return `${fieldName} deve ser um número válido`;
  }
  
  if (num <= 0) {
    return `${fieldName} deve ser maior que zero`;
  }
  
  // Check for too many decimal places
  const decimalPlaces = (value.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return `${fieldName} deve ter no máximo 2 casas decimais`;
  }
  
  return null;
};

// SKU validator (alphanumeric with hyphens)
export const validateSKU = (sku, fieldName = 'SKU') => {
  if (!sku) return null;
  
  const skuRegex = /^[A-Z0-9\-]{3,20}$/i;
  if (!skuRegex.test(sku)) {
    return `${fieldName} deve conter apenas letras, números e hífens (3-20 caracteres)`;
  }
  
  return null;
};

// URL validator
export const validateURL = (url, fieldName = 'URL') => {
  if (!url) return null;
  
  try {
    new URL(url);
    return null;
  } catch {
    return `${fieldName} deve ser uma URL válida`;
  }
};

// Array validator
export const validateArray = (value, minLength = 0, maxLength = null, fieldName = 'Lista') => {
  if (!Array.isArray(value)) {
    return `${fieldName} deve ser uma lista válida`;
  }
  
  if (minLength && value.length < minLength) {
    return `${fieldName} deve ter pelo menos ${minLength} item${minLength > 1 ? 's' : ''}`;
  }
  
  if (maxLength && value.length > maxLength) {
    return `${fieldName} deve ter no máximo ${maxLength} item${maxLength > 1 ? 's' : ''}`;
  }
  
  return null;
};

// Product-specific validators
export const validateProductName = (name) => {
  const requiredError = validateRequired(name, 'Nome do produto');
  if (requiredError) return requiredError;
  
  return validateLength(name, 2, 100, 'Nome do produto');
};

export const validateProductDescription = (description) => {
  const requiredError = validateRequired(description, 'Descrição');
  if (requiredError) return requiredError;
  
  return validateLength(description, 10, 1000, 'Descrição');
};

export const validateProductPrice = (price) => {
  const requiredError = validateRequired(price, 'Preço');
  if (requiredError) return requiredError;
  
  return validatePrice(price, 'Preço');
};

export const validateProductStock = (stock) => {
  const requiredError = validateRequired(stock, 'Estoque');
  if (requiredError) return requiredError;
  
  const integerError = validateInteger(stock, 'Estoque');
  if (integerError) return integerError;
  
  const num = parseInt(stock);
  if (num < 0) {
    return 'Estoque não pode ser negativo';
  }
  
  return null;
};

export const validateProductCategory = (category, availableCategories = []) => {
  const requiredError = validateRequired(category, 'Categoria');
  if (requiredError) return requiredError;
  
  if (availableCategories.length > 0 && !availableCategories.includes(category)) {
    return 'Categoria selecionada é inválida';
  }
  
  return null;
};

// Form validator - validates entire object
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  }
  
  return { isValid, errors };
};

// Product form validation rules
export const getProductValidationRules = (availableCategories = []) => ({
  name: [validateProductName],
  description: [validateProductDescription],
  category: [
    (value) => validateProductCategory(value, availableCategories)
  ],
  price: [validateProductPrice],
  cost: [
    (value) => value ? validatePositiveNumber(value, 'Custo') : null
  ],
  stock: [validateProductStock],
  minStock: [
    (value) => value ? validateInteger(value, 'Estoque mínimo') : null,
    (value) => value ? validatePositiveNumber(value, 'Estoque mínimo') : null
  ],
  sku: [
    (value) => value ? validateSKU(value) : null
  ],
  weight: [
    (value) => value ? validatePositiveNumber(value, 'Peso') : null
  ]
});

// Real-time field validation (debounced)
export const createFieldValidator = (validationRules, debounceMs = 300) => {
  const timeouts = {};
  
  return (field, value, callback) => {
    // Clear existing timeout for this field
    if (timeouts[field]) {
      clearTimeout(timeouts[field]);
    }
    
    // Set new timeout
    timeouts[field] = setTimeout(() => {
      const rules = validationRules[field];
      if (!rules) {
        callback(field, null);
        return;
      }
      
      let error = null;
      for (const rule of rules) {
        error = rule(value);
        if (error) break;
      }
      
      callback(field, error);
    }, debounceMs);
  };
};

// Validation helpers for complex scenarios
export const validateDependentFields = (data, dependencies) => {
  const errors = {};
  
  for (const [field, dependency] of Object.entries(dependencies)) {
    const { dependsOn, condition, message } = dependency;
    
    if (condition(data[field], data[dependsOn])) {
      errors[field] = message;
    }
  }
  
  return errors;
};

// Example: Cost should be less than price
export const validateCostVsPrice = (cost, price) => {
  if (!cost || !price) return null;
  
  const costNum = parseFloat(cost);
  const priceNum = parseFloat(price);
  
  if (!isNaN(costNum) && !isNaN(priceNum) && costNum >= priceNum) {
    return 'Custo deve ser menor que o preço de venda';
  }
  
  return null;
};

// Example: Min stock should be less than current stock
export const validateMinStockVsStock = (minStock, stock) => {
  if (!minStock || !stock) return null;
  
  const minNum = parseInt(minStock);
  const stockNum = parseInt(stock);
  
  if (!isNaN(minNum) && !isNaN(stockNum) && minNum > stockNum) {
    return 'Estoque mínimo não pode ser maior que o estoque atual';
  }
  
  return null;
};