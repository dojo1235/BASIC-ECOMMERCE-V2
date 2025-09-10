import * as productModel from "../models/product.model.js";
import { AppError } from "../utils/app-error.js";

export const getAllProducts = async (query) => {
  const search = query.search || "";
  const products = await productModel.getAllProducts({ search });

  return products;
};

export const getProductById = async (productId) => {
  const product = await productModel.getProductById(productId);
  if (!product) throw new AppError("Product not found.", 404, "NOT_FOUND");

  return product;
};