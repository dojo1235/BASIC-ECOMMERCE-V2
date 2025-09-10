import * as cartModel from "../models/cart.model.js";
import { getProductById } from "../models/product.model.js";
import { AppError } from "../utils/app-error.js";

export const getCartByUserId = async (userId) => {
  const cart = await cartModel.getCartByUserId(userId);
  
  return cart;
}

export const addOrIncrementCartItem = async (userId, payload) => {
  const { productId, quantity } = payload;
  
  const product = await getProductById(productId);
  if (!product) throw new AppError("Product not found.", 404, "NOT_FOUND");
  if (quantity > product.stock) throw new AppError("Not enough stock.", 409, "CONFLICT");
  
  await cartModel.addOrIncrementCartItem(userId, productId, quantity);
}

export const updateCartProductQuantity = async (userId, payload) => {
  const { productId, quantity } = payload;
  
  const product = await getProductById(productId);
  if (!product) throw new AppError("Product not found.", 404, "NOT_FOUND");
  if (quantity > product.stock) throw new AppError("Not enough stock.", 409, "CONFLICT");

  await cartModel.updateCartProductQuantity(userId, productId, quantity);
}

export const removeProductFromCart = async (userId, productId) => {
  await cartModel.removeProductFromCart(userId, productId);
}