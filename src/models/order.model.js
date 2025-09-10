import db from "../config/db.js";

 export const placeOrder = async (userId, total) => {
  const [result] = await db.query(
      "INSERT INTO orders (user_id, total) VALUES (?, ?)",
    [userId, total]
  );
  return result.insertId;
}

export const getOrdersByUserId = async (userId) => {
  const [rows] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

export const getOrderByOrderId = async (orderId) => {
  const [rows] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
    [orderId]
  );
  return rows[0];
}

export const deleteOrderByOrderId = async (orderId) => {
  await db.query("DELETE FROM orders WHERE id = ?", [orderId]);
}