import { beforeAll, describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import db from "../../src/config/db.js";

// Test user details
const testUserEmail = "testuser1@example.com";
const testUserPassword = "TestPass123#";

let userToken = "";
let orderId = "";

beforeAll(async () => {
  // Register a new user and store token
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({
      name: "TestUser",
      email: testUserEmail,
      password: testUserPassword
    });

  expect(registerRes.status).toBe(201);
  expect(registerRes.body.success).toBe(true);
  expect(registerRes.body.data).toHaveProperty("token");

  userToken = registerRes.body.data.token;
});

describe("Order API Integration Tests", () => {
  describe("POST /api/orders/checkout", () => {
    it("should place order from cart", async () => {
      // Add an item to cart first
      const cartRes = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ productId: 1, quantity: 1 });

      expect(cartRes.status).toBe(200);
      expect(cartRes.body.success).toBe(true);

      // Checkout
      const res = await request(app)
        .post("/api/orders/checkout")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("orderId");
      expect(res.body.data).toHaveProperty("shippingFee");
      expect(res.body.message).toMatch("Order placed successfully.");

      orderId = res.body.data.orderId;
    });
  });

  describe("GET /api/orders", () => {
    it("should get all orders for user", async () => {
      const res = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.orders)).toBe(true);
    });
  });

  describe("DELETE /api/orders/:orderId", () => {
    it("should delete an order for user", async () => {
      const res = await request(app)
        .delete(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch("Order cancelled successfully.");
    });

    it("should fail with 404 when order not found or not associated with the user", async () => {
      const res = await request(app)
        .delete("/api/orders/9999")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Order not found.");
    });

    it("(CFED) should fail with 400 when orderId is invalid", async () => {
      const res = await request(app)
        .delete("/api/orders/aa")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Invalid order ID.");
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