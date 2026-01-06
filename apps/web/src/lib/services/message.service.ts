import { apiClient } from './api.client';
import type { ApiResponse, PaginatedResponse } from '$types/api.types';
import type {
	MessageResponseDTO,
	ConversationResponseDTO,
	CreateMessageDTO,
	UpdateMessageDTO,
	ConversationPreviewDTO
} from '$types/message.types';
import { messageStore } from '$lib/stores/message.store';
import { handleError } from '$lib/utils/error-handler';

/**
 * Message Service
 * Handles all messaging-related API calls with WebSocket support
 *
 * Features:
 * - Real-time messaging via WebSocket
 * - Conversation management
 * - Message CRUD operations
 * - Read receipts
 * - Typing indicators
 * - Message search
 * - Automatic store updates
 */

// ============================================================================
// WebSocket Connection Management
// ============================================================================

let wsConnection: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Connect to WebSocket server for real-time messaging
 */
export function connectWebSocket(token: string): void {
	if (wsConnection?.readyState === WebSocket.OPEN) {
		console.log('WebSocket already connected');
		return;
	}

	const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
	const url = `${wsUrl}/messages?token=${token}`;

	try {
		wsConnection = new WebSocket(url);

		wsConnection.onopen = () => {
			console.log('WebSocket connected');
			messageStore.setWebSocketConnected(true);
			reconnectAttempts = 0;

			// Start heartbeat
			startHeartbeat();
		};

		wsConnection.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				handleWebSocketMessage(data);
			} catch (error) {
				console.error('Failed to parse WebSocket message:', error);
			}
		};

		wsConnection.onerror = (error) => {
			console.error('WebSocket error:', error);
			messageStore.setWebSocketError('Connection error');
		};

		wsConnection.onclose = () => {
			console.log('WebSocket disconnected');
			messageStore.setWebSocketConnected(false);
			stopHeartbeat();

			// Attempt reconnection
			if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
				reconnectAttempts++;
				console.log(`Reconnecting... (Attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
				reconnectTimeout = setTimeout(() => connectWebSocket(token), RECONNECT_DELAY);
			}
		};
	} catch (error) {
		console.error('Failed to create WebSocket connection:', error);
		messageStore.setWebSocketError('Failed to connect');
	}
}

/**
 * Disconnect from WebSocket server
 */
export function disconnectWebSocket(): void {
	if (reconnectTimeout) {
		clearTimeout(reconnectTimeout);
		reconnectTimeout = null;
	}

	stopHeartbeat();

	if (wsConnection) {
		wsConnection.close();
		wsConnection = null;
	}

	messageStore.setWebSocketConnected(false);
	reconnectAttempts = 0;
}

/**
 * Send heartbeat to keep connection alive
 */
function startHeartbeat(): void {
	heartbeatInterval = setInterval(() => {
		if (wsConnection?.readyState === WebSocket.OPEN) {
			wsConnection.send(JSON.stringify({ type: 'ping' }));
		}
	}, 30000); // 30 seconds
}

/**
 * Stop heartbeat
 */
function stopHeartbeat(): void {
	if (heartbeatInterval) {
		clearInterval(heartbeatInterval);
		heartbeatInterval = null;
	}
}

/**
 * Handle incoming WebSocket messages
 */
function handleWebSocketMessage(data: any): void {
	switch (data.type) {
		case 'message':
			// New message received
			if (data.message) {
				messageStore.addMessage(data.message);
				messageStore.updateConversationPreview(data.message);
				// Increment unread count for incoming messages
				messageStore.incrementUnreadCount();
			}
			break;

		case 'message_read':
			// Message marked as read
			if (data.messageId) {
				messageStore.markMessageAsRead(data.messageId);
			}
			break;

		case 'typing':
			// User is typing
			if (data.userId && data.conversationId) {
				messageStore.setTypingIndicator(data.conversationId, data.userId, true);
				// Clear typing indicator after 3 seconds
				setTimeout(() => {
					messageStore.setTypingIndicator(data.conversationId, data.userId, false);
				}, 3000);
			}
			break;

		case 'message_deleted':
			// Message was deleted
			if (data.messageId) {
				messageStore.removeMessage(data.messageId);
			}
			break;

		case 'message_edited':
			// Message was edited
			if (data.message) {
				messageStore.updateMessage(data.message.messageId, data.message);
			}
			break;

		case 'pong':
			// Heartbeat response
			break;

		default:
			console.log('Unknown WebSocket message type:', data.type);
	}
}

/**
 * Send WebSocket message
 */
function sendWebSocketMessage(data: any): void {
	if (wsConnection?.readyState === WebSocket.OPEN) {
		wsConnection.send(JSON.stringify(data));
	} else {
		console.warn('WebSocket not connected, cannot send message');
	}
}

// ============================================================================
// Conversation Management
// ============================================================================

/**
 * Get all conversations for the current user
 */
export async function getConversations(
	limit = 20,
	offset = 0
): Promise<PaginatedResponse<ConversationPreviewDTO>> {
	try {
		messageStore.setLoading(true);

		const response = await apiClient.get<PaginatedResponse<ConversationPreviewDTO>>(
			'/messages/conversations',
			{
				params: { limit, offset }
			}
		);

		// Update store
		if (response.data.data) {
			messageStore.setConversations(response.data.data);
		}

		messageStore.setLoading(false);
		return response.data;
	} catch (error) {
		messageStore.setLoading(false);
		throw handleError(error);
	}
}

/**
 * Get a specific conversation with another user
 */
export async function getConversation(
	userId: number,
	postId?: number
): Promise<ApiResponse<ConversationResponseDTO>> {
	try {
		messageStore.setLoading(true);

		const params: any = {};
		if (postId) params.postId = postId;

		const response = await apiClient.get<ApiResponse<ConversationResponseDTO>>(
			`/messages/conversations/${userId}`,
			{ params }
		);

		// Update store
		if (response.data.data) {
			messageStore.setMessages(response.data.data.messages);
		}

		messageStore.setLoading(false);
		return response.data;
	} catch (error) {
		messageStore.setLoading(false);
		throw handleError(error);
	}
}

/**
 * Get conversation by ID
 */
export async function getConversationById(
	conversationId: number
): Promise<ApiResponse<ConversationResponseDTO>> {
	try {
		const response = await apiClient.get<ApiResponse<ConversationResponseDTO>>(
			`/messages/conversations/id/${conversationId}`
		);

		// Update store
		if (response.data.data) {
			messageStore.setMessages(response.data.data.messages);
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * Delete a conversation
 */
export async function deleteConversation(userId: number): Promise<ApiResponse<void>> {
	try {
		const response = await apiClient.delete<ApiResponse<void>>(`/messages/conversations/${userId}`);

		// Update store
		messageStore.removeConversation(userId);

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

// ============================================================================
// Message CRUD Operations
// ============================================================================

/**
 * Send a new message
 */
export async function sendMessage(
	data: CreateMessageDTO
): Promise<ApiResponse<MessageResponseDTO>> {
	try {
		const response = await apiClient.post<ApiResponse<MessageResponseDTO>>('/messages', data);

		// Add to store
		if (response.data.success && response.data.data) {
			messageStore.addMessage(response.data.data);
			messageStore.updateConversationPreview(response.data.data);
		}

		// Send via WebSocket for real-time delivery
		if (wsConnection?.readyState === WebSocket.OPEN) {
			sendWebSocketMessage({
				type: 'message',
				message: response.data.data
			});
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * Get messages for a conversation
 */
export async function getMessages(
	userId: number,
	limit = 50,
	offset = 0,
	postId?: number
): Promise<PaginatedResponse<MessageResponseDTO>> {
	try {
		const params: any = { limit, offset };
		if (postId) params.postId = postId;

		const response = await apiClient.get<PaginatedResponse<MessageResponseDTO>>(
			`/messages/user/${userId}`,
			{ params }
		);

		// Update store
		if (response.data.data) {
			messageStore.setMessages(response.data.data);
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * Get a specific message by ID
 */
export async function getMessage(messageId: number): Promise<ApiResponse<MessageResponseDTO>> {
	try {
		const response = await apiClient.get<ApiResponse<MessageResponseDTO>>(`/messages/${messageId}`);

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * Edit a message
 */
export async function editMessage(
	messageId: number,
	data: UpdateMessageDTO
): Promise<ApiResponse<MessageResponseDTO>> {
	try {
		const response = await apiClient.put<ApiResponse<MessageResponseDTO>>(
			`/messages/${messageId}`,
			data
		);

		// Update store
		if (response.data.success && response.data.data) {
			messageStore.updateMessage(messageId, response.data.data);
		}

		// Send via WebSocket
		if (wsConnection?.readyState === WebSocket.OPEN) {
			sendWebSocketMessage({
				type: 'message_edited',
				message: response.data.data
			});
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId: number): Promise<ApiResponse<void>> {
	try {
		const response = await apiClient.delete<ApiResponse<void>>(`/messages/${messageId}`);

		// Update store
		messageStore.removeMessage(messageId);

		// Send via WebSocket
		if (wsConnection?.readyState === WebSocket.OPEN) {
			sendWebSocketMessage({
				type: 'message_deleted',
				messageId
			});
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

// ============================================================================
// Read Receipts
// ============================================================================

/**
 * Mark a message as read
 */
export async function markMessageAsRead(messageId: number): Promise<ApiResponse<void>> {
	try {
		const response = await apiClient.post<ApiResponse<void>>(`/messages/${messageId}/read`);

		// Update store
		messageStore.markMessageAsRead(messageId);

		// Send via WebSocket
		if (wsConnection?.readyState === WebSocket.OPEN) {
			sendWebSocketMessage({
				type: 'message_read',
				messageId
			});
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * Mark all messages in a conversation as read
 */
export async function markConversationAsRead(userId: number): Promise<ApiResponse<void>> {
	try {
		const response = await apiClient.post<ApiResponse<void>>(
			`/messages/conversations/${userId}/read`
		);

		// Update store
		messageStore.markConversationAsRead(userId);

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * Get unread message count
 */
export async function getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
	try {
		const response = await apiClient.get<ApiResponse<{ count: number }>>('/messages/unread-count');

		// Update store
		if (response.data.data) {
			messageStore.setUnreadCount(response.data.data.count);
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

// ============================================================================
// Typing Indicators
// ============================================================================

/**
 * Send typing indicator
 */
export function sendTypingIndicator(conversationId: number, userId: number): void {
	if (wsConnection?.readyState === WebSocket.OPEN) {
		sendWebSocketMessage({
			type: 'typing',
			conversationId,
			userId
		});
	}
}

/**
 * Stop typing indicator
 */
export function stopTypingIndicator(conversationId: number, userId: number): void {
	messageStore.setTypingIndicator(conversationId, userId, false);
}

// ============================================================================
// Message Search
// ============================================================================

/**
 * Search messages
 */
export async function searchMessages(
	query: string,
	userId?: number,
	limit = 20,
	offset = 0
): Promise<PaginatedResponse<MessageResponseDTO>> {
	try {
		const params: any = { query, limit, offset };
		if (userId) params.userId = userId;

		const response = await apiClient.get<PaginatedResponse<MessageResponseDTO>>(
			'/messages/search',
			{ params }
		);

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

// ============================================================================
// Message Attachments
// ============================================================================

/**
 * Upload message attachment (image)
 */
export async function uploadMessageAttachment(file: File): Promise<ApiResponse<{ url: string }>> {
	try {
		const formData = new FormData();
		formData.append('file', file);

		const response =
			(await apiClient.post) <
			ApiResponse <
			{ url: string } >>>
				('/messages/attachments',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				});

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format message timestamp
 */
export function formatMessageTime(date: Date | string): string {
	const messageDate = new Date(date);
	const now = new Date();
	const diffMs = now.getTime() - messageDate.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;

	return messageDate.toLocaleDateString();
}

/**
 * Check if message is from current user
 */
export function isMyMessage(message: MessageResponseDTO, currentUserId: number): boolean {
	return message.senderId === currentUserId;
}

/**
 * Get conversation partner from message
 */
export function getConversationPartner(message: MessageResponseDTO, currentUserId: number): number {
	return message.senderId === currentUserId ? message.recipientId : message.senderId;
}

/**
 * Group messages by date
 */
export function groupMessagesByDate(
	messages: MessageResponseDTO[]
): Record<string, MessageResponseDTO[]> {
	const grouped: Record<string, MessageResponseDTO[]> = {};

	for (const message of messages) {
		const date = new Date(message.createdAt).toLocaleDateString();
		if (!grouped[date]) {
			grouped[date] = [];
		}
		grouped[date].push(message);
	}

	return grouped;
}

/**
 * Clear message cache
 */
export function clearMessageCache(): void {
	messageStore.clearMessages();
	messageStore.clearConversations();
}

// ============================================================================
// Export all functions
// ============================================================================

export const messageService = {
	// WebSocket
	connectWebSocket,
	disconnectWebSocket,
	sendTypingIndicator,
	stopTypingIndicator,

	// Conversations
	getConversations,
	getConversation,
	getConversationById,
	deleteConversation,

	// Messages
	sendMessage,
	getMessages,
	getMessage,
	editMessage,
	deleteMessage,

	// Read Receipts
	markMessageAsRead,
	markConversationAsRead,
	getUnreadCount,

	// Search
	searchMessages,

	// Attachments
	uploadMessageAttachment,

	// Utilities
	formatMessageTime,
	isMyMessage,
	getConversationPartner,
	groupMessagesByDate,
	clearMessageCache
};
