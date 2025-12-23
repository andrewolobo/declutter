import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { messageService } from './message.service';
import { apiClient } from './api.client';
import { messageStore } from '$lib/stores/message.store';

// Mock dependencies
vi.mock('./api.client');
vi.mock('$lib/stores/message.store', () => ({
	messageStore: {
		setMessages: vi.fn(),
		addMessage: vi.fn(),
		updateMessage: vi.fn(),
		removeMessage: vi.fn(),
		markMessageAsRead: vi.fn(),
		markConversationAsRead: vi.fn(),
		setConversations: vi.fn(),
		updateConversationPreview: vi.fn(),
		removeConversation: vi.fn(),
		setTypingIndicator: vi.fn(),
		setUnreadCount: vi.fn(),
		setLoading: vi.fn(),
		setError: vi.fn(),
		setWebSocketConnected: vi.fn(),
		setWebSocketError: vi.fn(),
		clearMessages: vi.fn(),
		clearConversations: vi.fn()
	}
}));

// Mock WebSocket
class MockWebSocket {
	readyState = WebSocket.OPEN;
	onopen: ((event: Event) => void) | null = null;
	onmessage: ((event: MessageEvent) => void) | null = null;
	onerror: ((event: Event) => void) | null = null;
	onclose: ((event: CloseEvent) => void) | null = null;

	constructor(public url: string) {
		setTimeout(() => {
			if (this.onopen) this.onopen(new Event('open'));
		}, 0);
	}

	send(data: string) {
		// Mock send
	}

	close() {
		if (this.onclose) {
			this.onclose(new CloseEvent('close'));
		}
	}
}

// @ts-ignore
global.WebSocket = MockWebSocket;

describe('Message Service', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		messageService.disconnectWebSocket();
	});

	// ========================================================================
	// Conversation Management Tests
	// ========================================================================

	describe('getConversations', () => {
		it('fetches conversations from API', async () => {
			const mockConversations = [
				{
					userId: 2,
					username: 'john_doe',
					profilePicture: 'https://example.com/avatar.jpg',
					lastMessage: 'Hello!',
					lastMessageAt: '2025-12-23T10:00:00Z',
					unreadCount: 2,
					isOnline: true
				},
				{
					userId: 3,
					username: 'jane_smith',
					profilePicture: null,
					lastMessage: 'How are you?',
					lastMessageAt: '2025-12-23T09:00:00Z',
					unreadCount: 0,
					isOnline: false
				}
			];

			vi.mocked(apiClient.get).mockResolvedValue({
				data: {
					data: mockConversations,
					total: 2,
					page: 1,
					limit: 20
				}
			});

			const result = await messageService.getConversations(20, 0);

			expect(apiClient.get).toHaveBeenCalledWith('/messages/conversations', {
				params: { limit: 20, offset: 0 }
			});
			expect(messageStore.setConversations).toHaveBeenCalledWith(mockConversations);
			expect(result.data).toEqual(mockConversations);
		});

		it('sets loading state during fetch', async () => {
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { data: [], total: 0, page: 1, limit: 20 }
			});

			await messageService.getConversations();

			expect(messageStore.setLoading).toHaveBeenCalledWith(true);
			expect(messageStore.setLoading).toHaveBeenCalledWith(false);
		});
	});

	describe('getConversation', () => {
		it('fetches conversation with specific user', async () => {
			const mockConversation = {
				conversationId: 1,
				userId: 2,
				messages: [
					{
						messageId: 1,
						senderId: 1,
						recipientId: 2,
						messageContent: 'Hello!',
						messageType: 'text',
						isRead: true,
						createdAt: '2025-12-23T10:00:00Z'
					}
				]
			};

			vi.mocked(apiClient.get).mockResolvedValue({
				data: {
					success: true,
					data: mockConversation
				}
			});

			const result = await messageService.getConversation(2);

			expect(apiClient.get).toHaveBeenCalledWith('/messages/conversations/2', {
				params: {}
			});
			expect(messageStore.setMessages).toHaveBeenCalledWith(mockConversation.messages);
		});

		it('includes postId in request when provided', async () => {
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: { messages: [] } }
			});

			await messageService.getConversation(2, 123);

			expect(apiClient.get).toHaveBeenCalledWith('/messages/conversations/2', {
				params: { postId: 123 }
			});
		});
	});

	describe('deleteConversation', () => {
		it('deletes conversation and updates store', async () => {
			vi.mocked(apiClient.delete).mockResolvedValue({
				data: { success: true }
			});

			await messageService.deleteConversation(2);

			expect(apiClient.delete).toHaveBeenCalledWith('/messages/conversations/2');
			expect(messageStore.removeConversation).toHaveBeenCalledWith(2);
		});
	});

	// ========================================================================
	// Message CRUD Tests
	// ========================================================================

	describe('sendMessage', () => {
		it('sends message and updates store', async () => {
			const messageData = {
				recipientId: 2,
				messageContent: 'Hello there!',
				messageType: 'text' as const
			};

			const mockResponse = {
				messageId: 1,
				senderId: 1,
				recipientId: 2,
				messageContent: 'Hello there!',
				messageType: 'text',
				isRead: false,
				createdAt: '2025-12-23T10:00:00Z'
			};

			vi.mocked(apiClient.post).mockResolvedValue({
				data: {
					success: true,
					data: mockResponse
				}
			});

			const result = await messageService.sendMessage(messageData);

			expect(apiClient.post).toHaveBeenCalledWith('/messages', messageData);
			expect(messageStore.addMessage).toHaveBeenCalledWith(mockResponse);
			expect(messageStore.updateConversationPreview).toHaveBeenCalledWith(mockResponse);
			expect(result.data).toEqual(mockResponse);
		});
	});

	describe('getMessages', () => {
		it('fetches messages for a user', async () => {
			const mockMessages = [
				{
					messageId: 1,
					senderId: 1,
					recipientId: 2,
					messageContent: 'Hello!',
					messageType: 'text',
					isRead: true,
					createdAt: '2025-12-23T10:00:00Z'
				},
				{
					messageId: 2,
					senderId: 2,
					recipientId: 1,
					messageContent: 'Hi!',
					messageType: 'text',
					isRead: false,
					createdAt: '2025-12-23T10:01:00Z'
				}
			];

			vi.mocked(apiClient.get).mockResolvedValue({
				data: {
					data: mockMessages,
					total: 2,
					page: 1,
					limit: 50
				}
			});

			const result = await messageService.getMessages(2, 50, 0);

			expect(apiClient.get).toHaveBeenCalledWith('/messages/user/2', {
				params: { limit: 50, offset: 0 }
			});
			expect(messageStore.setMessages).toHaveBeenCalledWith(mockMessages);
		});

		it('includes postId in request when provided', async () => {
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { data: [], total: 0, page: 1, limit: 50 }
			});

			await messageService.getMessages(2, 50, 0, 123);

			expect(apiClient.get).toHaveBeenCalledWith('/messages/user/2', {
				params: { limit: 50, offset: 0, postId: 123 }
			});
		});
	});

	describe('editMessage', () => {
		it('edits message and updates store', async () => {
			const updates = { messageContent: 'Updated message' };
			const mockResponse = {
				messageId: 1,
				senderId: 1,
				recipientId: 2,
				messageContent: 'Updated message',
				messageType: 'text',
				isRead: true,
				isEdited: true,
				createdAt: '2025-12-23T10:00:00Z'
			};

			vi.mocked(apiClient.put).mockResolvedValue({
				data: {
					success: true,
					data: mockResponse
				}
			});

			await messageService.editMessage(1, updates);

			expect(apiClient.put).toHaveBeenCalledWith('/messages/1', updates);
			expect(messageStore.updateMessage).toHaveBeenCalledWith(1, mockResponse);
		});
	});

	describe('deleteMessage', () => {
		it('deletes message and updates store', async () => {
			vi.mocked(apiClient.delete).mockResolvedValue({
				data: { success: true }
			});

			await messageService.deleteMessage(1);

			expect(apiClient.delete).toHaveBeenCalledWith('/messages/1');
			expect(messageStore.removeMessage).toHaveBeenCalledWith(1);
		});
	});

	// ========================================================================
	// Read Receipt Tests
	// ========================================================================

	describe('markMessageAsRead', () => {
		it('marks message as read and updates store', async () => {
			vi.mocked(apiClient.post).mockResolvedValue({
				data: { success: true }
			});

			await messageService.markMessageAsRead(1);

			expect(apiClient.post).toHaveBeenCalledWith('/messages/1/read');
			expect(messageStore.markMessageAsRead).toHaveBeenCalledWith(1);
		});
	});

	describe('markConversationAsRead', () => {
		it('marks all messages in conversation as read', async () => {
			vi.mocked(apiClient.post).mockResolvedValue({
				data: { success: true }
			});

			await messageService.markConversationAsRead(2);

			expect(apiClient.post).toHaveBeenCalledWith('/messages/conversations/2/read');
			expect(messageStore.markConversationAsRead).toHaveBeenCalledWith(2);
		});
	});

	describe('getUnreadCount', () => {
		it('fetches unread count and updates store', async () => {
			vi.mocked(apiClient.get).mockResolvedValue({
				data: {
					success: true,
					data: { count: 5 }
				}
			});

			const result = await messageService.getUnreadCount();

			expect(apiClient.get).toHaveBeenCalledWith('/messages/unread/count');
			expect(messageStore.setUnreadCount).toHaveBeenCalledWith(5);
			expect(result.data?.count).toBe(5);
		});
	});

	// ========================================================================
	// Search Tests
	// ========================================================================

	describe('searchMessages', () => {
		it('searches messages with query', async () => {
			const mockResults = [
				{
					messageId: 1,
					senderId: 1,
					recipientId: 2,
					messageContent: 'Hello world!',
					messageType: 'text',
					isRead: true,
					createdAt: '2025-12-23T10:00:00Z'
				}
			];

			vi.mocked(apiClient.get).mockResolvedValue({
				data: {
					data: mockResults,
					total: 1,
					page: 1,
					limit: 20
				}
			});

			const result = await messageService.searchMessages('hello', undefined, 20, 0);

			expect(apiClient.get).toHaveBeenCalledWith('/messages/search', {
				params: { query: 'hello', limit: 20, offset: 0 }
			});
			expect(result.data).toEqual(mockResults);
		});

		it('includes userId filter when provided', async () => {
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { data: [], total: 0, page: 1, limit: 20 }
			});

			await messageService.searchMessages('hello', 2);

			expect(apiClient.get).toHaveBeenCalledWith('/messages/search', {
				params: { query: 'hello', userId: 2, limit: 20, offset: 0 }
			});
		});
	});

	// ========================================================================
	// Attachment Tests
	// ========================================================================

	describe('uploadMessageAttachment', () => {
		it('uploads file as attachment', async () => {
			const mockFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' });

			vi.mocked(apiClient.post).mockResolvedValue({
				data: {
					success: true,
					data: { url: 'https://cdn.example.com/image.jpg' }
				}
			});

			const result = await messageService.uploadMessageAttachment(mockFile);

			expect(apiClient.post).toHaveBeenCalledWith(
				'/messages/attachments',
				expect.any(FormData),
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			);
			expect(result.data?.url).toBe('https://cdn.example.com/image.jpg');
		});
	});

	// ========================================================================
	// WebSocket Tests
	// ========================================================================

	describe('WebSocket', () => {
		it('connects to WebSocket server', () => {
			messageService.connectWebSocket('test-token');

			// Wait for connection
			setTimeout(() => {
				expect(messageStore.setWebSocketConnected).toHaveBeenCalledWith(true);
			}, 10);
		});

		it('disconnects from WebSocket server', () => {
			messageService.connectWebSocket('test-token');
			messageService.disconnectWebSocket();

			expect(messageStore.setWebSocketConnected).toHaveBeenCalledWith(false);
		});

		it('handles incoming message event', (done) => {
			const mockMessage = {
				messageId: 1,
				senderId: 2,
				recipientId: 1,
				messageContent: 'Hello!',
				messageType: 'text',
				isRead: false,
				createdAt: '2025-12-23T10:00:00Z'
			};

			messageService.connectWebSocket('test-token');

			setTimeout(() => {
				const ws = (global as any).WebSocket.instances?.[0];
				if (ws && ws.onmessage) {
					ws.onmessage(
						new MessageEvent('message', {
							data: JSON.stringify({
								type: 'message',
								message: mockMessage
							})
						})
					);

					expect(messageStore.addMessage).toHaveBeenCalledWith(mockMessage);
					expect(messageStore.updateConversationPreview).toHaveBeenCalledWith(mockMessage);
					done();
				}
			}, 10);
		});

		it('handles typing indicator event', (done) => {
			messageService.connectWebSocket('test-token');

			setTimeout(() => {
				const ws = (global as any).WebSocket.instances?.[0];
				if (ws && ws.onmessage) {
					ws.onmessage(
						new MessageEvent('message', {
							data: JSON.stringify({
								type: 'typing',
								conversationId: 1,
								userId: 2
							})
						})
					);

					expect(messageStore.setTypingIndicator).toHaveBeenCalledWith(1, 2, true);
					done();
				}
			}, 10);
		});

		it('handles message_read event', (done) => {
			messageService.connectWebSocket('test-token');

			setTimeout(() => {
				const ws = (global as any).WebSocket.instances?.[0];
				if (ws && ws.onmessage) {
					ws.onmessage(
						new MessageEvent('message', {
							data: JSON.stringify({
								type: 'message_read',
								messageId: 1
							})
						})
					);

					expect(messageStore.markMessageAsRead).toHaveBeenCalledWith(1);
					done();
				}
			}, 10);
		});

		it('handles message_deleted event', (done) => {
			messageService.connectWebSocket('test-token');

			setTimeout(() => {
				const ws = (global as any).WebSocket.instances?.[0];
				if (ws && ws.onmessage) {
					ws.onmessage(
						new MessageEvent('message', {
							data: JSON.stringify({
								type: 'message_deleted',
								messageId: 1
							})
						})
					);

					expect(messageStore.removeMessage).toHaveBeenCalledWith(1);
					done();
				}
			}, 10);
		});
	});

	// ========================================================================
	// Utility Function Tests
	// ========================================================================

	describe('formatMessageTime', () => {
		it('formats recent time as "Just now"', () => {
			const now = new Date();
			expect(messageService.formatMessageTime(now)).toBe('Just now');
		});

		it('formats minutes ago', () => {
			const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
			expect(messageService.formatMessageTime(date)).toBe('5m ago');
		});

		it('formats hours ago', () => {
			const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
			expect(messageService.formatMessageTime(date)).toBe('3h ago');
		});

		it('formats days ago', () => {
			const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
			expect(messageService.formatMessageTime(date)).toBe('2d ago');
		});

		it('formats old dates as full date', () => {
			const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
			expect(messageService.formatMessageTime(date)).toContain('/');
		});
	});

	describe('isMyMessage', () => {
		it('returns true for own messages', () => {
			const message = {
				messageId: 1,
				senderId: 1,
				recipientId: 2,
				messageContent: 'Hello',
				messageType: 'text' as const,
				isRead: false,
				createdAt: '2025-12-23T10:00:00Z'
			};

			expect(messageService.isMyMessage(message, 1)).toBe(true);
		});

		it('returns false for other user messages', () => {
			const message = {
				messageId: 1,
				senderId: 2,
				recipientId: 1,
				messageContent: 'Hello',
				messageType: 'text' as const,
				isRead: false,
				createdAt: '2025-12-23T10:00:00Z'
			};

			expect(messageService.isMyMessage(message, 1)).toBe(false);
		});
	});

	describe('getConversationPartner', () => {
		it('returns recipient ID when message is from current user', () => {
			const message = {
				messageId: 1,
				senderId: 1,
				recipientId: 2,
				messageContent: 'Hello',
				messageType: 'text' as const,
				isRead: false,
				createdAt: '2025-12-23T10:00:00Z'
			};

			expect(messageService.getConversationPartner(message, 1)).toBe(2);
		});

		it('returns sender ID when message is to current user', () => {
			const message = {
				messageId: 1,
				senderId: 2,
				recipientId: 1,
				messageContent: 'Hello',
				messageType: 'text' as const,
				isRead: false,
				createdAt: '2025-12-23T10:00:00Z'
			};

			expect(messageService.getConversationPartner(message, 1)).toBe(2);
		});
	});

	describe('groupMessagesByDate', () => {
		it('groups messages by date', () => {
			const messages = [
				{
					messageId: 1,
					senderId: 1,
					recipientId: 2,
					messageContent: 'Message 1',
					messageType: 'text' as const,
					isRead: false,
					createdAt: '2025-12-23T10:00:00Z'
				},
				{
					messageId: 2,
					senderId: 1,
					recipientId: 2,
					messageContent: 'Message 2',
					messageType: 'text' as const,
					isRead: false,
					createdAt: '2025-12-23T11:00:00Z'
				},
				{
					messageId: 3,
					senderId: 1,
					recipientId: 2,
					messageContent: 'Message 3',
					messageType: 'text' as const,
					isRead: false,
					createdAt: '2025-12-22T10:00:00Z'
				}
			];

			const grouped = messageService.groupMessagesByDate(messages);

			expect(Object.keys(grouped).length).toBeGreaterThan(0);
			expect(grouped['12/23/2025']).toBeDefined();
			expect(grouped['12/22/2025']).toBeDefined();
		});
	});

	describe('clearMessageCache', () => {
		it('clears all cached messages and conversations', () => {
			messageService.clearMessageCache();

			expect(messageStore.clearMessages).toHaveBeenCalled();
			expect(messageStore.clearConversations).toHaveBeenCalled();
		});
	});

	// ========================================================================
	// Typing Indicator Tests
	// ========================================================================

	describe('sendTypingIndicator', () => {
		it('sends typing indicator via WebSocket', () => {
			messageService.connectWebSocket('test-token');

			setTimeout(() => {
				const sendSpy = vi.spyOn(WebSocket.prototype, 'send');
				messageService.sendTypingIndicator(1, 2);

				// Should send WebSocket message (if connected)
				// This is a basic check since we mocked WebSocket
			}, 10);
		});
	});

	describe('stopTypingIndicator', () => {
		it('clears typing indicator in store', () => {
			messageService.stopTypingIndicator(1, 2);

			expect(messageStore.setTypingIndicator).toHaveBeenCalledWith(1, 2, false);
		});
	});
});
