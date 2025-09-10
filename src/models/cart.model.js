import db from "../config/db.js";

export const getCartByUserId = async (userId) => {
  const [rows] = await db.query(
      `SELECT c.id as cart_id, c.quantity, p.*
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?`,
    [userId]
  );
  return rows;
}

export const addOrIncrementCartItem = async (userId, productId, quantity) => {
    // Check if product exists in cart
  const [rows] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );
  if (rows.length > 0) {
    // Update quantity
    await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
      [quantity, userId, productId]
    );
  } else {
    // Insert new
    await db.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, productId, quantity]
    );
  }
}

export const updateCartProductQuantity = async (userId, productId, quantity) => {
  await db.query(
      "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
    [quantity, userId, productId]
  );
}

export const removeProductFromCart = async (userId, productId) => {
  await db.query(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );
}

export const clearCartByUserId = async (userId) => {
  await db.query(
      "DELETE FROM cart WHERE user_id = ?",
    [userId]
  );
}