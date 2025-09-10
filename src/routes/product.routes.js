import { Router } from "express";
import { getAllProducts, getProductById } from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateProductSearch, validateProductId } from "../validations/product.validation.js";

const router = Router();

// GET /api/products
router.get("/", validate(validateProductSearch), getAllProducts);

// GET /api/products/:productId
router.get("/:productId", validate(validateProductId), getProductById);

export default router;