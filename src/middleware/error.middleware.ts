import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "../types/common/api-response.types";

/**
 * Global error handling middleware
 * Catches any unhandled errors and returns standardized error response
 * Must be registered as the last middleware in the app
 */
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

/**
 * 404 Not Found handler for undefined routes
 * Should be registered after all route definitions
 */
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
