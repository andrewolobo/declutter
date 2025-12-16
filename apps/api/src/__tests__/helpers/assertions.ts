/**
 * Test Assertions Helper
 * Custom matchers and assertions for API integration tests
 */
import { Response } from "supertest";

/**
 * Assert successful response (2xx status code)
 */
export const expectSuccess = (response: Response): void => {
  expect(response.status).toBeGreaterThanOrEqual(200);
  expect(response.status).toBeLessThan(300);
};

/**
 * Assert error response with specific status and message
 */
export const expectError = (
  response: Response,
  expectedStatus: number,
  messagePattern?: string | RegExp
): void => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty("error");

  if (messagePattern) {
    if (typeof messagePattern === "string") {
      expect(response.body.message).toContain(messagePattern);
    } else {
      expect(response.body.message).toMatch(messagePattern);
    }
  }
};

/**
 * Assert validation error (400 status)
 */
export const expectValidationError = (
  response: Response,
  field?: string
): void => {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("error");
  expect(response.body.code).toBe("VALIDATION_ERROR");

  if (field) {
    expect(response.body.message).toContain(field);
  }
};

/**
 * Assert unauthorized error (401 status)
 */
export const expectUnauthorized = (response: Response): void => {
  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("error");
  expect(response.body.code).toBe("UNAUTHORIZED");
};

/**
 * Assert forbidden error (403 status)
 */
export const expectForbidden = (response: Response): void => {
  expect(response.status).toBe(403);
  expect(response.body).toHaveProperty("error");
  expect(response.body.code).toBe("FORBIDDEN");
};

/**
 * Assert not found error (404 status)
 */
export const expectNotFound = (response: Response): void => {
  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty("error");
  expect(response.body.code).toBe("NOT_FOUND");
};

/**
 * Assert rate limit error (429 status)
 */
export const expectRateLimitExceeded = (response: Response): void => {
  expect(response.status).toBe(429);
  expect(response.body).toHaveProperty("error");
};

/**
 * Assert response has pagination metadata
 */
export const expectPaginationMetadata = (response: Response): void => {
  expect(response.body).toHaveProperty("data");
  expect(response.body).toHaveProperty("page");
  expect(response.body).toHaveProperty("limit");
  expect(response.body).toHaveProperty("total");
  expect(response.body).toHaveProperty("totalPages");
  expect(Array.isArray(response.body.data)).toBe(true);
};

/**
 * Assert response has auth tokens
 */
export const expectAuthTokens = (response: Response): void => {
  expect(response.body).toHaveProperty("accessToken");
  expect(response.body).toHaveProperty("refreshToken");
  expect(typeof response.body.accessToken).toBe("string");
  expect(typeof response.body.refreshToken).toBe("string");
  expect(response.body.accessToken.length).toBeGreaterThan(0);
  expect(response.body.refreshToken.length).toBeGreaterThan(0);
};

/**
 * Assert response contains user data
 */
export const expectUserData = (
  response: Response,
  partial?: Record<string, any>
): void => {
  expect(response.body).toHaveProperty("user");
  expect(response.body.user).toHaveProperty("id");
  expect(response.body.user).toHaveProperty("emailAddress");
  expect(response.body.user).toHaveProperty("fullName");

  if (partial) {
    Object.keys(partial).forEach((key) => {
      expect(response.body.user[key]).toEqual(partial[key]);
    });
  }
};

/**
 * Assert response contains post data
 */
export const expectPostData = (
  response: Response,
  partial?: Record<string, any>
): void => {
  expect(response.body).toHaveProperty("id");
  expect(response.body).toHaveProperty("title");
  expect(response.body).toHaveProperty("description");
  expect(response.body).toHaveProperty("price");
  expect(response.body).toHaveProperty("categoryId");
  expect(response.body).toHaveProperty("userId");
  expect(response.body).toHaveProperty("status");

  if (partial) {
    Object.keys(partial).forEach((key) => {
      expect(response.body[key]).toEqual(partial[key]);
    });
  }
};

/**
 * Assert response contains category data
 */
export const expectCategoryData = (
  response: Response,
  partial?: Record<string, any>
): void => {
  expect(response.body).toHaveProperty("id");
  expect(response.body).toHaveProperty("name");

  if (partial) {
    Object.keys(partial).forEach((key) => {
      expect(response.body[key]).toEqual(partial[key]);
    });
  }
};

/**
 * Assert response contains payment data
 */
export const expectPaymentData = (
  response: Response,
  partial?: Record<string, any>
): void => {
  expect(response.body).toHaveProperty("id");
  expect(response.body).toHaveProperty("userId");
  expect(response.body).toHaveProperty("postId");
  expect(response.body).toHaveProperty("amount");
  expect(response.body).toHaveProperty("status");
  expect(response.body).toHaveProperty("paymentMethod");

  if (partial) {
    Object.keys(partial).forEach((key) => {
      expect(response.body[key]).toEqual(partial[key]);
    });
  }
};
