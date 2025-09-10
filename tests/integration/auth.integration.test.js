import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import db from "../../src/config/db.js";

const testEmail = "newuser123@example.com";

describe("Auth API Integration Tests", () => {
  describe("POST /api/auth/register", () => {
    // Register - Success
    it("should register a brand new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "NewUser123",
        email: testEmail,
        password: "StrongPassword123#"
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        success: true,
        message: "Registration successful."
      });
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.user).toHaveProperty("email", testEmail);
    });

    // Register - Email already exists
    it("should fail to register with an existing user email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Divine",
        email: "divinebriggs20@gmail.com",
        password: "Divine1235#"
      });

      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Email already in use.");
    });
    
    // Register - With no username
    it("should fail to register with no username", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "", // invalid
        email: "validemail@example.com", // valid
        password: "StrongPassword123#" // valid
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Please enter a name.");
    });

    // Register - With short username
    it("should fail to register with short username", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Sh", // invalid
        email: "validemail@example.com", // valid
        password: "StrongPassword123#" // valid
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Name must be at least 3 characters long.");
    });
    
    // Register - With username exceeding 15 characters 
    it("should fail to register with username exceeding 15 characters", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "ExceedFifteenCharacters", // invalid
        email: "validemail@example.com", // valid
        password: "StrongPassword123#" // valid
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Name cannot exceed 15 characters.");
    });
    
    // Register - With special characters in username
    it("should fail to register with special characters in username", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Sha#", // invalid
        email: "validemail@example.com", // valid
        password: "StrongPassword123#" // valid
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Name can only contain letters and numbers.");
    });
    
    // Register - Missing email
    it("should fail to register with missing email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "ValidName",
        email: "",
        password: "StrongPassword123#"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
      expect(res.body.message).toMatch("Please enter an email address.");
    });
    
    // Register - Malformed email
    it("should fail to register with malformed email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "ValidName",
        email: "malformedemail@.com",
        password: "StrongPassword123#"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
      expect(res.body.message).toMatch("Invalid email format.");
    });
    
    // Register - Missing password
    it("should fail to register with missing password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "ValidName",
        email: "validemail@example.com",
        password: ""
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
      expect(res.body.message).toMatch("Please enter a password.");
    });
    
    // Register - Short password
    it("should fail to register with short password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "ValidName",
        email: "validemail@example.com",
        password: "Sh1#"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
      expect(res.body.message).toMatch("Password must be at least 6 characters long.");
    });
    
    // Register - Missing lowercase in password
    it("should fail to register with lowercase missing in password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "ValidName",
        email: "validemail@example.com",
        password: "UPPERCASE123#"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
      expect(res.body.message).toMatch("Password must contain at least one lowercase letter.");
    });
    
    // Register - Missing uppercase in password
    it("should fail to register with uppercase missing in password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "ValidName",
        email: "validemail@example.com",
        password: "lowercase123#"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
      expect(res.body.message).toMatch("Password must contain at least one uppercase letter.");
    });
    
    // Register - Missing special character in password
    it("should fail to register with special characters missing in password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "ValidName",
        email: "validemail@example.com",
        password: "NoSpecialCharacter123"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
      expect(res.body.message).toMatch("Password must contain at least one special character.");
    });
    
    it("(CFED) should fail and return name missing when name is totally not provided in payload or spelt incorrectly", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "validemail@example.com",
        password: "StrongPassword123#"
      });
      
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
        
      expect(res.body.message).toMatch("name: is expected in payload yet missing or spelt incorrectly.");
    });
    
    it("(CFED) should fail and return email missing when email is totally not provided in payload or spelt incorrectly", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "validName",
        password: "StrongPassword123#"
        });
      
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
        
      expect(res.body.message).toMatch("email: is expected in payload yet missing or spelt incorrectly.");
    });
    
    it("(CFED) should fail and return password missing when password is totally not provided in payload or spelt incorrectly", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "ValidName",
        email: "validemail@example.com"
      });
      
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
        
      expect(res.body.message).toMatch("password: is expected in payload yet missing or spelt incorrectly.");
    });
  });
  
  describe("POST /api/auth/login", () => {
    // Login - Real user
    it("should login seeded user and return JWT", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "divinebriggs20@gmail.com",
        password: "Divine1235#"
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        success: true,
        message: "Login successful."
      });
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.user).toMatchObject({
        email: "divinebriggs20@gmail.com"
      });
    });
  
    // Login - Wrong password
    it("should fail to login with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "divinebriggs20@gmail.com",
        password: "WrongPassword123#"
      });

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Invalid credentials.");
    });
    
    // Login - Non-existent user
    it("should fail to login for non-existent user", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "notarealuser@example.com",
        password: "StrongPassword1#"
      });

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Invalid credentials.");
    });
    
    // Login - Missing email
    it("should fail to login with missing email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "",
        password: "StrongPassword123#"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Please enter an email address.");
    });
    
    // Login - Malformed email
    it("should fail to login with malformed email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "malformedemail@.com",
        password: "StrongPassword123#"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Invalid email format.");
    });
    
    // Login - Missing password
    it("should fail to login with missing password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "validemail@example.com",
        password: ""
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Please enter a password.");
    });
    
    // Login - Short password
    it("should fail to login with short password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "validemail@example.com",
        password: "Sh1#"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Password must be at least 6 characters long.");
    });
    
    // Login - Missing lowercase in password
    it("should fail to login with lowercase missing in password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "validemail@example.com",
        password: "UPPERCASE123#"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Password must contain at least one lowercase letter.");
    });
    
    // Login - Missing uppercase in password
    it("should fail to login with uppercase missing in password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "validemail@example.com",
        password: "lowercase123#"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String)
      });
      expect(res.body.message).toMatch("Password must contain at least one uppercase letter.");
    });
    
    // Login - Missing special character in password
    it("should fail to login with special characters missing in password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "validemail@example.com",
        password: "NoSpecialCharacter123"
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
      expect(res.body.message).toMatch("Password must contain at least one special character.");
    });
    
    it("(CFED) should fail and return email missing when email is totally not provided in payload or spelt incorrectly", async () => {
      const res = await request(app).post("/api/auth/login").send({
        password: "StrongPassword123#"
        });
      
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
        
      expect(res.body.message).toMatch("email: is expected in payload yet missing or spelt incorrectly.");
    });
    
    it("(CFED) should fail and return password missing when password is totally not provided in payload or spelt incorrectly", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "validemail@example.com"
      });
      
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        data: null,
        code: expect.any(String),
      });
        
      expect(res.body.message).toMatch("password: is expected in payload yet missing or spelt incorrectly.");
    });
  });
});

afterAll(async () => {
  try {
    await db.query("DELETE FROM users WHERE email = ?", [testEmail]);
  } catch (err) {
    console.error("Error cleaning up test user:", err);
  } finally {
    await db.end(); // Close DB connections after all tests
  }
});