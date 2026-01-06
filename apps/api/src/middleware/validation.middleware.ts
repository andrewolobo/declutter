import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ErrorCode } from "../types/common/api-response.types";

/**
 * Middleware to validate request body against Joi schema
 * @param schema - Joi schema to validate against
 * @returns Express middleware function
 */
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

    // Replace body with validated and sanitized data
    req.body = value;
    next();
  };
};

/**
 * Middleware to validate query parameters against Joi schema
 * @param schema - Joi schema to validate against
 * @returns Express middleware function
 */
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

    // Store validated query in a custom property since req.query is read-only
    Object.assign(req.query, value);
    next();
  };
};

/**
 * Middleware to validate route parameters against Joi schema
 * @param schema - Joi schema to validate against
 * @returns Express middleware function
 */
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

    // Replace params with validated data
    req.params = value;
    next();
  };
};
