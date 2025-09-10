import * as orderModel from "../models/order.model.js";
import * as orderItemModel from "../models/order-item.model.js";
import { getCartByUserId, clearCartByUserId } from "../models/cart.model.js";
import { updateProductById } from "../models/product.model.js";
import { AppError } from "../utils/app-error.js";

export const getOrdersByUserId = async (userId) => {
  const orders = await orderModel.getOrdersByUserId(userId);
  // Attach order items to each order
  for (const order of orders) {
    order.items = await orderItemModel.getOrderItemsByOrderId(order.id);
  }
  return orders;
}

export const placeOrderByUserId = async (userId) => {
  const cart = await getCartByUserId(userId);
  if (!cart.length) throw new AppError("Cart is empty.", 400, "NOT_FOUND");
  // Calculate total and check stock
  let total = 0;
  for (const item of cart) {
    if (item.quantity > item.stock) throw new AppError(`Only ${item.stock} left for ${item.name}`, 400, "BAD_REQUEST");
    total += item.price * item.quantity;
  }
  // Mock shipping: e.g., $5 if total < $50, else free
  const DISCOUNT_PRICE = 50;
  const SHIPPING_PRICE = 5;
  
  const shippingFee = total < DISCOUNT_PRICE ? SHIPPING_PRICE : 0;
  total += shippingFee;
  total = parseFloat(total.toFixed(2));

  const orderId = await orderModel.placeOrder(userId, total);
  // Add order items and update stock
  for (const item of cart) {
    await orderItemModel.createOrderItems(orderId, item.id, item.quantity, item.price);
    await updateProductById(item.id, {
        ...item,
      stock: item.stock - item.quantity,
    });
  }
  await clearCartByUserId(userId);
  
  return { orderId, shippingFee };
}

export const deleteOrderByOrderId = async (userId, orderId) => {
  const order = await orderModel.getOrderByOrderId(orderId);
  if (!order || order.user_id !== userId) throw new AppError("Order not found.", 404, "NOT_FOUND");
  // (Optional: implement logic to prevent cancel if shipped, etc.)
  await orderModel.deleteOrderByOrderId(orderId);
}