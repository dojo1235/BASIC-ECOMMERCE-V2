import * as cartService from "../services/cart.service.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import { buildResponse } from "../utils/response.util.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCartByUserId(req.user.id);
  res.status(200).json(buildResponse({ cart }));
});

export const addToCart = asyncHandler(async (req, res) => {
  await cartService.addOrIncrementCartItem(req.user.id, req.body);
  res.status(200).json(buildResponse(null, "Added to cart."));
});

export const updateCartProductQuantity = asyncHandler(async (req, res) => {
  await cartService.updateCartProductQuantity(req.user.id, req.body);
  res.status(200).json(buildResponse(null, "Cart updated."));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  await cartService.removeProductFromCart(req.user.id, req.params.productId);
  res.status(200).json(buildResponse(null, "Removed from cart."));
});