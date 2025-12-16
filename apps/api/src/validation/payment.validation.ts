/**
 * Validation schemas for payment endpoints
 */
import Joi from "joi";

export const createPaymentSchema = Joi.object({
  postId: Joi.number().integer().positive().required().messages({
    "number.base": "Post ID must be a number",
    "number.positive": "Invalid post ID",
    "any.required": "Post ID is required",
  }),
  pricingTierId: Joi.number().integer().positive().required().messages({
    "number.base": "Pricing tier ID must be a number",
    "number.positive": "Invalid pricing tier ID",
    "any.required": "Pricing tier is required",
  }),
  paymentMethod: Joi.string()
    .valid("Card", "MobileMoney", "BankTransfer")
    .required()
    .messages({
      "any.only": "Payment method must be Card, MobileMoney, or BankTransfer",
      "any.required": "Payment method is required",
    }),
});

export const confirmPaymentSchema = Joi.object({
  transactionReference: Joi.string().required().messages({
    "any.required": "Transaction reference is required",
  }),
});

export const paymentIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Payment ID must be a number",
    "number.positive": "Invalid payment ID",
    "any.required": "Payment ID is required",
  }),
});

export const postIdSchema = Joi.object({
  postId: Joi.number().integer().positive().required().messages({
    "number.base": "Post ID must be a number",
    "number.positive": "Invalid post ID",
    "any.required": "Post ID is required",
  }),
});
