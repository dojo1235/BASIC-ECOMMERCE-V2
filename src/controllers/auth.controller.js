import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import { buildResponse } from "../utils/response.util.js";

export const register = asyncHandler(async (req, res) => {
  const { token, user } = await authService.registerUser(req.body);
  res.status(201).json(buildResponse({ token, user }, "Registration successful."));
});

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.loginUser(req.body);
  res.status(200).json(buildResponse({ token, user }, "Login successful."));
});