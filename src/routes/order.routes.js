import { Router } from "express";
import {
  getOrders,
  checkout,
  cancelOrder
} from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateOrderId } from "../validations/order.validation.js";

const router = Router();

// GET /api/orders
router.get("/", authenticate, getOrders);

// POST /api/orders/checkout
router.post("/checkout", authenticate, checkout);

// DELETE /api/orders/:orderId
router.delete("/:orderId", authenticate, validate(validateOrderId), cancelOrder);

export default router;