import db from "../config/db.js";

export const createOrderItems = async (orderId, productId, quantity, price) => {
  await db.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
    [orderId, productId, quantity, price]
  );
}

export const getOrderItemsByOrderId = async (orderId) => {
  const [rows] = await db.query(
      `SELECT oi.*, p.name, p.image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
    [orderId]
  );
  return rows;
}