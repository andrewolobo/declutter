/**
 * Validation schemas for authentication endpoints
 */
import Joi from "joi";

export const registerSchema = Joi.object({
  emailAddress: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email address is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
  fullName: Joi.string().min(2).required().messages({
    "string.min": "Full name must be at least 2 characters long",
    "any.required": "Full name is required",
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Phone number must be in international format (e.g., +256700123456)",
    }),
  profilePictureUrl: Joi.string().uri().optional().messages({
    "string.uri": "Profile picture URL must be a valid URI",
  }),
  location: Joi.string().max(255).optional().messages({
    "string.max": "Location must not exceed 255 characters",
  }),
  bio: Joi.string().max(500).optional().messages({
    "string.max": "Bio must not exceed 500 characters",
  }),
});

export const loginSchema = Joi.object({
  emailAddress: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email address is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export const oauthSchema = Joi.object({
  provider: Joi.string()
    .valid("Google", "Microsoft", "Facebook")
    .required()
    .messages({
      "any.only": "Provider must be Google, Microsoft, or Facebook",
      "any.required": "OAuth provider is required",
    }),
  accessToken: Joi.string().required().messages({
    "any.required": "Access token is required",
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
});
