import db from "../config/db.js";

export const getAllProducts = async ({ search }) => {
  let query = "SELECT * FROM products";
  let params = [];
  if (search) {
    query += " WHERE name LIKE ? OR description LIKE ?";
    params = [`%${search}%`, `%${search}%`];
  };
  const [rows] = await db.query(query, params);
  
  return rows;
};

export const getProductById = async (productId) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [productId]);
  
  return rows[0];
};

export const updateProductById = async (id, { name, description, price, image, stock }) => {
  await db.query(
    "UPDATE products SET name=?, description=?, price=?, image=?, stock=? WHERE id=?",
    [name, description, price, image, stock, id]
  );
};