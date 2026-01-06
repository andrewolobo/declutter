/**
 * Validation schemas for message endpoints
 */
import Joi from "joi";

export const createMessageSchema = Joi.object({
  recipientId: Joi.number().integer().positive().required().messages({
    "number.base": "Recipient ID must be a number",
    "number.positive": "Invalid recipient ID",
    "any.required": "Recipient ID is required",
  }),
  messageContent: Joi.string().min(1).max(5000).required().messages({
    "string.min": "Message cannot be empty",
    "string.max": "Message cannot exceed 5000 characters",
    "any.required": "Message content is required",
  }),
  messageType: Joi.string()
    .valid("text", "image", "system")
    .default("text")
    .messages({
      "any.only": "Message type must be one of: text, image, system",
    }),
  postId: Joi.number().integer().positive().optional().messages({
    "number.base": "Post ID must be a number",
    "number.positive": "Invalid post ID",
  }),
  attachmentUrl: Joi.string().uri().max(500).optional().messages({
    "string.uri": "Attachment URL must be a valid URI",
    "string.max": "Attachment URL cannot exceed 500 characters",
  }),
  parentMessageId: Joi.number().integer().positive().optional().messages({
    "number.base": "Parent message ID must be a number",
    "number.positive": "Invalid parent message ID",
  }),
});

export const updateMessageSchema = Joi.object({
  messageContent: Joi.string().min(1).max(5000).optional().messages({
    "string.min": "Message cannot be empty",
    "string.max": "Message cannot exceed 5000 characters",
  }),
});

export const messageIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Message ID must be a number",
    "number.positive": "Invalid message ID",
    "any.required": "Message ID is required",
  }),
});

export const userIdSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.positive": "Invalid user ID",
    "any.required": "User ID is required",
  }),
});

export const conversationQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
  offset: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Offset must be a number",
    "number.min": "Offset cannot be negative",
  }),
});

export const messageQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50).messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
  offset: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Offset must be a number",
    "number.min": "Offset cannot be negative",
  }),
  postId: Joi.number().integer().positive().optional().messages({
    "number.base": "Post ID must be a number",
    "number.positive": "Invalid post ID",
  }),
});
