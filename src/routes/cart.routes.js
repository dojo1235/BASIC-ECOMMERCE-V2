import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartProductQuantity,
  removeFromCart
} from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  validateAddToCartPayload,
  validateUpdateCartProductQuantityPayload,
  validateCartItemId
} from "../validations/cart.validation.js";

const router = Router();

// GET /api/cart
router.get("/", authenticate, getCart);

// POST /api/cart
router.post("/", authenticate, validate(validateAddToCartPayload), addToCart);

// PUT /api/cart
router.put("/", authenticate, validate(validateUpdateCartProductQuantityPayload), updateCartProductQuantity);

// DELETE /api/cart/:productId
router.delete("/:productId", authenticate, validate(validateCartItemId), removeFromCart);

export default router;