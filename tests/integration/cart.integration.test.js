import { beforeAll, describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import db from "../../src/config/db.js";

let token;
const testUserEmail = "testuser@example.com";

beforeAll(async () => {
  // Register new user and get token
  const registerRes = await request(app).post("/api/auth/register").send({
    name: "TestUser",
    email: testUserEmail,
    password: "TestPass123#"
  });
  token = registerRes.body.data.token;
});

describe("Cart API Integration Tests", () => {
  describe("GET /api/cart", () => {
    it("should get the current user's cart", async () => {
      const res = await request(app)
        .get("/api/cart")
        .set("Authorization", `Bearer ${token}`);
    
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ success: true });
      expect(res.body.data).toHaveProperty("cart");
    });
  });
  
  describe("POST /api/cart", () => {
    it("should add a product to cart", async () => {
      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "11", quantity: "2" });
    
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ success: true });
      expect(res.body.message).toMatch("Added to cart.");
    });
    
    it("should fail and return 404 for non-existent product", async () => {
      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "9999", quantity: "5" });
    
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Product not found.");
    });
    
    it("should fail and return not enough stock when quantity exceeds available stock", async () => {
      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "11", quantity: "9999" });
    
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Not enough stock.");
    });
    
    it("(CFED) should fail and return productId missing when productId is totally not provided in payload or spelt incorrectly", async () => {
      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ quantity: "2" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("productId: is expected in payload yet missing or spelt incorrectly.");
    });
    
    it("(CFED) should fail and return quantity missing when quantity is totally not provided in payload or spelt incorrectly", async () => {
      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "11" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("quantity: is expected in payload yet missing or spelt incorrectly.");
    });
    
    it("(CFED) should fail and return productId value missing when productId value is empty", async () => {
      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "", quantity: "2" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("productId value is missing in payload.");
    });
    
    it("(CFED) should fail and return quantity value missing when quantity value is empty", async () => {
      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "11", quantity: "" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("quantity value is missing in payload.");
    });
    
    it("(CFED) should fail and return Invalid product ID when productId value is not a number or string instance of a number", async () => {
      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "aa", quantity: "2" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Invalid product ID.");
    });
    
    it("(CFED) should fail and return Invalid quantity when quantity value is not a number or string instance of a number", async () => {
      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "11", quantity: "aa" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Invalid quantity.");
    });
  });
  
  describe("PUT /api/cart", () => {
    it("should update quantity of a product in the cart", async () => {
      const res = await request(app)
        .put("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "11", quantity: "5" });
    
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ success: true });
      expect(res.body.message).toMatch("Cart updated.");
    });
    
    it("should fail and return 404 for non-existent product", async () => {
      const res = await request(app)
        .put("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "9999", quantity: "5" });
    
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Product not found.");
    });
    
    it("should fail and return not enough stock when quantity exceeds available stock", async () => {
      const res = await request(app)
        .put("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "11", quantity: "9999" });
    
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Not enough stock.");
    });
    
    it("(CFED) should fail and return productId missing when productId is totally not provided in payload or spelt incorrectly", async () => {
      const res = await request(app)
        .put("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ quantity: "2" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("productId: is expected in payload yet missing or spelt incorrectly.");
    });
    
    it("(CFED) should fail and return quantity missing when quantity is totally not provided in payload or spelt incorrectly", async () => {
      const res = await request(app)
        .put("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "11" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("quantity: is expected in payload yet missing or spelt incorrectly.");
    });
    
    it("(CFED) should fail and return productId value missing when productId value is empty", async () => {
      const res = await request(app)
        .put("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "", quantity: "2" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("productId value is missing in payload.");
    });
    
    it("(CFED) should fail and return quantity value missing when quantity value is empty", async () => {
      const res = await request(app)
        .put("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "11", quantity: "" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("quantity value is missing in payload.");
    });
    
    it("(CFED) should fail and return Invalid product ID when productId value is not a number or string instance of a number", async () => {
      const res = await request(app)
        .put("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "aa", quantity: "2" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Invalid product ID.");
    });
    
    it("(CFED) should fail and return Invalid quantity when quantity value is not a number or string instance of a number", async () => {
      const res = await request(app)
        .put("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .send({ productId: "11", quantity: "aa" });
    
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Invalid quantity.");
    });
  });
  
  describe("DELETE /api/cart", () => {
    it("should remove a product from the cart", async () => {
      const res = await request(app)
        .delete("/api/cart/11")
        .set("Authorization", `Bearer ${token}`);
    
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ success: true });
      expect(res.body.message).toMatch("Removed from cart.");
    });
  });
});

afterAll(async () => {
  try {
    await db.query("DELETE FROM users WHERE email = ?", [testUserEmail]);
  } catch (err) {
    console.error("Error cleaning up test user:", err);
  } finally {
    await db.end(); // Close DB connections after all tests
  }
});