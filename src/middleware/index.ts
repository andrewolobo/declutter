/**
 * Middleware exports
 * Centralized export for all middleware modules
 */

// Authentication middleware
export { authenticate, optionalAuth, requireAdmin } from "./auth.middleware";

// Validation middleware
export {
  validate,
  validateQuery,
  validateParams,
} from "./validation.middleware";

// Error handling middleware
export { errorHandler, notFoundHandler } from "./error.middleware";

// Rate limiting middleware
export {
  authLimiter,
  createLimiter,
  readLimiter,
} from "./rate-limit.middleware";
