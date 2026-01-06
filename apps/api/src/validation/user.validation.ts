/**
 * Validation schemas for user endpoints
 */
import Joi from "joi";

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).optional(),
  phoneNumber: Joi.string().optional(),
  profilePictureUrl: Joi.string().uri().optional(),
  location: Joi.string().optional(),
  bio: Joi.string().max(500).optional(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "New password must be at least 8 characters long",
    "any.required": "New password is required",
  }),
});

export const resetPasswordRequestSchema = Joi.object({
  emailAddress: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email address is required",
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Reset token is required",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "New password is required",
  }),
});

export const userIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be a positive number",
    "any.required": "User ID is required",
  }),
});
