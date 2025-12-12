import rateLimit from "express-rate-limit";
import { ErrorCode } from "../types/common/api-response.types";

/**
 * Strict rate limit for authentication endpoints
 * Prevents brute force attacks on login/register
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    error: {
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message: "Too many authentication attempts. Please try again later.",
      statusCode: 429,
    },
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

/**
 * Moderate rate limit for POST/PUT/DELETE requests
 * Prevents abuse of create/update/delete operations
 * 20 requests per minute per IP
 */
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    success: false,
    error: {
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message: "Too many requests. Please slow down.",
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Lenient rate limit for GET requests
 * Allows reasonable browsing activity
 * 100 requests per minute per IP
 */
export const readLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    error: {
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message: "Too many requests. Please slow down.",
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
