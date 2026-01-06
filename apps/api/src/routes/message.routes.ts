import { Router } from "express";
import { messageController } from "../controllers";
import {
  authenticate,
  validate,
  validateParams,
  validateQuery,
} from "../middleware";
import {
  createLimiter,
  readLimiter,
} from "../middleware/rate-limit.middleware";
import {
  createMessageSchema,
  updateMessageSchema,
  messageIdSchema,
  userIdSchema,
  conversationQuerySchema,
  messageQuerySchema,
} from "../validation/message.validation";

const router = Router();

// All message routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/messages/conversations
 * @desc    Get conversation list for authenticated user
 * @access  Private
 */
router.get(
  "/conversations",
  readLimiter,
  validateQuery(conversationQuerySchema),
  messageController.getConversations
);

/**
 * @route   POST /api/v1/messages/conversations/:userId/read
 * @desc    Mark all messages in a conversation as read
 * @access  Private
 */
router.post(
  "/conversations/:userId/read",
  createLimiter,
  validateParams(userIdSchema),
  messageController.markConversationAsRead
);

/**
 * @route   GET /api/v1/messages/unread-count
 * @desc    Get unread message count for authenticated user
 * @access  Private
 */
router.get("/unread-count", readLimiter, messageController.getUnreadCount);

/**
 * @route   GET /api/v1/messages/user/:userId
 * @desc    Get messages with a specific user
 * @access  Private
 */
router.get(
  "/user/:userId",
  readLimiter,
  validateParams(userIdSchema),
  validateQuery(messageQuerySchema),
  messageController.getMessages
);

/**
 * @route   POST /api/v1/messages
 * @desc    Send a new message
 * @access  Private
 */
router.post(
  "/",
  createLimiter,
  validate(createMessageSchema),
  messageController.sendMessage
);

/**
 * @route   POST /api/v1/messages/:id/read
 * @desc    Mark a message as read
 * @access  Private
 */
router.post(
  "/:id/read",
  createLimiter,
  validateParams(messageIdSchema),
  messageController.markAsRead
);

/**
 * @route   PUT /api/v1/messages/:id
 * @desc    Edit a message
 * @access  Private
 */
router.put(
  "/:id",
  createLimiter,
  validateParams(messageIdSchema),
  validate(updateMessageSchema),
  messageController.updateMessage
);

/**
 * @route   DELETE /api/v1/messages/:id
 * @desc    Delete a message (soft delete)
 * @access  Private
 */
router.delete(
  "/:id",
  createLimiter,
  validateParams(messageIdSchema),
  messageController.deleteMessage
);

export default router;
