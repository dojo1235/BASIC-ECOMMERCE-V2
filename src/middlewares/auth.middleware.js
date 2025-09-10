import jwt from "jsonwebtoken";
import { findUserById } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Auth middleware to verify JWT and set req.user
 */
export const authenticate = async (req, res, next) => {
  let token = null;
  // Accept JWT from Authorization header or cookie
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return res.status(401).json({ success: false, data: null, message: "Token not provided. Authentication required.", code: "AUTH_ERROR" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.userId);
    if (!user) return res.status(401).json({ success: false, data: null, message: "User not found.", code: "NOT_FOUND" });
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, data: null, message: "Invalid or expired token.", code: "AUTH_ERROR" });
  }
};