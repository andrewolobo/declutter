import { BaseRepository } from "./base.repository";
import { Message, Prisma } from "@prisma/client";
import prisma from "../prisma.client";

/**
 * Message Repository
 * Handles all database operations for messages
 */
export class MessageRepository extends BaseRepository<Message> {
  protected modelName = Prisma.ModelName.Message;

  /**
   * Create a new message
   */
  async create(data: {
    senderId: number;
    recipientId: number;
    content: string;
    messageType?: string;
    postId?: number;
    attachmentUrl?: string;
    parentMessageId?: number;
  }): Promise<Message> {
    return prisma.message.create({
      data: {
        senderId: data.senderId,
        recipientId: data.recipientId,
        content: data.content,
        messageType: data.messageType || "text",
        postId: data.postId,
        attachmentUrl: data.attachmentUrl,
        parentMessageId: data.parentMessageId,
      },
    });
  }

  /**
   * Find message by ID with relations
   */
  async findById(
    id: number,
    options?: {
      includeSender?: boolean;
      includeRecipient?: boolean;
      includePost?: boolean;
    }
  ): Promise<Message | null> {
    const {
      includeSender = false,
      includeRecipient = false,
      includePost = false,
    } = options || {};

    return prisma.message.findUnique({
      where: { id },
      include: {
        sender: includeSender
          ? {
              select: {
                id: true,
                fullName: true,
                profilePictureUrl: true,
              },
            }
          : false,
        recipient: includeRecipient
          ? {
              select: {
                id: true,
                fullName: true,
                profilePictureUrl: true,
              },
            }
          : false,
        post: includePost
          ? {
              select: {
                id: true,
                title: true,
                price: true,
                status: true,
                images: {
                  take: 1,
                  orderBy: { displayOrder: "asc" },
                  select: { imageUrl: true },
                },
              },
            }
          : false,
      },
    });
  }

  /**
   * Get messages between two users (conversation thread)
   */
  async findByConversation(
    userId1: number,
    userId2: number,
    options?: {
      limit?: number;
      offset?: number;
      postId?: number;
    }
  ) {
    const { limit = 50, offset = 0, postId } = options || {};

    return prisma.message.findMany({
      where: {
        AND: [
          {
            OR: [
              { senderId: userId1, recipientId: userId2 },
              { senderId: userId2, recipientId: userId1 },
            ],
          },
          postId ? { postId } : {},
          { isDeleted: false },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profilePictureUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            fullName: true,
            profilePictureUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            price: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get conversation list for a user
   * Returns the last message with each unique user
   */
  async getConversationList(
    userId: number,
    options?: {
      limit?: number;
      offset?: number;
    }
  ) {
    const { limit = 20, offset = 0 } = options || {};

    // Get all users who have conversations with the given user
    const conversations = await prisma.$queryRaw<
      Array<{
        userId: number;
        fullName: string;
        profilePictureUrl: string | null;
        lastMessage: string;
        lastMessageAt: Date;
        lastMessageSenderId: number;
        unreadCount: bigint;
        postId: number | null;
        postTitle: string | null;
      }>
    >`
      WITH ConversationUsers AS (
        SELECT DISTINCT
          CASE
            WHEN "SenderID" = ${userId} THEN "RecipientID"
            ELSE "SenderID"
          END AS "OtherUserId"
        FROM "Messages"
        WHERE ("SenderID" = ${userId} OR "RecipientID" = ${userId})
          AND "IsDeleted" = false
      ),
      LastMessages AS (
        SELECT
          cu."OtherUserId",
          m."MessageID",
          m."MessageContent",
          m."CreatedAt",
          m."SenderID",
          m."PostID",
          ROW_NUMBER() OVER (PARTITION BY cu."OtherUserId" ORDER BY m."CreatedAt" DESC) as rn
        FROM ConversationUsers cu
        INNER JOIN "Messages" m ON (
          (m."SenderID" = ${userId} AND m."RecipientID" = cu."OtherUserId")
          OR (m."RecipientID" = ${userId} AND m."SenderID" = cu."OtherUserId")
        )
        WHERE m."IsDeleted" = false
      ),
      UnreadCounts AS (
        SELECT
          m."SenderID" AS "OtherUserId",
          COUNT(*) as "UnreadCount"
        FROM "Messages" m
        WHERE m."RecipientID" = ${userId}
          AND m."IsReadByRecipient" = false
          AND m."IsDeleted" = false
        GROUP BY m."SenderID"
      )
      SELECT
        u."UserID" as "userId",
        u."FullName" as "fullName",
        u."ProfilePictureURL" as "profilePictureUrl",
        lm."MessageContent" as "lastMessage",
        lm."CreatedAt" as "lastMessageAt",
        lm."SenderID" as "lastMessageSenderId",
        COALESCE(uc."UnreadCount", 0) as "unreadCount",
        lm."PostID" as "postId",
        p."Title" as "postTitle"
      FROM LastMessages lm
      INNER JOIN "Users" u ON u."UserID" = lm."OtherUserId"
      LEFT JOIN UnreadCounts uc ON uc."OtherUserId" = lm."OtherUserId"
      LEFT JOIN "Posts" p ON p."PostID" = lm."PostID"
      WHERE lm.rn = 1
      ORDER BY lm."CreatedAt" DESC
      OFFSET ${offset} LIMIT ${limit}
    `;

    // Convert bigint to number for unreadCount
    return conversations.map((conv) => ({
      ...conv,
      unreadCount: Number(conv.unreadCount),
    }));
  }

  /**
   * Mark a message as read by recipient
   */
  async markAsReadByRecipient(messageId: number): Promise<Message> {
    return prisma.message.update({
      where: { id: messageId },
      data: {
        isReadByRecipient: true,
        recipientReadAt: new Date(),
        // Also update legacy fields for backward compatibility
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark a message as read by sender
   */
  async markAsReadBySender(messageId: number): Promise<Message> {
    return prisma.message.update({
      where: { id: messageId },
      data: {
        isReadBySender: true,
        senderReadAt: new Date(),
      },
    });
  }

  /**
   * Mark a message as read (legacy method - marks recipient read)
   * @deprecated Use markAsReadByRecipient or markAsReadBySender instead
   */
  async markAsRead(messageId: number): Promise<Message> {
    return this.markAsReadByRecipient(messageId);
  }

  /**
   * Mark all messages in a conversation as read by recipient
   * (messages sent by otherUser to userId)
   */
  async markConversationAsReadByRecipient(
    userId: number,
    otherUserId: number
  ): Promise<number> {
    const result = await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        recipientId: userId,
        isReadByRecipient: false,
        isDeleted: false,
      },
      data: {
        isReadByRecipient: true,
        recipientReadAt: new Date(),
        // Also update legacy fields for backward compatibility
        isRead: true,
        readAt: new Date(),
      },
    });

    return result.count;
  }

  /**
   * Mark all messages in a conversation as read by sender
   * (messages sent by userId to otherUser)
   */
  async markConversationAsReadBySender(
    userId: number,
    otherUserId: number
  ): Promise<number> {
    const result = await prisma.message.updateMany({
      where: {
        senderId: userId,
        recipientId: otherUserId,
        isReadBySender: false,
        isDeleted: false,
      },
      data: {
        isReadBySender: true,
        senderReadAt: new Date(),
      },
    });

    return result.count;
  }

  /**
   * Mark all messages in a conversation as read (both parties)
   * This marks incoming messages as read by recipient AND outgoing messages as read by sender
   */
  async markConversationAsRead(
    userId: number,
    otherUserId: number
  ): Promise<{ recipientCount: number; senderCount: number }> {
    const recipientCount = await this.markConversationAsReadByRecipient(
      userId,
      otherUserId
    );
    const senderCount = await this.markConversationAsReadBySender(
      userId,
      otherUserId
    );
    return { recipientCount, senderCount };
  }

  /**
   * Soft delete a message
   */
  async softDelete(messageId: number, userId: number): Promise<Message> {
    return prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedBy: userId,
      },
    });
  }

  /**
   * Update message content (for editing)
   */
  async update(messageId: number, content: string): Promise<Message> {
    return prisma.message.update({
      where: { id: messageId },
      data: {
        content,
        isEdited: true,
        editedAt: new Date(),
      },
    });
  }

  /**
   * Get unread message count for a user (messages they received but haven't read)
   */
  async getUnreadCount(userId: number): Promise<number> {
    return prisma.message.count({
      where: {
        recipientId: userId,
        isReadByRecipient: false,
        isDeleted: false,
      },
    });
  }

  /**
   * Get unread count per conversation (messages user hasn't read from other user)
   */
  async getUnreadCountByConversation(
    userId: number,
    otherUserId: number
  ): Promise<number> {
    return prisma.message.count({
      where: {
        senderId: otherUserId,
        recipientId: userId,
        isReadByRecipient: false,
        isDeleted: false,
      },
    });
  }

  /**
   * Check if user is participant in a message
   */
  async isParticipant(messageId: number, userId: number): Promise<boolean> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: {
        senderId: true,
        recipientId: true,
      },
    });

    if (!message) return false;
    return message.senderId === userId || message.recipientId === userId;
  }

  /**
   * Check if message belongs to sender
   */
  async isSender(messageId: number, userId: number): Promise<boolean> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: {
        senderId: true,
      },
    });

    if (!message) return false;
    return message.senderId === userId;
  }
}
