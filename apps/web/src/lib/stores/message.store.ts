import { writable, derived, get, type Readable } from 'svelte/store';
import type {
	MessageResponseDTO,
	ConversationPreviewDTO,
	ConversationResponseDTO
} from '$types/message.types';

/**
 * Message Store State
 */
interface MessageStoreState {
	messages: Map<number, MessageResponseDTO>; // All messages by ID
	conversations: Map<number, ConversationPreviewDTO>; // Conversations by user ID
	typingIndicators: Map<number, Set<number>>; // conversationId -> Set of user IDs typing
	unreadCount: number;
	loading: boolean;
	error: string | null;
	wsConnected: boolean;
	wsError: string | null;
}

/**
 * Initial state
 */
const initialState: MessageStoreState = {
	messages: new Map(),
	conversations: new Map(),
	typingIndicators: new Map(),
	unreadCount: 0,
	loading: false,
	error: null,
	wsConnected: false,
	wsError: null
};

/**
 * Create message store
 */
function createMessageStore() {
	const { subscribe, set, update } = writable<MessageStoreState>(initialState);

	return {
		subscribe,

		// ====================================================================
		// Message Management
		// ====================================================================

		/**
		 * Set messages in store
		 */
		setMessages: (messages: MessageResponseDTO[]) => {
			update((state) => {
				messages.forEach((message) => {
					state.messages.set(message.messageId, message);
				});
				return state;
			});
		},

		/**
		 * Add a single message
		 */
		addMessage: (message: MessageResponseDTO) => {
			update((state) => {
				state.messages.set(message.messageId, message);
				return state;
			});
		},

		/**
		 * Update a message
		 */
		updateMessage: (messageId: number, updates: Partial<MessageResponseDTO>) => {
			update((state) => {
				const message = state.messages.get(messageId);
				if (message) {
					state.messages.set(messageId, { ...message, ...updates });
				}
				return state;
			});
		},

		/**
		 * Remove a message
		 */
		removeMessage: (messageId: number) => {
			update((state) => {
				state.messages.delete(messageId);
				return state;
			});
		},

		/**
		 * Mark message as read
		 */
		markMessageAsRead: (messageId: number) => {
			update((state) => {
				const message = state.messages.get(messageId);
				if (message) {
					state.messages.set(messageId, {
						...message,
						isRead: true,
						readAt: new Date().toISOString()
					});
				}
				return state;
			});
		},

		/**
		 * Mark all messages in conversation as read
		 */
		markConversationAsRead: (userId: number) => {
			update((state) => {
				state.messages.forEach((message, id) => {
					if (message.senderId === userId || message.recipientId === userId) {
						state.messages.set(id, {
							...message,
							isRead: true,
							readAt: new Date().toISOString()
						});
					}
				});

				// Update conversation preview
				const conversation = state.conversations.get(userId);
				if (conversation) {
					state.conversations.set(userId, {
						...conversation,
						unreadCount: 0
					});
				}

				return state;
			});
		},

		/**
		 * Clear all messages
		 */
		clearMessages: () => {
			update((state) => {
				state.messages.clear();
				return state;
			});
		},

		// ====================================================================
		// Conversation Management
		// ====================================================================

		/**
		 * Set conversations in store
		 */
		setConversations: (conversations: ConversationPreviewDTO[]) => {
			update((state) => {
				conversations.forEach((conversation) => {
					state.conversations.set(conversation.userId, conversation);
				});
				return state;
			});
		},

		/**
		 * Add or update a conversation
		 */
		updateConversationPreview: (message: MessageResponseDTO) => {
			update((state) => {
				// Determine the other user ID
				const currentUserId = message.senderId; // This will need to be dynamic
				const otherUserId =
					message.senderId === currentUserId ? message.recipientId : message.senderId;

				const existing = state.conversations.get(otherUserId);

				// Create or update conversation preview
				const preview: ConversationPreviewDTO = {
					userId: otherUserId,
					username: existing?.username || '',
					profilePicture: existing?.profilePicture || null,
					lastMessage: message.messageContent,
					lastMessageAt: message.createdAt,
					unreadCount: existing ? existing.unreadCount + 1 : 1,
					isOnline: existing?.isOnline || false
				};

				state.conversations.set(otherUserId, preview);
				return state;
			});
		},

		/**
		 * Remove a conversation
		 */
		removeConversation: (userId: number) => {
			update((state) => {
				state.conversations.delete(userId);
				// Also remove all messages from this conversation
				state.messages.forEach((message, id) => {
					if (message.senderId === userId || message.recipientId === userId) {
						state.messages.delete(id);
					}
				});
				return state;
			});
		},

		/**
		 * Clear all conversations
		 */
		clearConversations: () => {
			update((state) => {
				state.conversations.clear();
				return state;
			});
		},

		// ====================================================================
		// Typing Indicators
		// ====================================================================

		/**
		 * Set typing indicator for a user in a conversation
		 */
		setTypingIndicator: (conversationId: number, userId: number, isTyping: boolean) => {
			update((state) => {
				if (!state.typingIndicators.has(conversationId)) {
					state.typingIndicators.set(conversationId, new Set());
				}

				const typingUsers = state.typingIndicators.get(conversationId)!;

				if (isTyping) {
					typingUsers.add(userId);
				} else {
					typingUsers.delete(userId);
				}

				return state;
			});
		},

		/**
		 * Clear typing indicators for a conversation
		 */
		clearTypingIndicators: (conversationId: number) => {
			update((state) => {
				state.typingIndicators.delete(conversationId);
				return state;
			});
		},

		// ====================================================================
		// Unread Count
		// ====================================================================

		/**
		 * Set unread message count
		 */
		setUnreadCount: (count: number) => {
			update((state) => {
				state.unreadCount = count;
				return state;
			});
		},

		/**
		 * Increment unread count
		 */
		incrementUnreadCount: () => {
			update((state) => {
				state.unreadCount++;
				return state;
			});
		},

		/**
		 * Decrement unread count
		 */
		decrementUnreadCount: (amount = 1) => {
			update((state) => {
				state.unreadCount = Math.max(0, state.unreadCount - amount);
				return state;
			});
		},

		// ====================================================================
		// WebSocket State
		// ====================================================================

		/**
		 * Set WebSocket connection status
		 */
		setWebSocketConnected: (connected: boolean) => {
			update((state) => {
				state.wsConnected = connected;
				if (connected) {
					state.wsError = null;
				}
				return state;
			});
		},

		/**
		 * Set WebSocket error
		 */
		setWebSocketError: (error: string | null) => {
			update((state) => {
				state.wsError = error;
				return state;
			});
		},

		// ====================================================================
		// Loading & Error State
		// ====================================================================

		/**
		 * Set loading state
		 */
		setLoading: (loading: boolean) => {
			update((state) => {
				state.loading = loading;
				if (loading) {
					state.error = null;
				}
				return state;
			});
		},

		/**
		 * Set error state
		 */
		setError: (error: string | null) => {
			update((state) => {
				state.error = error;
				state.loading = false;
				return state;
			});
		},

		// ====================================================================
		// Reset
		// ====================================================================

		/**
		 * Reset store to initial state
		 */
		reset: () => {
			set(initialState);
		}
	};
}

// Create store instance
export const messageStore = createMessageStore();

// ============================================================================
// Derived Stores
// ============================================================================

/**
 * All messages as an array
 */
export const messages = derived(messageStore, ($store) => Array.from($store.messages.values()));

/**
 * All conversations as an array
 */
export const conversations = derived(messageStore, ($store) =>
	Array.from($store.conversations.values())
);

/**
 * Conversations sorted by last message time (most recent first)
 */
export const conversationsByRecent = derived(conversations, ($conversations) => {
	return [...$conversations].sort((a, b) => {
		const dateA = new Date(a.lastMessageAt).getTime();
		const dateB = new Date(b.lastMessageAt).getTime();
		return dateB - dateA;
	});
});

/**
 * Conversations with unread messages
 */
export const unreadConversations = derived(conversations, ($conversations) => {
	return $conversations.filter((conv) => conv.unreadCount > 0);
});

/**
 * Online conversations (users currently online)
 */
export const onlineConversations = derived(conversations, ($conversations) => {
	return $conversations.filter((conv) => conv.isOnline);
});

/**
 * Messages sorted by creation time (oldest first)
 */
export const messagesByTime = derived(messages, ($messages) => {
	return [...$messages].sort((a, b) => {
		const dateA = new Date(a.createdAt).getTime();
		const dateB = new Date(b.createdAt).getTime();
		return dateA - dateB;
	});
});

/**
 * Unread messages
 */
export const unreadMessages = derived(messages, ($messages) => {
	return $messages.filter((msg) => !msg.isRead);
});

/**
 * Total unread message count
 */
export const unreadCount = derived(messageStore, ($store) => $store.unreadCount);

/**
 * Has unread messages
 */
export const hasUnreadMessages = derived(unreadCount, ($count) => $count > 0);

/**
 * Loading state
 */
export const messagesLoading = derived(messageStore, ($store) => $store.loading);

/**
 * Error state
 */
export const messagesError = derived(messageStore, ($store) => $store.error);

/**
 * WebSocket connection status
 */
export const webSocketConnected = derived(messageStore, ($store) => $store.wsConnected);

/**
 * WebSocket error
 */
export const webSocketError = derived(messageStore, ($store) => $store.wsError);

/**
 * Conversation count
 */
export const conversationCount = derived(conversations, ($conversations) => $conversations.length);

/**
 * Message count
 */
export const messageCount = derived(messages, ($messages) => $messages.length);

/**
 * Messages statistics
 */
export const messageStats = derived(messageStore, ($store) => {
	const allMessages = Array.from($store.messages.values());
	const unreadMsgs = allMessages.filter((msg) => !msg.isRead);
	const readMsgs = allMessages.filter((msg) => msg.isRead);

	return {
		totalMessages: allMessages.length,
		unreadMessages: unreadMsgs.length,
		readMessages: readMsgs.length,
		totalConversations: $store.conversations.size,
		unreadConversations: Array.from($store.conversations.values()).filter(
			(conv) => conv.unreadCount > 0
		).length
	};
});

// ============================================================================
// Query Functions (as derived stores)
// ============================================================================

/**
 * Get message by ID
 */
export const getMessage = derived(
	messageStore,
	($store) =>
		(messageId: number): MessageResponseDTO | null => {
			return $store.messages.get(messageId) || null;
		}
);

/**
 * Check if message exists
 */
export const hasMessage = derived(messageStore, ($store) => (messageId: number): boolean => {
	return $store.messages.has(messageId);
});

/**
 * Get messages for a specific conversation (by user ID)
 */
export const getMessagesByUser = derived(
	messageStore,
	($store) =>
		(userId: number): MessageResponseDTO[] => {
			return Array.from($store.messages.values())
				.filter((msg) => msg.senderId === userId || msg.recipientId === userId)
				.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
		}
);

/**
 * Get messages for a specific post
 */
export const getMessagesByPost = derived(
	messageStore,
	($store) =>
		(postId: number): MessageResponseDTO[] => {
			return Array.from($store.messages.values())
				.filter((msg) => msg.postId === postId)
				.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
		}
);

/**
 * Get conversation by user ID
 */
export const getConversation = derived(
	messageStore,
	($store) =>
		(userId: number): ConversationPreviewDTO | null => {
			return $store.conversations.get(userId) || null;
		}
);

/**
 * Check if conversation exists
 */
export const hasConversation = derived(messageStore, ($store) => (userId: number): boolean => {
	return $store.conversations.has(userId);
});

/**
 * Get unread count for a specific conversation
 */
export const getConversationUnreadCount = derived(
	messageStore,
	($store) =>
		(userId: number): number => {
			const conversation = $store.conversations.get(userId);
			return conversation?.unreadCount || 0;
		}
);

/**
 * Check if user is typing in a conversation
 */
export const isUserTyping = derived(
	messageStore,
	($store) =>
		(conversationId: number, userId: number): boolean => {
			const typingUsers = $store.typingIndicators.get(conversationId);
			return typingUsers ? typingUsers.has(userId) : false;
		}
);

/**
 * Get all users typing in a conversation
 */
export const getTypingUsers = derived(
	messageStore,
	($store) =>
		(conversationId: number): number[] => {
			const typingUsers = $store.typingIndicators.get(conversationId);
			return typingUsers ? Array.from(typingUsers) : [];
		}
);

/**
 * Search messages locally
 */
export const searchMessagesLocal = derived(
	messages,
	($messages) =>
		(query: string): MessageResponseDTO[] => {
			const lowerQuery = query.toLowerCase();
			return $messages.filter(
				(msg) =>
					msg.messageContent.toLowerCase().includes(lowerQuery) ||
					msg.messageType.toLowerCase().includes(lowerQuery)
			);
		}
);

/**
 * Get messages sent by current user
 */
export const getSentMessages = derived(
	messageStore,
	($store) =>
		(currentUserId: number): MessageResponseDTO[] => {
			return Array.from($store.messages.values())
				.filter((msg) => msg.senderId === currentUserId)
				.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		}
);

/**
 * Get messages received by current user
 */
export const getReceivedMessages = derived(
	messageStore,
	($store) =>
		(currentUserId: number): MessageResponseDTO[] => {
			return Array.from($store.messages.values())
				.filter((msg) => msg.recipientId === currentUserId)
				.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		}
);

/**
 * Get last message in a conversation
 */
export const getLastMessage = derived(
	messageStore,
	($store) =>
		(userId: number): MessageResponseDTO | null => {
			const conversationMessages = Array.from($store.messages.values())
				.filter((msg) => msg.senderId === userId || msg.recipientId === userId)
				.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

			return conversationMessages[0] || null;
		}
);
