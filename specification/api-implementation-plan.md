# API Layer Implementation Plan

**Project:** DEC_L - Modern Classifieds Platform  
**Date:** December 12, 2025  
**Status:** Planning Phase  
**Target Completion:** 12-18 hours

---

## Executive Summary

This document outlines the complete implementation plan for the REST API layer of the DEC_L platform. The backend service layer (5 services, 34 methods) is fully implemented and tested (58.34% coverage, 144 tests passing). This plan focuses on building the HTTP layer using Express.js to expose these services through RESTful endpoints.

### Current State

- ✅ **Service Layer:** Complete (AuthService, UserService, PostService, CategoryService, PaymentService)
- ✅ **Data Access Layer:** Complete (7 repositories)
- ✅ **Type System:** Complete (TypeScript DTOs, ApiResponse pattern)
- ✅ **Security Utilities:** Complete (JWT, bcrypt, OAuth)
- ✅ **Database:** Complete (Prisma ORM, SQL Server)
- ❌ **API Controllers:** Not started
- ❌ **HTTP Routes:** Not started
- ❌ **Middleware:** Not started
- ❌ **Integration Tests:** Not started

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│              (Web UI, Mobile App - Planned)                  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ REST API
┌────────────────────────▼────────────────────────────────────┐
│                      API Layer (TO BUILD)                    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Controllers │  │  Middleware  │  │    Routes    │      │
│  │              │  │              │  │              │      │
│  │ • Auth       │  │ • JWT Auth   │  │ • /api/v1    │      │
│  │ • User       │  │ • Validation │  │ • Versioned  │      │
│  │ • Post       │  │ • Error      │  │ • RESTful    │      │
│  │ • Category   │  │ • Rate Limit │  │              │      │
│  │ • Payment    │  │ • CORS       │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│               Service Layer (✅ COMPLETE)                    │
│                                                              │
│  • AuthService (4 methods, 100% coverage)                   │
│  • UserService (9 methods, 98.71% coverage)                 │
│  • PostService (10 methods, 51.92% coverage)                │
│  • CategoryService (5 methods, 100% coverage)               │
│  • PaymentService (6 methods, 100% coverage)                │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│          Data Access Layer (✅ COMPLETE)                     │
│                    7 Repositories                            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Prisma ORM (✅ COMPLETE)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│           Azure SQL Database / SQL Server                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Foundation Setup (2-3 hours)

### 1.1 Install Dependencies

**Required Production Packages:**

```bash
npm install express cors helmet express-rate-limit
```

**Required Development Packages:**

```bash
npm install --save-dev @types/express @types/cors
```

**Package Justifications:**

- **express** (v4.18+): Industry-standard web framework (50M+ downloads/week)
- **cors**: Cross-Origin Resource Sharing for web client access
- **helmet**: Security headers (XSS, CSRF protection)
- **express-rate-limit**: DDoS protection and rate limiting
- **@types/express**: TypeScript definitions for Express
- **@types/cors**: TypeScript definitions for CORS

**Optional Packages (Recommended):**

```bash
npm install morgan winston
npm install --save-dev @types/morgan
```

- **morgan**: HTTP request logging
- **winston**: Advanced logging system

### 1.2 Create Application Entry Point

**File:** `src/app.ts`

```typescript
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { appConfig } from "./config";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(",") || [
        "http://localhost:3000",
      ],
      credentials: true,
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API routes
  app.use(appConfig.apiPrefix, routes);

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
};
```

**File:** `src/server.ts`

```typescript
import { createApp } from "./app";
import { appConfig } from "./config";

const app = createApp();

const server = app.listen(appConfig.port, () => {
  console.log(`🚀 DEC_L API Server running on port ${appConfig.port}`);
  console.log(`📝 Environment: ${appConfig.env}`);
  console.log(
    `🔗 API Base URL: http://localhost:${appConfig.port}${appConfig.apiPrefix}`
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
```

### 1.3 Update package.json Scripts

Add/update scripts:

```json
{
  "scripts": {
    "dev": "ts-node src/server.ts",
    "dev:watch": "nodemon --watch src --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test:integration": "jest --testPathPattern=integration --runInBand"
  }
}
```

---

## Phase 2: Core Middleware (2-3 hours)

### 2.1 Authentication Middleware

**File:** `src/middleware/auth.middleware.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../utils";
import { ErrorCode } from "../types/common/api-response.types";
import { JwtPayload } from "../types/auth/auth.types";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: "Missing or invalid authorization header",
          statusCode: 401,
        },
      });
    }

    const token = authHeader.substring(7);
    const payload = JwtUtil.verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: ErrorCode.INVALID_TOKEN,
        message: "Invalid or expired token",
        statusCode: 401,
      },
    });
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = JwtUtil.verifyAccessToken(token);
      req.user = payload;
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: Implement after adding isAdmin check
  // For now, all authenticated users can access
  next();
};
```

### 2.2 Validation Middleware

**File:** `src/middleware/validation.middleware.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ErrorCode } from "../types/common/api-response.types";

export const validate = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Validation failed",
          details: error.details.map((d) => ({
            field: d.path.join("."),
            message: d.message,
          })),
          statusCode: 400,
        },
      });
    }

    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Query validation failed",
          details: error.details.map((d) => ({
            field: d.path.join("."),
            message: d.message,
          })),
          statusCode: 400,
        },
      });
    }

    req.query = value;
    next();
  };
};

export const validateParams = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Parameter validation failed",
          details: error.details.map((d) => ({
            field: d.path.join("."),
            message: d.message,
          })),
          statusCode: 400,
        },
      });
    }

    req.params = value;
    next();
  };
};
```

### 2.3 Error Handling Middleware

**File:** `src/middleware/error.middleware.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../types/common/api-response.types";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Unhandled error:", error);

  return res.status(500).json({
    success: false,
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: "An unexpected error occurred",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
      statusCode: 500,
      timestamp: new Date().toISOString(),
    },
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    error: {
      code: ErrorCode.RESOURCE_NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: 404,
    },
  });
};
```

### 2.4 Rate Limiting Middleware

**File:** `src/middleware/rate-limit.middleware.ts`

```typescript
import rateLimit from "express-rate-limit";
import { ErrorCode } from "../types/common/api-response.types";

// Strict rate limit for authentication endpoints
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
  standardHeaders: true,
  legacyHeaders: false,
});

// Moderate rate limit for POST requests
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

// Lenient rate limit for GET requests
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
```

---

## Phase 3: Controllers Implementation (4-6 hours)

### 3.1 AuthController

**File:** `src/controllers/auth.controller.ts`

**Endpoints to Implement:**

1. `register(req, res, next)` → `POST /api/v1/auth/register`
2. `login(req, res, next)` → `POST /api/v1/auth/login`
3. `oauthGoogle(req, res, next)` → `POST /api/v1/auth/oauth/google`
4. `oauthMicrosoft(req, res, next)` → `POST /api/v1/auth/oauth/microsoft`
5. `refreshToken(req, res, next)` → `POST /api/v1/auth/refresh`

**Pattern:**

```typescript
import { Request, Response, NextFunction } from "express";
import { authService } from "../services";
import {
  RegisterDTO,
  LoginDTO,
  OAuthLoginDTO,
  RefreshTokenDTO,
} from "../types/auth/auth.types";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: RegisterDTO = req.body;
      const result = await authService.register(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: LoginDTO = req.body;
      const result = await authService.login(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ... implement oauthGoogle, oauthMicrosoft, refreshToken
}

export const authController = new AuthController();
```

### 3.2 UserController

**File:** `src/controllers/user.controller.ts`

**Endpoints to Implement:**

1. `getProfile(req, res, next)` → `GET /api/v1/users/me`
2. `updateProfile(req, res, next)` → `PUT /api/v1/users/me`
3. `changePassword(req, res, next)` → `PUT /api/v1/users/me/password`
4. `deleteAccount(req, res, next)` → `DELETE /api/v1/users/me`
5. `getPostsSummary(req, res, next)` → `GET /api/v1/users/me/posts/summary`
6. `requestPasswordReset(req, res, next)` → `POST /api/v1/users/password/reset-request`
7. `resetPassword(req, res, next)` → `POST /api/v1/users/password/reset`
8. `verifyEmail(req, res, next)` → `POST /api/v1/users/me/verify-email`
9. `verifyPhone(req, res, next)` → `POST /api/v1/users/me/verify-phone`

**Key Points:**

- All endpoints (except password reset requests) require authentication
- Extract `userId` from `req.user.userId` (set by auth middleware)
- Use appropriate HTTP status codes (200 for success, 204 for delete)

### 3.3 PostController

**File:** `src/controllers/post.controller.ts`

**Endpoints to Implement:**

1. `createPost(req, res, next)` → `POST /api/v1/posts`
2. `getPost(req, res, next)` → `GET /api/v1/posts/:id`
3. `updatePost(req, res, next)` → `PUT /api/v1/posts/:id`
4. `deletePost(req, res, next)` → `DELETE /api/v1/posts/:id`
5. `getFeed(req, res, next)` → `GET /api/v1/posts`
6. `searchPosts(req, res, next)` → `GET /api/v1/posts/search`
7. `toggleLike(req, res, next)` → `POST /api/v1/posts/:id/like`
8. `schedulePost(req, res, next)` → `POST /api/v1/posts/:id/schedule`
9. `publishPost(req, res, next)` → `POST /api/v1/posts/:id/publish`
10. `getUserPosts(req, res, next)` → `GET /api/v1/users/:userId/posts`

**Key Points:**

- `getFeed` and `getPost` support optional authentication (use `optionalAuth` middleware)
- View tracking is automatic in service layer
- Like status (`isLiked`) returned when user is authenticated
- Pagination query params: `page` (default: 1), `limit` (default: 20, max: 100)

### 3.4 CategoryController

**File:** `src/controllers/category.controller.ts`

**Endpoints to Implement:**

1. `getAllCategories(req, res, next)` → `GET /api/v1/categories`
2. `getCategoryById(req, res, next)` → `GET /api/v1/categories/:id`
3. `createCategory(req, res, next)` → `POST /api/v1/categories` (admin only)
4. `updateCategory(req, res, next)` → `PUT /api/v1/categories/:id` (admin only)
5. `deleteCategory(req, res, next)` → `DELETE /api/v1/categories/:id` (admin only)

**Key Points:**

- GET endpoints are public (no authentication required)
- POST/PUT/DELETE require admin role (future implementation)

### 3.5 PaymentController

**File:** `src/controllers/payment.controller.ts`

**Endpoints to Implement:**

1. `createPayment(req, res, next)` → `POST /api/v1/payments`
2. `confirmPayment(req, res, next)` → `POST /api/v1/payments/:id/confirm`
3. `getPaymentById(req, res, next)` → `GET /api/v1/payments/:id`
4. `getUserPaymentHistory(req, res, next)` → `GET /api/v1/payments/me`
5. `getPostPayments(req, res, next)` → `GET /api/v1/posts/:postId/payments`
6. `cancelPayment(req, res, next)` → `PUT /api/v1/payments/:id/cancel`

**Key Points:**

- All endpoints require authentication
- `confirmPayment` should have stricter rate limiting (called by mobile app)
- Extract `userId` from authenticated user

---

## Phase 4: Routes Definition (2-3 hours)

### 4.1 Route Structure

```
src/routes/
├── index.ts              # Main route aggregator
├── auth.routes.ts        # Authentication routes
├── user.routes.ts        # User management routes
├── post.routes.ts        # Post CRUD routes
├── category.routes.ts    # Category routes
└── payment.routes.ts     # Payment routes
```

### 4.2 Auth Routes

**File:** `src/routes/auth.routes.ts`

```typescript
import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { authLimiter } from "../middleware/rate-limit.middleware";
import {
  registerSchema,
  loginSchema,
  oauthSchema,
  refreshTokenSchema,
} from "../validation/auth.validation";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post(
  "/oauth/google",
  authLimiter,
  validate(oauthSchema),
  authController.oauthGoogle
);
router.post(
  "/oauth/microsoft",
  authLimiter,
  validate(oauthSchema),
  authController.oauthMicrosoft
);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken
);

export default router;
```

### 4.3 User Routes

**File:** `src/routes/user.routes.ts`

```typescript
import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  updateProfileSchema,
  changePasswordSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "../validation/user.validation";

const router = Router();

// Protected routes
router.get("/me", authenticate, userController.getProfile);
router.put(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  userController.updateProfile
);
router.put(
  "/me/password",
  authenticate,
  validate(changePasswordSchema),
  userController.changePassword
);
router.delete("/me", authenticate, userController.deleteAccount);
router.get("/me/posts/summary", authenticate, userController.getPostsSummary);
router.post("/me/verify-email", authenticate, userController.verifyEmail);
router.post("/me/verify-phone", authenticate, userController.verifyPhone);

// Public password reset routes
router.post(
  "/password/reset-request",
  validate(resetPasswordRequestSchema),
  userController.requestPasswordReset
);
router.post(
  "/password/reset",
  validate(resetPasswordSchema),
  userController.resetPassword
);

export default router;
```

### 4.4 Post Routes

**File:** `src/routes/post.routes.ts`

```typescript
import { Router } from "express";
import { postController } from "../controllers/post.controller";
import { authenticate, optionalAuth } from "../middleware/auth.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";
import {
  createLimiter,
  readLimiter,
} from "../middleware/rate-limit.middleware";
import {
  createPostSchema,
  updatePostSchema,
  schedulePostSchema,
  feedOptionsSchema,
  searchOptionsSchema,
} from "../validation/post.validation";

const router = Router();

// Public/optional auth routes
router.get(
  "/",
  readLimiter,
  optionalAuth,
  validateQuery(feedOptionsSchema),
  postController.getFeed
);
router.get(
  "/search",
  readLimiter,
  optionalAuth,
  validateQuery(searchOptionsSchema),
  postController.searchPosts
);
router.get("/:id", readLimiter, optionalAuth, postController.getPost);

// Protected routes
router.post(
  "/",
  authenticate,
  createLimiter,
  validate(createPostSchema),
  postController.createPost
);
router.put(
  "/:id",
  authenticate,
  validate(updatePostSchema),
  postController.updatePost
);
router.delete("/:id", authenticate, postController.deletePost);
router.post("/:id/like", authenticate, postController.toggleLike);
router.post(
  "/:id/schedule",
  authenticate,
  validate(schedulePostSchema),
  postController.schedulePost
);
router.post("/:id/publish", authenticate, postController.publishPost);

// User posts (public)
router.get("/users/:userId", readLimiter, postController.getUserPosts);

export default router;
```

### 4.5 Category Routes

**File:** `src/routes/category.routes.ts`

```typescript
import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validation/category.validation";

const router = Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Admin routes (TODO: Add requireAdmin middleware when implemented)
router.post(
  "/",
  authenticate,
  validate(createCategorySchema),
  categoryController.createCategory
);
router.put(
  "/:id",
  authenticate,
  validate(updateCategorySchema),
  categoryController.updateCategory
);
router.delete("/:id", authenticate, categoryController.deleteCategory);

export default router;
```

### 4.6 Payment Routes

**File:** `src/routes/payment.routes.ts`

```typescript
import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createLimiter } from "../middleware/rate-limit.middleware";
import {
  createPaymentSchema,
  confirmPaymentSchema,
} from "../validation/payment.validation";

const router = Router();

// All payment routes require authentication
router.post(
  "/",
  authenticate,
  createLimiter,
  validate(createPaymentSchema),
  paymentController.createPayment
);
router.post(
  "/:id/confirm",
  authenticate,
  validate(confirmPaymentSchema),
  paymentController.confirmPayment
);
router.get("/:id", authenticate, paymentController.getPaymentById);
router.get("/me", authenticate, paymentController.getUserPaymentHistory);
router.get("/posts/:postId", authenticate, paymentController.getPostPayments);
router.put("/:id/cancel", authenticate, paymentController.cancelPayment);

export default router;
```

### 4.7 Main Route Aggregator

**File:** `src/routes/index.ts`

```typescript
import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import postRoutes from "./post.routes";
import categoryRoutes from "./category.routes";
import paymentRoutes from "./payment.routes";

const router = Router();

// Mount domain routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/categories", categoryRoutes);
router.use("/payments", paymentRoutes);

export default router;
```

### 4.8 Validation Schemas

Create validation schemas in `src/validation/` directory. These will use Joi and reuse patterns from existing service tests.

**Required Files:**

- `auth.validation.ts` - Register, login, OAuth, refresh token schemas
- `user.validation.ts` - Profile update, password change schemas
- `post.validation.ts` - Create, update, search, feed schemas
- `category.validation.ts` - Category CRUD schemas
- `payment.validation.ts` - Payment creation, confirmation schemas

**Example (auth.validation.ts):**

```typescript
import Joi from "joi";

export const registerSchema = Joi.object({
  emailAddress: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().min(2).required(),
  phoneNumber: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  emailAddress: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const oauthSchema = Joi.object({
  provider: Joi.string().valid("Google", "Microsoft").required(),
  accessToken: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
```

---

## Phase 5: Integration Testing (3-4 hours)

### 5.1 Test Structure

```
src/__tests__/
├── setup.ts
├── helpers/
│   ├── test-data.ts
│   └── test-server.ts      # New: Create test app instance
└── integration/             # New directory
    ├── auth.integration.test.ts
    ├── user.integration.test.ts
    ├── post.integration.test.ts
    ├── category.integration.test.ts
    └── payment.integration.test.ts
```

### 5.2 Test Helper Setup

**File:** `src/__tests__/helpers/test-server.ts`

```typescript
import request from "supertest";
import { Application } from "express";
import { createApp } from "../../app";

export const createTestApp = (): Application => {
  return createApp();
};

export const getAuthHeaders = async (app: Application) => {
  // Register and login to get tokens
  const registerResponse = await request(app)
    .post("/api/v1/auth/register")
    .send({
      emailAddress: "test@example.com",
      password: "Test123!@#",
      fullName: "Test User",
    });

  return {
    Authorization: `Bearer ${registerResponse.body.data.tokens.accessToken}`,
  };
};
```

### 5.3 Integration Test Pattern

**File:** `src/__tests__/integration/auth.integration.test.ts`

```typescript
import request from "supertest";
import { createTestApp } from "../helpers/test-server";
import { Application } from "express";

describe("Auth API Integration Tests", () => {
  let app: Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          emailAddress: "newuser@example.com",
          password: "Password123!",
          fullName: "New User",
          phoneNumber: "+256700000000",
        })
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("tokens");
      expect(response.body.data.user.emailAddress).toBe("newuser@example.com");
    });

    it("should return 400 for invalid email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          emailAddress: "invalid-email",
          password: "Password123!",
          fullName: "Test User",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 429 after rate limit exceeded", async () => {
      // Make 6 requests (limit is 5)
      for (let i = 0; i < 6; i++) {
        const response = await request(app)
          .post("/api/v1/auth/register")
          .send({
            emailAddress: `user${i}@example.com`,
            password: "Password123!",
            fullName: "Test User",
          });

        if (i < 5) {
          expect(response.status).toBeLessThan(429);
        } else {
          expect(response.status).toBe(429);
        }
      }
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      // Register user first
      await request(app).post("/api/v1/auth/register").send({
        emailAddress: "logintest@example.com",
        password: "Password123!",
        fullName: "Login Test",
      });

      // Login
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          emailAddress: "logintest@example.com",
          password: "Password123!",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("tokens");
    });

    it("should return 401 for incorrect password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          emailAddress: "logintest@example.com",
          password: "WrongPassword!",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
    });
  });
});
```

### 5.4 Test Coverage Goals

**Target:** 30+ integration tests covering:

1. **Authentication Flow (8 tests)**

   - Successful registration
   - Duplicate email prevention
   - Successful login
   - Invalid credentials
   - OAuth login (mocked)
   - Token refresh
   - Rate limiting
   - Validation errors

2. **Protected Routes (6 tests)**

   - Access without token (401)
   - Access with invalid token (401)
   - Access with expired token (401)
   - Successful access with valid token
   - Token in different formats (Bearer vs. none)

3. **Post Operations (8 tests)**

   - Create post (authenticated)
   - Get feed (public)
   - Get single post (public, increments view)
   - Update post (owner only)
   - Delete post (owner only)
   - Like/unlike post
   - Search posts
   - Pagination

4. **User Operations (4 tests)**

   - Get profile
   - Update profile
   - Change password
   - Delete account

5. **Category Operations (2 tests)**

   - Get all categories
   - Get category by ID

6. **Payment Operations (2 tests)**
   - Create payment
   - Confirm payment

---

## Phase 6: API Documentation (1-2 hours)

### 6.1 OpenAPI/Swagger Setup

**Install Dependencies:**

```bash
npm install swagger-jsdoc swagger-ui-express
npm install --save-dev @types/swagger-jsdoc @types/swagger-ui-express
```

**File:** `src/config/swagger.config.ts`

```typescript
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DEC_L API",
      version: "1.0.0",
      description: "REST API for DEC_L Modern Classifieds Platform",
      contact: {
        name: "API Support",
        email: "support@decl.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
      {
        url: "https://api.decl.com/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
```

### 6.2 Swagger UI Integration

**Update:** `src/app.ts`

```typescript
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config";

// Add after routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

### 6.3 Document Endpoints with JSDoc

**Example:** Add to `src/routes/auth.routes.ts`

```typescript
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailAddress
 *               - password
 *               - fullName
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 */
router.post('/register', ...);
```

### 6.4 Create Postman Collection

Export Swagger spec to Postman format and create a collection with:

- All 30+ endpoints
- Environment variables (baseUrl, accessToken, refreshToken)
- Pre-request scripts for authentication
- Tests for response validation

---

## Complete API Endpoint Reference

### Authentication Endpoints

| Method | Endpoint                | Auth Required | Rate Limit | Description               |
| ------ | ----------------------- | ------------- | ---------- | ------------------------- |
| POST   | `/auth/register`        | No            | 5/15min    | Register new user         |
| POST   | `/auth/login`           | No            | 5/15min    | Login with email/password |
| POST   | `/auth/oauth/google`    | No            | 5/15min    | Google OAuth login        |
| POST   | `/auth/oauth/microsoft` | No            | 5/15min    | Microsoft OAuth login     |
| POST   | `/auth/refresh`         | No            | Standard   | Refresh access token      |

### User Endpoints

| Method | Endpoint                        | Auth Required | Rate Limit | Description               |
| ------ | ------------------------------- | ------------- | ---------- | ------------------------- |
| GET    | `/users/me`                     | Yes           | Standard   | Get current user profile  |
| PUT    | `/users/me`                     | Yes           | Standard   | Update profile            |
| PUT    | `/users/me/password`            | Yes           | Standard   | Change password           |
| DELETE | `/users/me`                     | Yes           | Standard   | Delete account            |
| GET    | `/users/me/posts/summary`       | Yes           | Standard   | Get post statistics       |
| POST   | `/users/me/verify-email`        | Yes           | Standard   | Verify email address      |
| POST   | `/users/me/verify-phone`        | Yes           | Standard   | Verify phone number       |
| POST   | `/users/password/reset-request` | No            | Standard   | Request password reset    |
| POST   | `/users/password/reset`         | No            | Standard   | Reset password with token |

### Post Endpoints

| Method | Endpoint               | Auth Required | Rate Limit | Description                   |
| ------ | ---------------------- | ------------- | ---------- | ----------------------------- |
| GET    | `/posts`               | Optional      | 100/min    | Get feed (paginated)          |
| GET    | `/posts/search`        | Optional      | 100/min    | Search posts                  |
| GET    | `/posts/:id`           | Optional      | 100/min    | Get single post (tracks view) |
| POST   | `/posts`               | Yes           | 20/min     | Create new post               |
| PUT    | `/posts/:id`           | Yes           | Standard   | Update post (owner only)      |
| DELETE | `/posts/:id`           | Yes           | Standard   | Delete post (owner only)      |
| POST   | `/posts/:id/like`      | Yes           | Standard   | Toggle like on post           |
| POST   | `/posts/:id/schedule`  | Yes           | Standard   | Schedule post for later       |
| POST   | `/posts/:id/publish`   | Yes           | Standard   | Publish draft/scheduled post  |
| GET    | `/users/:userId/posts` | No            | 100/min    | Get user's posts              |

### Category Endpoints

| Method | Endpoint          | Auth Required | Rate Limit | Description        |
| ------ | ----------------- | ------------- | ---------- | ------------------ |
| GET    | `/categories`     | No            | Standard   | Get all categories |
| GET    | `/categories/:id` | No            | Standard   | Get category by ID |
| POST   | `/categories`     | Yes (Admin)   | Standard   | Create category    |
| PUT    | `/categories/:id` | Yes (Admin)   | Standard   | Update category    |
| DELETE | `/categories/:id` | Yes (Admin)   | Standard   | Delete category    |

### Payment Endpoints

| Method | Endpoint                  | Auth Required | Rate Limit | Description                  |
| ------ | ------------------------- | ------------- | ---------- | ---------------------------- |
| POST   | `/payments`               | Yes           | 20/min     | Create payment record        |
| POST   | `/payments/:id/confirm`   | Yes           | 20/min     | Confirm payment (mobile app) |
| GET    | `/payments/:id`           | Yes           | Standard   | Get payment details          |
| GET    | `/payments/me`            | Yes           | Standard   | Get user payment history     |
| GET    | `/posts/:postId/payments` | Yes           | Standard   | Get payments for post        |
| PUT    | `/payments/:id/cancel`    | Yes           | Standard   | Cancel pending payment       |

**Total: 34 Endpoints**

---

## File Structure Summary

```
src/
├── app.ts                          # Express app setup
├── server.ts                       # Server entry point
├── controllers/                    # HTTP request handlers
│   ├── auth.controller.ts          # 5 methods
│   ├── user.controller.ts          # 9 methods
│   ├── post.controller.ts          # 10 methods
│   ├── category.controller.ts      # 5 methods
│   └── payment.controller.ts       # 6 methods
├── middleware/                     # Request processing
│   ├── auth.middleware.ts          # JWT verification
│   ├── validation.middleware.ts    # Joi validation
│   ├── error.middleware.ts         # Error handling
│   └── rate-limit.middleware.ts    # Rate limiting
├── routes/                         # Endpoint definitions
│   ├── index.ts                    # Route aggregator
│   ├── auth.routes.ts              # 5 endpoints
│   ├── user.routes.ts              # 9 endpoints
│   ├── post.routes.ts              # 10 endpoints
│   ├── category.routes.ts          # 5 endpoints
│   └── payment.routes.ts           # 6 endpoints
├── validation/                     # Joi schemas
│   ├── auth.validation.ts
│   ├── user.validation.ts
│   ├── post.validation.ts
│   ├── category.validation.ts
│   └── payment.validation.ts
├── services/                       # ✅ EXISTING - Business logic
├── dal/                            # ✅ EXISTING - Data access
├── types/                          # ✅ EXISTING - TypeScript types
├── utils/                          # ✅ EXISTING - Utilities
├── config/                         # ✅ EXISTING + swagger.config.ts
└── __tests__/
    ├── integration/                # NEW - API tests
    │   ├── auth.integration.test.ts
    │   ├── user.integration.test.ts
    │   ├── post.integration.test.ts
    │   ├── category.integration.test.ts
    │   └── payment.integration.test.ts
    ├── unit/                       # ✅ EXISTING - Service tests
    └── helpers/
        ├── test-data.ts            # ✅ EXISTING
        └── test-server.ts          # NEW - Test app factory
```

**Total Files to Create:** ~25 files

---

## Environment Variables

### Required Environment Variables

Add to `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# JWT
JWT_ACCESS_SECRET=your-access-secret-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRY=7d

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_REDIRECT_URI=http://localhost:3000/auth/microsoft/callback

# Database (Existing)
DATABASE_URL=sqlserver://...

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

---

## Testing Strategy

### Unit Tests (✅ Existing - 144 tests)

- Service layer methods
- Utility functions (JWT, password hashing)
- Current coverage: 58.34%

### Integration Tests (NEW - Target: 30+ tests)

- Full HTTP request/response cycle
- Middleware execution
- Authentication flow
- Authorization checks
- Error handling
- Rate limiting
- Validation

### Test Execution

```bash
# Run all tests
npm test

# Run only integration tests
npm run test:integration

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## Error Handling Strategy

### Standardized Error Response Format

All endpoints return consistent error structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": "Additional context or validation details",
    "statusCode": 400,
    "timestamp": "2025-12-12T10:30:00.000Z"
  }
}
```

### HTTP Status Code Mapping

| Error Code                | HTTP Status | Use Case                  |
| ------------------------- | ----------- | ------------------------- |
| `VALIDATION_ERROR`        | 400         | Invalid request data      |
| `BAD_REQUEST`             | 400         | Malformed request         |
| `UNAUTHORIZED`            | 401         | Missing authentication    |
| `INVALID_CREDENTIALS`     | 401         | Wrong email/password      |
| `INVALID_TOKEN`           | 401         | Invalid JWT token         |
| `EXPIRED_TOKEN`           | 401         | Expired JWT token         |
| `FORBIDDEN`               | 403         | Insufficient permissions  |
| `RESOURCE_NOT_FOUND`      | 404         | Resource doesn't exist    |
| `RESOURCE_ALREADY_EXISTS` | 409         | Duplicate resource        |
| `CONFLICT`                | 409         | Business logic conflict   |
| `RATE_LIMIT_EXCEEDED`     | 429         | Too many requests         |
| `INTERNAL_ERROR`          | 500         | Server error              |
| `DATABASE_ERROR`          | 500         | Database operation failed |
| `EXTERNAL_SERVICE_ERROR`  | 502         | OAuth/external API failed |
| `SERVICE_UNAVAILABLE`     | 503         | Service temporarily down  |

---

## Security Considerations

### Implemented Security Measures

1. **Authentication**

   - JWT tokens with short expiry (15min access, 7d refresh)
   - Secure password hashing (bcrypt, 12 rounds)
   - OAuth 2.0 for Google/Microsoft

2. **Authorization**

   - Token-based authentication on protected routes
   - Owner-only access for update/delete operations
   - Admin-only routes (future implementation)

3. **Request Security**

   - Helmet.js for security headers
   - CORS configuration
   - Request size limits (10MB)
   - Rate limiting (5-100 req/min depending on endpoint)

4. **Validation**

   - Joi schema validation on all inputs
   - SQL injection prevention (Prisma ORM)
   - XSS protection (input sanitization)

5. **Error Handling**
   - No sensitive data in error messages
   - Stack traces only in development
   - Standardized error codes

### Future Security Enhancements

1. **Email/Phone Verification** - Complete OTP implementation
2. **API Key Management** - For mobile companion app
3. **CSRF Protection** - For web UI
4. **Content Security Policy** - Header configuration
5. **Input Sanitization** - Additional XSS prevention

---

## Performance Considerations

### Optimization Strategies

1. **Database**

   - Prisma connection pooling
   - Indexed queries (already in schema)
   - Pagination for large datasets
   - Select only required fields

2. **Caching** (Future Implementation)

   - Redis for session storage
   - Cache frequently accessed categories
   - Cache user profiles
   - CDN for images

3. **Rate Limiting**

   - Prevent DDoS attacks
   - Protect against brute force
   - Different limits per endpoint type

4. **Compression** (Future)
   - Gzip/Brotli compression for responses
   - Image optimization

---

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] OAuth credentials obtained
- [ ] API documentation complete
- [ ] Integration tests passing
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Error logging configured

### Deployment Steps

1. Build TypeScript code: `npm run build`
2. Set NODE_ENV to `production`
3. Configure production database connection
4. Set strong JWT secrets
5. Configure CORS for production domains
6. Enable HTTPS/TLS
7. Set up monitoring (Azure Application Insights)
8. Configure CI/CD pipeline
9. Deploy to Azure App Service
10. Verify health endpoint

### Post-Deployment

- [ ] API health check passing
- [ ] Authentication flow working
- [ ] OAuth providers connected
- [ ] Rate limiting functional
- [ ] Error logging active
- [ ] Performance monitoring enabled

---

## Success Metrics

### Technical Metrics

- **API Response Time:** < 200ms for read operations
- **Availability:** > 99.5% uptime
- **Error Rate:** < 1% of requests
- **Test Coverage:** > 80% overall
- **Security Vulnerabilities:** 0 high/critical

### Functional Metrics

- **Endpoints Implemented:** 34/34 (100%)
- **Authentication Methods:** 3 (Email, Google, Microsoft)
- **Protected Routes:** Working with JWT
- **Rate Limiting:** Active on all endpoints
- **Validation:** 100% of inputs validated

---

## Risk Assessment

### High Risk Items

1. **OAuth Token Expiry**

   - **Risk:** External tokens expire during validation
   - **Mitigation:** Implement retry logic, clear error messages

2. **Rate Limiting False Positives**

   - **Risk:** Legitimate users blocked
   - **Mitigation:** IP-based limits, authenticated user exemptions

3. **JWT Secret Exposure**
   - **Risk:** Token forgery if secrets leaked
   - **Mitigation:** Use Azure Key Vault, rotate secrets regularly

### Medium Risk Items

1. **Database Connection Pool Exhaustion**

   - **Risk:** High traffic causes connection issues
   - **Mitigation:** Monitor connections, implement queue

2. **Large Request Bodies**
   - **Risk:** Memory overflow from large uploads
   - **Mitigation:** Request size limits, streaming uploads

---

## Future Enhancements

### Phase 7: Additional Features (Post-MVP)

1. **WebSocket Support** - Real-time notifications
2. **GraphQL API** - Alternative to REST
3. **Admin Dashboard API** - Enhanced admin features
4. **Analytics Endpoints** - Usage statistics
5. **Batch Operations** - Bulk updates/deletes
6. **API Versioning** - v2 with breaking changes
7. **Webhook Support** - Event notifications
8. **File Upload Direct** - Multipart form data
9. **Image Processing** - Thumbnail generation
10. **Search Optimization** - Full-text search with Elasticsearch

---

## Conclusion

This implementation plan provides a complete roadmap for building the REST API layer on top of the existing DEC_L service infrastructure. The modular approach ensures:

- **Maintainability:** Clear separation of concerns
- **Scalability:** Rate limiting, pagination, caching ready
- **Security:** JWT auth, validation, rate limiting
- **Testability:** Comprehensive integration test suite
- **Documentation:** OpenAPI spec, Postman collection

**Estimated Timeline:** 12-18 hours for complete implementation with testing and documentation.

**Next Steps:** Begin Phase 1 (Foundation Setup) and proceed sequentially through phases.

---

## Appendix: Quick Start Commands

```bash
# Install dependencies
npm install express cors helmet express-rate-limit
npm install --save-dev @types/express @types/cors

# Install optional packages
npm install swagger-jsdoc swagger-ui-express morgan winston
npm install --save-dev @types/swagger-jsdoc @types/swagger-ui-express @types/morgan

# Run development server
npm run dev:watch

# Run tests
npm test
npm run test:integration
npm run test:coverage

# Build for production
npm run build
npm start

# Database operations
npx prisma migrate deploy
npx prisma studio
```

---

**Document Version:** 1.0  
**Last Updated:** December 12, 2025  
**Author:** DEC_L Development Team  
**Status:** Ready for Implementation
