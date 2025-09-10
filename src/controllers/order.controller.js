import * as orderService from "../services/order.service.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import { buildResponse } from "../utils/response.util.js";

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrdersByUserId(req.user.id);
  res.status(200).json(buildResponse({orders}));
});

export const checkout = asyncHandler(async (req, res) => {
  const { orderId, shippingFee } = await orderService.placeOrderByUserId(req.user.id);
  res.status(201).json(buildResponse({orderId, shippingFee}, "Order placed successfully."));
});

export const cancelOrder = asyncHandler(async (req, res) => {
  await orderService.deleteOrderByOrderId(req.user.id, req.params.orderId);
  res.status(200).json(buildResponse(null, "Order cancelled successfully."));
});