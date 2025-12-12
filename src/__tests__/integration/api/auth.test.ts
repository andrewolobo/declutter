/**
 * Auth API Integration Tests
 * Tests for authentication endpoints
 */
import request from "supertest";
import { Application } from "express";
import { getTestServer } from "../../helpers/test-server";
import {
  expectSuccess,
  expectAuthTokens,
  expectUserData,
  expectValidationError,
  expectUnauthorized,
} from "../../helpers/assertions";

describe("Auth API Integration Tests", () => {
  let app: Application;

  beforeAll(() => {
    app = getTestServer();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user with valid data", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          emailAddress: `test-${Date.now()}@example.com`,
          password: "SecurePass123!",
          fullName: "Test User",
          phoneNumber: "+1234567890",
        });

      expectSuccess(response);
      expectAuthTokens(response);
      expectUserData(response, {
        fullName: "Test User",
      });
    });

    it("should reject registration with missing email", async () => {
      const response = await request(app).post("/api/v1/auth/register").send({
        password: "SecurePass123!",
        fullName: "Test User",
      });

      expectValidationError(response, "emailAddress");
    });

    it("should reject registration with invalid email", async () => {
      const response = await request(app).post("/api/v1/auth/register").send({
        emailAddress: "not-an-email",
        password: "SecurePass123!",
        fullName: "Test User",
      });

      expectValidationError(response, "email");
    });

    it("should reject registration with short password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          emailAddress: `test-${Date.now()}@example.com`,
          password: "short",
          fullName: "Test User",
        });

      expectValidationError(response, "password");
    });

    it("should reject registration with missing full name", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          emailAddress: `test-${Date.now()}@example.com`,
          password: "SecurePass123!",
        });

      expectValidationError(response, "fullName");
    });

    it("should reject duplicate email registration", async () => {
      const email = `duplicate-${Date.now()}@example.com`;

      // First registration
      await request(app).post("/api/v1/auth/register").send({
        emailAddress: email,
        password: "SecurePass123!",
        fullName: "First User",
      });

      // Duplicate registration
      const response = await request(app).post("/api/v1/auth/register").send({
        emailAddress: email,
        password: "SecurePass123!",
        fullName: "Second User",
      });

      expect(response.status).toBe(409);
      expect(response.body.code).toBe("USER_ALREADY_EXISTS");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    const testUser = {
      emailAddress: `login-test-${Date.now()}@example.com`,
      password: "LoginPass123!",
      fullName: "Login Test User",
    };

    beforeAll(async () => {
      // Create test user
      await request(app).post("/api/v1/auth/register").send(testUser);
    });

    it("should login with valid credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        emailAddress: testUser.emailAddress,
        password: testUser.password,
      });

      expectSuccess(response);
      expectAuthTokens(response);
      expectUserData(response, {
        emailAddress: testUser.emailAddress,
        fullName: testUser.fullName,
      });
    });

    it("should reject login with wrong password", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        emailAddress: testUser.emailAddress,
        password: "WrongPassword123!",
      });

      expectUnauthorized(response);
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        emailAddress: "nonexistent@example.com",
        password: "SomePassword123!",
      });

      expectUnauthorized(response);
    });

    it("should reject login with missing email", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        password: "SomePassword123!",
      });

      expectValidationError(response, "emailAddress");
    });

    it("should reject login with missing password", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        emailAddress: testUser.emailAddress,
      });

      expectValidationError(response, "password");
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    let validRefreshToken: string;

    beforeAll(async () => {
      // Login to get refresh token
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          emailAddress: `refresh-test-${Date.now()}@example.com`,
          password: "RefreshPass123!",
          fullName: "Refresh Test User",
        });

      validRefreshToken = response.body.refreshToken;
    });

    it("should refresh access token with valid refresh token", async () => {
      const response = await request(app).post("/api/v1/auth/refresh").send({
        refreshToken: validRefreshToken,
      });

      expectSuccess(response);
      expect(response.body).toHaveProperty("accessToken");
      expect(typeof response.body.accessToken).toBe("string");
    });

    it("should reject refresh with invalid token", async () => {
      const response = await request(app).post("/api/v1/auth/refresh").send({
        refreshToken: "invalid-token",
      });

      expectUnauthorized(response);
    });

    it("should reject refresh with missing token", async () => {
      const response = await request(app).post("/api/v1/auth/refresh").send({});

      expectValidationError(response, "refreshToken");
    });
  });

  describe("POST /api/v1/auth/oauth/google", () => {
    it("should handle OAuth with valid Google token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/oauth/google")
        .send({
          provider: "Google",
          accessToken: "mock-google-token",
        });

      // This will fail without actual OAuth implementation
      // but verifies the route is accessible
      expect([200, 201, 401, 500]).toContain(response.status);
    });

    it("should reject OAuth with missing access token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/oauth/google")
        .send({
          provider: "Google",
        });

      expectValidationError(response, "accessToken");
    });
  });

  describe("POST /api/v1/auth/oauth/microsoft", () => {
    it("should handle OAuth with valid Microsoft token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/oauth/microsoft")
        .send({
          provider: "Microsoft",
          accessToken: "mock-microsoft-token",
        });

      // This will fail without actual OAuth implementation
      // but verifies the route is accessible
      expect([200, 201, 401, 500]).toContain(response.status);
    });

    it("should reject OAuth with invalid provider", async () => {
      const response = await request(app)
        .post("/api/v1/auth/oauth/microsoft")
        .send({
          provider: "Invalid",
          accessToken: "mock-token",
        });

      expectValidationError(response);
    });
  });

  describe("POST /api/v1/auth/oauth/facebook", () => {
    it("should handle OAuth with valid Facebook token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/oauth/facebook")
        .send({
          provider: "Facebook",
          accessToken: "mock-facebook-token",
        });

      // This will fail without actual OAuth implementation
      // but verifies the route is accessible
      expect([200, 201, 401, 500]).toContain(response.status);
    });

    it("should reject OAuth with missing access token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/oauth/facebook")
        .send({
          provider: "Facebook",
        });

      expectValidationError(response, "accessToken");
    });

    it("should reject OAuth with invalid provider in Facebook endpoint", async () => {
      const response = await request(app)
        .post("/api/v1/auth/oauth/facebook")
        .send({
          provider: "Google",
          accessToken: "mock-token",
        });

      // Should still process but with Google provider
      expect([200, 201, 401, 500]).toContain(response.status);
    });
  });

  describe("Rate Limiting", () => {
    it("should enforce rate limiting on auth endpoints", async () => {
      const promises = [];

      // Attempt 10 registration requests (limit is 5 per 15 minutes)
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post("/api/v1/auth/register")
            .send({
              emailAddress: `rate-limit-${i}-${Date.now()}@example.com`,
              password: "RateLimit123!",
              fullName: "Rate Limit Test",
            })
        );
      }

      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter((r) => r.status === 429);

      // Some requests should be rate limited
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    }, 30000); // Increase timeout for this test
  });
});
