/**
 * Message Controller
 * Handles HTTP requests for messaging functionality
 */
import { Request, Response, NextFunction } from "express";
import { messageService } from "../services";
import {
  CreateMessageDTO,
  UpdateMessageDTO,
  MessageQueryOptions,
  ConversationQueryOptions,
} from "../types/message/message.types";

export class MessageController {
  /**
   * Send a new message
   * POST /api/v1/messages
   */
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const senderId = req.user!.userId;
      const dto: CreateMessageDTO = req.body;
      const result = await messageService.sendMessage(senderId, dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get conversation list for authenticated user
   * GET /api/v1/messages/conversations
   */
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const options: ConversationQueryOptions = {
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await messageService.getConversations(userId, options);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get messages with a specific user
   * GET /api/v1/messages/user/:userId
   */
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const otherUserId = parseInt(req.params.userId);
      const options: MessageQueryOptions = {
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        postId: req.query.postId
          ? parseInt(req.query.postId as string)
          : undefined,
      };

      const result = await messageService.getMessages(
        userId,
        otherUserId,
        options
      );

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark a message as read
   * POST /api/v1/messages/:id/read
   */
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const messageId = parseInt(req.params.id);

      const result = await messageService.markAsRead(userId, messageId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark all messages in a conversation as read
   * POST /api/v1/messages/conversations/:userId/read
   */
  async markConversationAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.userId;
      const otherUserId = parseInt(req.params.userId);

      const result = await messageService.markConversationAsRead(
        userId,
        otherUserId
      );

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update (edit) a message
   * PUT /api/v1/messages/:id
   */
  async updateMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const messageId = parseInt(req.params.id);
      const dto: UpdateMessageDTO = req.body;

      if (!dto.messageContent) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Message content is required",
            statusCode: 400,
          },
        });
      }

      const result = await messageService.editMessage(
        userId,
        messageId,
        dto.messageContent
      );

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a message (soft delete)
   * DELETE /api/v1/messages/:id
   */
  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const messageId = parseInt(req.params.id);

      const result = await messageService.deleteMessage(userId, messageId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get unread message count for authenticated user
   * GET /api/v1/messages/unread-count
   */
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const result = await messageService.getUnreadCount(userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const messageController = new MessageController();
