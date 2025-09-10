import * as userModel from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import { generateToken } from "../utils/jwt.util.js";
import { AppError } from "../utils/app-error.js";

export const registerUser = async (payload) => {
  let { name, email, password } = payload;
  
  name = name.trim();
  email = email.trim().toLowerCase();
  password = password.trim();
  
  const existing = await userModel.findUserByEmail(email);
  if (existing) throw new AppError("Email already in use.", 409, "CONFLICT");

  const hashed = await hashPassword(password);
  const userId = await userModel.createUser({ name, email, password: hashed });
  
  const user = await userModel.findUserById(userId);
  const token = generateToken({ userId: user.id });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email }
  };
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  
  const user = await userModel.findUserByEmail(email);
  if (!user) throw new AppError("Invalid credentials.", 401, "AUTH_ERROR");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new AppError("Invalid credentials.", 401, "AUTH_ERROR");

  const token = generateToken({ userId: user.id });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email }
  };
};