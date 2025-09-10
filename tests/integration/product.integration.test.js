import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import db from "../../src/config/db.js";

describe("Product API Integration Tests", () => {
  describe("GET /api/products?search=search", () => {
    it("should get all products with no search", async () => {
      const res = await request(app).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("products");
      expect(res.body.data.products.length).toBeGreaterThan(0);
    });
    
    it("should fail when search query is too long (> 60 chars)", async () => {
      const longSearch = "a".repeat(61);
      const res = await request(app).get("/api/products").query({ search: longSearch });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Search query too long.");
    });

    it("should fail when search contains invalid characters", async () => {
      const invalidSearch = "validSearch$%&";
      const res = await request(app).get("/api/products").query({ search: invalidSearch });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Invalid characters in search.");
    });

    it("should succeed when search contains valid special chars like - , . () and spaces", async () => {
      const validSearch = "test-product, version 1.0 (beta)";
      const res = await request(app).get("/api/products").query({ search: validSearch });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

  });
  
  describe("GET /api/products/:productId", () => {
    it("should get single product by id", async () => {
      const res = await request(app).get("/api/products/1");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("product");
    });

    it("should fail and return invalid product ID when productId in params is not a number", async () => {
      const res = await request(app).get("/api/products/aa");
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Invalid product ID.");
    });

    it("should fail and return 404 for non-existent product", async () => {
      const res = await request(app).get("/api/products/999");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Product not found.");
    });
  });
});

afterAll(async () => {
  await db.end(); // Close DB connections after all tests
});