/**
 * Auth Test Helper
 * Utilities for authentication in integration tests
 */
import request from "supertest";
import { Application } from "express";
import { JwtUtil } from "../../utils/jwt.util";

export interface TestUser {
  id: number;
  emailAddress: string;
  fullName: string;
  isAdmin?: boolean;
}

export interface TestTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate test JWT tokens for a user
 */
export const generateTestTokens = (user: TestUser): TestTokens => {
  const accessToken = JwtUtil.generateAccessToken({
    userId: user.id,
    email: user.emailAddress,
  });
  const refreshToken = JwtUtil.generateRefreshToken({
    userId: user.id,
    email: user.emailAddress,
  });

  return { accessToken, refreshToken };
};

/**
 * Create test user with specific role
 */
export const createTestUser = (overrides?: Partial<TestUser>): TestUser => {
  return {
    id: 1,
    emailAddress: "test@example.com",
    fullName: "Test User",
    isAdmin: false,
    ...overrides,
  };
};

/**
 * Create admin test user
 */
export const createTestAdmin = (overrides?: Partial<TestUser>): TestUser => {
  return createTestUser({
    id: 999,
    emailAddress: "admin@example.com",
    fullName: "Admin User",
    isAdmin: true,
    ...overrides,
  });
};

/**
 * Register a new user via API and return tokens
 */
export const registerTestUser = async (
  app: Application,
  userData?: {
    emailAddress?: string;
    password?: string;
    fullName?: string;
    phoneNumber?: string;
  }
): Promise<{ user: any; tokens: TestTokens }> => {
  const response = await request(app)
    .post("/api/v1/auth/register")
    .send({
      emailAddress: userData?.emailAddress || "newuser@example.com",
      password: userData?.password || "Password123!",
      fullName: userData?.fullName || "New User",
      phoneNumber: userData?.phoneNumber,
    });

  return {
    user: response.body.user,
    tokens: {
      accessToken: response.body.accessToken,
      refreshToken: response.body.refreshToken,
    },
  };
};

/**
 * Login a user via API and return tokens
 */
export const loginTestUser = async (
  app: Application,
  credentials: {
    emailAddress: string;
    password: string;
  }
): Promise<{ user: any; tokens: TestTokens }> => {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send(credentials);

  return {
    user: response.body.user,
    tokens: {
      accessToken: response.body.accessToken,
      refreshToken: response.body.refreshToken,
    },
  };
};

/**
 * Make authenticated request with bearer token
 */
export const authenticatedRequest = (
  app: Application,
  method: "get" | "post" | "put" | "delete",
  url: string,
  accessToken: string
) => {
  return request(app)
    [method](url)
    .set("Authorization", `Bearer ${accessToken}`);
};
