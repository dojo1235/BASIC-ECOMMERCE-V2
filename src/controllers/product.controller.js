import * as productService from "../services/product.service.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import { buildResponse } from "../utils/response.util.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts(req.query);
  res.status(200).json(buildResponse({ products }));
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  res.status(200).json(buildResponse({ product }));
});