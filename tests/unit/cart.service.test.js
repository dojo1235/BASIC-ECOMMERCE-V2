import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as cartModel from '../../src/models/cart.model.js';
import * as productModel from '../../src/models/product.model.js';

import {
  getCartByUserId,
  addOrIncrementCartItem,
  updateCartProductQuantity,
  removeProductFromCart,
} from '../../src/services/cart.service.js';

import { AppError } from '../../src/utils/app-error.js';

vi.mock('../../src/models/cart.model.js');
vi.mock('../../src/models/product.model.js');

const mockProduct = {
  id: 101,
  name: 'Test Product',
  stock: 5,
};

const mockCart = [
  {
    productId: 101,
    quantity: 2,
  },
];

describe('cart.service.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCartByUserId()', () => {
    it('should return the user\'s cart', async () => {
      cartModel.getCartByUserId.mockResolvedValue(mockCart);

      const result = await getCartByUserId(1);

      expect(result).toEqual(mockCart);
      expect(cartModel.getCartByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('addOrIncrementCartItem()', () => {
    it('should add item if product exists and stock is sufficient', async () => {
      productModel.getProductById.mockResolvedValue(mockProduct);
      cartModel.addOrIncrementCartItem.mockResolvedValue();

      await addOrIncrementCartItem(1, { productId: 101, quantity: 3 });

      expect(productModel.getProductById).toHaveBeenCalledWith(101);
      expect(cartModel.addOrIncrementCartItem).toHaveBeenCalledWith(1, 101, 3);
    });

    it('should throw 404 if product not found', async () => {
      productModel.getProductById.mockResolvedValue(null);

      await expect(() =>
        addOrIncrementCartItem(1, { productId: 999, quantity: 1 })
      ).rejects.toThrowError(new AppError("Product not found.", 404, "NOT_FOUND"));
    });

    it('should throw 409 if quantity exceeds stock', async () => {
      productModel.getProductById.mockResolvedValue({ ...mockProduct, stock: 2 });

      await expect(() =>
        addOrIncrementCartItem(1, { productId: 101, quantity: 5 })
      ).rejects.toThrowError(new AppError("Not enough stock.", 409, "CONFLICT"));
    });
  });

  describe('updateCartProductQuantity()', () => {
    it('should update quantity if product exists and has enough stock', async () => {
      productModel.getProductById.mockResolvedValue(mockProduct);
      cartModel.updateCartProductQuantity.mockResolvedValue();

      await updateCartProductQuantity(1, { productId: 101, quantity: 3 });

      expect(productModel.getProductById).toHaveBeenCalledWith(101);
      expect(cartModel.updateCartProductQuantity).toHaveBeenCalledWith(1, 101, 3);
    });

    it('should throw 404 if product not found', async () => {
      productModel.getProductById.mockResolvedValue(null);

      await expect(() =>
        updateCartProductQuantity(1, { productId: 999, quantity: 1 })
      ).rejects.toThrowError(new AppError("Product not found.", 404, "NOT_FOUND"));
    });

    it('should throw 409 if new quantity exceeds stock', async () => {
      productModel.getProductById.mockResolvedValue({ ...mockProduct, stock: 2 });

      await expect(() =>
        updateCartProductQuantity(1, { productId: 101, quantity: 5 })
      ).rejects.toThrowError(new AppError("Not enough stock.", 409, "CONFLICT"));
    });
  });

  describe('removeProductFromCart()', () => {
    it('should remove a product from the user\'s cart', async () => {
      cartModel.removeProductFromCart.mockResolvedValue();

      await removeProductFromCart(1, 101);

      expect(cartModel.removeProductFromCart).toHaveBeenCalledWith(1, 101);
    });
  });
});