import { validateParams } from "../utils/validation.util.js";

export const validateOrderId = (req) => {
  const { orderId } = req.params;
  const paramsResult = validateParams(orderId, "Invalid order ID.");
  if (!paramsResult.valid) return paramsResult;
  
  return { valid: true };
};