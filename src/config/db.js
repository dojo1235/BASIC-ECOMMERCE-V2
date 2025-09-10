import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: true }, // Aiven requires SSL
});

// Run schema + seed on first connection
async function initDB() {
  try {
    // Load schema.sql
    const schemaSql = fs.readFileSync(
      path.join(process.cwd(), "src/config/schema.sql"),
      "utf-8"
    );
    await db.query(schemaSql);
    console.log("Schema ensured");

    // Check if products already exist
    const [rows] = await db.query("SELECT COUNT(*) as count FROM products");
    if (rows[0].count === 0) {
      const productSeedSql = fs.readFileSync(
        path.join(process.cwd(), "src/config/product-seed.sql"),
        "utf-8"
      );
      await db.query(productSeedSql);
      console.log("Product seed inserted");
    } else {
      console.log("Products already exist, skipping seed");
    }
  } catch (err) {
    console.error("DB init failed:", err.message);
    process.exit(1);
  }
}

// Prevent auto-run during tests
if (process.env.NODE_ENV !== "test") {
  initDB();
}

export default db;





/*import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prevent connection attempt during tests
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await db.query("SELECT 1"); // or db.getConnection()
      console.log("DB Connected");
    } catch (error) {
      console.error("Failed to connect to MySQL:");
      console.error(error.message);
      process.exit(1);
    }
  })();
}

export default db;*/