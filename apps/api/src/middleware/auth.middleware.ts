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

/**
 * Middleware to authenticate requests using JWT tokens
 * Expects Authorization header with Bearer token
 * Sets req.user with decoded token payload on success
 */
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

    // Attach user info to request
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

/**
 * Middleware for optional authentication
 * Attaches user info if valid token is provided, but doesn't fail if missing
 * Useful for endpoints that work for both authenticated and anonymous users
 */
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

/**
 * Middleware to require admin role
 * Must be used after authenticate middleware
 * TODO: Implement after adding isAdmin check to User model
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: Implement admin check when User.isAdmin field is available
  // For now, all authenticated users can access
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: ErrorCode.UNAUTHORIZED,
        message: "Authentication required",
        statusCode: 401,
      },
    });
  }

  // TODO: Check if user is admin
  // const user = await userRepository.findById(req.user.userId);
  // if (!user?.isAdmin) {
  //   return res.status(403).json({
  //     success: false,
  //     error: {
  //       code: ErrorCode.FORBIDDEN,
  //       message: 'Admin access required',
  //       statusCode: 403,
  //     },
  //   });
  // }

  next();
};
