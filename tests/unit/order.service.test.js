import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as cartModel from '../../src/models/cart.model.js';
import * as orderModel from '../../src/models/order.model.js';
import * as orderItemModel from '../../src/models/order-item.model.js';
import * as productModel from '../../src/models/product.model.js';
import { AppError } from '../../src/utils/app-error.js';
import {
  placeOrderByUserId,
  getOrdersByUserId,
  deleteOrderByOrderId,
} from '../../src/services/order.service.js';

vi.mock('../../src/models/cart.model.js');
vi.mock('../../src/models/order.model.js');
vi.mock('../../src/models/order-item.model.js');
vi.mock('../../src/models/product.model.js');

const mockCart = [
  {
    id: 1,
    name: "Mock Product",
    price: 10,
    quantity: 2,
    stock: 5,
  },
  {
    id: 2,
    name: "Another Product",
    price: 20,
    quantity: 1,
    stock: 3,
  },
];

const mockOrderId = 123;

const mockOrder = {
  id: 123,
  user_id: 1,
  total: 35,
};

const mockOrderItems = [
  {
    id: 1,
    order_id: 123,
    product_id: 1,
    quantity: 2,
    price: 10,
    name: "Mock Product",
    image: "product.jpg",
  },
];

describe('order.service.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('placeOrderByUserId()', () => {
    it('should place an order successfully and return orderId and shippingFee', async () => {
      cartModel.getCartByUserId.mockResolvedValue(mockCart);
      orderModel.placeOrder.mockResolvedValue(mockOrderId);
      orderItemModel.createOrderItems.mockResolvedValue();
      productModel.updateProductById.mockResolvedValue();
      cartModel.clearCartByUserId.mockResolvedValue();

      const result = await placeOrderByUserId(1);

      expect(result).toEqual({ orderId: mockOrderId, shippingFee: 5 }); // total < 50
      expect(orderModel.placeOrder).toHaveBeenCalledWith(1, 45); // 40 + 5
      expect(orderItemModel.createOrderItems).toHaveBeenCalledTimes(2);
      expect(productModel.updateProductById).toHaveBeenCalledTimes(2);
      expect(cartModel.clearCartByUserId).toHaveBeenCalledWith(1);
    });

    it('should throw 400 if cart is empty', async () => {
      cartModel.getCartByUserId.mockResolvedValue([]);

      try {
        await placeOrderByUserId(1);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect(err.message).toBe("Cart is empty.");
        expect(err.statusCode).toBe(400);
      }
    });

    it('should throw 400 if item quantity exceeds stock', async () => {
      cartModel.getCartByUserId.mockResolvedValue([
        { id: 1, name: "Test", price: 10, quantity: 5, stock: 2 },
      ]);

      try {
        await placeOrderByUserId(1);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect(err.message).toBe("Only 2 left for Test");
        expect(err.statusCode).toBe(400);
      }
    });
  });

  describe('getOrdersByUserId()', () => {
    it('should return user orders with items attached', async () => {
      orderModel.getOrdersByUserId.mockResolvedValue([mockOrder]);
      orderItemModel.getOrderItemsByOrderId.mockResolvedValue(mockOrderItems);

      const result = await getOrdersByUserId(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('items');
      expect(result[0].items).toEqual(mockOrderItems);
      expect(orderItemModel.getOrderItemsByOrderId).toHaveBeenCalledWith(mockOrder.id);
    });
  });

  describe('deleteOrderByOrderId()', () => {
    it('should delete order if user owns it', async () => {
      orderModel.getOrderByOrderId.mockResolvedValue({ id: 123, user_id: 1 });
      orderModel.deleteOrderByOrderId.mockResolvedValue();

      await deleteOrderByOrderId(1, 123);

      expect(orderModel.getOrderByOrderId).toHaveBeenCalledWith(123);
      expect(orderModel.deleteOrderByOrderId).toHaveBeenCalledWith(123);
    });

    it('should throw 404 if order does not exist', async () => {
      orderModel.getOrderByOrderId.mockResolvedValue(null);

      try {
        await deleteOrderByOrderId(1, 999);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect(err.message).toBe("Order not found.");
        expect(err.statusCode).toBe(404);
      }
    });

    it('should throw 404 if user does not own the order', async () => {
      orderModel.getOrderByOrderId.mockResolvedValue({ id: 123, user_id: 2 });

      try {
        await deleteOrderByOrderId(1, 123);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect(err.message).toBe("Order not found.");
        expect(err.statusCode).toBe(404);
      }
    });
  });
});