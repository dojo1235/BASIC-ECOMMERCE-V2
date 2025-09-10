import bcrypt from "bcryptjs";

/**
 * Hash password
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare password
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
}