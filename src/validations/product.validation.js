import { validateParams } from "../utils/validation.util.js";

// validate product search input
export const validateProductSearch = (req) => {
  const { search } = req.query;

  if (search !== undefined) {
    const trimmed = search.trim();

    if (trimmed.length > 60) {
      return { valid: false, message: "Search query too long." };
    }

    const isValid = /^[a-zA-Z0-9\s\-_,.()]*$/.test(trimmed);
    if (!isValid) {
      return { valid: false, message: "Invalid characters in search." };
    }
  }

  return { valid: true };
};

//validate productId param input
export const validateProductId = (req) => {
  const { productId } = req.params;
  const paramsResult = validateParams(productId, "Invalid product ID.");
  if (!paramsResult.valid) return paramsResult;
  
  return { valid: true };
};