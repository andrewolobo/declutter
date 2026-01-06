/**
 * Message Types
 * DTOs and interfaces for the messaging system
 */

/**
 * Message type enum
 */
export type MessageType = "text" | "image" | "system";

/**
 * Create message DTO
 * Used when sending a new message
 */
export interface CreateMessageDTO {
  recipientId: number;
  messageContent: string;
  messageType?: MessageType;
  postId?: number;
  attachmentUrl?: string;
  parentMessageId?: number;
}

/**
 * Update message DTO
 * Used when editing a message
 */
export interface UpdateMessageDTO {
  messageContent?: string;
  isRead?: boolean;
  isDeleted?: boolean;
}

/**
 * Message response DTO
 * Full message data returned from API
 */
export interface MessageResponseDTO {
  messageId: number;
  senderId: number;
  recipientId: number;
  postId?: number;
  messageContent: string;
  messageType: MessageType;
  attachmentUrl?: string;
  // Dual-party read tracking
  isReadByRecipient: boolean;
  recipientReadAt?: Date;
  isReadBySender: boolean;
  senderReadAt?: Date;
  // Legacy field (mirrors isReadByRecipient for backward compatibility)
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
  deletedBy?: number;
  isEdited: boolean;
  editedAt?: Date;
  parentMessageId?: number;
  createdAt: Date;
  updatedAt: Date;
  sender?: MessageUserDTO;
  recipient?: MessageUserDTO;
  post?: MessagePostDTO;
}

/**
 * Conversation preview DTO
 * Summary of a conversation for the conversation list
 */
export interface ConversationPreviewDTO {
  userId: number;
  fullName: string;
  profilePictureUrl?: string;
  lastMessage: string;
  lastMessageAt: Date;
  lastMessageSenderId: number;
  unreadCount: number;
  isOnline?: boolean;
  postId?: number;
  postTitle?: string;
}

/**
 * Message user DTO
 * User information included in message responses
 */
export interface MessageUserDTO {
  userId: number;
  fullName: string;
  profilePictureUrl?: string;
  isOnline?: boolean;
}

/**
 * Message post DTO
 * Post information included in message responses
 */
export interface MessagePostDTO {
  postId: number;
  title: string;
  price: number;
  imageUrl?: string;
  status: string;
}

/**
 * Message query options
 * Pagination and filtering for message threads
 */
export interface MessageQueryOptions {
  limit?: number;
  offset?: number;
  postId?: number;
}

/**
 * Conversation query options
 * Pagination for conversation list
 */
export interface ConversationQueryOptions {
  limit?: number;
  offset?: number;
}
