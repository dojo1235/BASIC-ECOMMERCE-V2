import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as productModel from '../../src/models/product.model.js';
import { getAllProducts, getProductById } from '../../src/services/product.service.js';
import { AppError } from '../../src/utils/app-error.js';

// Mock product.model.js
vi.mock('../../src/models/product.model.js');

const mockProducts = [
  { id: 1, name: 'iPhone', description: 'Smartphone', price: 1000 },
  { id: 2, name: 'Laptop', description: 'Gaming laptop', price: 2000 },
];

const mockProduct = { id: 1, name: 'iPhone', description: 'Smartphone', price: 1000 };

describe('product.service.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllProducts()', () => {
    it('should return all products matching search query', async () => {
      productModel.getAllProducts.mockResolvedValue(mockProducts);

      const result = await getAllProducts({ search: 'phone' });

      expect(result).toEqual(mockProducts);
      expect(productModel.getAllProducts).toHaveBeenCalledWith({ search: 'phone' });
    });

    it('should return all products when no search query is provided', async () => {
      productModel.getAllProducts.mockResolvedValue(mockProducts);

      const result = await getAllProducts({});

      expect(result).toEqual(mockProducts);
      expect(productModel.getAllProducts).toHaveBeenCalledWith({ search: '' });
    });
  });

  describe('getProductById()', () => {
    it('should return product if found', async () => {
      productModel.getProductById.mockResolvedValue(mockProduct);

      const result = await getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(productModel.getProductById).toHaveBeenCalledWith(1);
    });

    it('should throw AppError if product not found', async () => {
      productModel.getProductById.mockResolvedValue(null);

      await expect(() => getProductById(999)).rejects.toThrowError(
        new AppError('Product not found.', 404, "NOT_FOUND")
      );

      expect(productModel.getProductById).toHaveBeenCalledWith(999);
    });
  });
});