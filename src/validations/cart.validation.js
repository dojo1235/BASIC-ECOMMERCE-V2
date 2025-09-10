import { validateBody, validateParams } from "../utils/validation.util.js";
import { validateProductId } from "./product.validation.js";

const validateCartPayload = (req) => {
  const expectedKeys = ['productId', 'quantity'];
  const payloadKeys = Object.keys(req.body);

  for (const key of expectedKeys) {
    if (!payloadKeys.includes(key)) {
      return { valid: false, message: `${key}: is expected in payload yet missing or spelt incorrectly.` };
    }
  }
  
  const { productId, quantity } = req.body;

  if (productId === undefined || productId === null || productId === "") 
    return { valid: false, message: "productId value is missing in payload." };

  if (quantity === undefined || quantity === null || quantity === "") 
    return { valid: false, message: "quantity value is missing in payload." };

  const productResult = validateBody(productId, "Invalid product ID.");
  if (!productResult.valid) return productResult;

  const quantityResult = validateBody(quantity, "Invalid quantity.");
  if (!quantityResult.valid) return quantityResult;

  return { valid: true };
};

export const validateAddToCartPayload = validateCartPayload;
export const validateUpdateCartProductQuantityPayload = validateCartPayload;
export const validateCartItemId = validateProductId;