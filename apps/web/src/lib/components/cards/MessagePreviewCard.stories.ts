import type { Meta, StoryObj } from '@storybook/svelte';
import MessagePreviewCard from './MessagePreviewCard.svelte';

const meta = {
	title: 'Components/Cards/MessagePreviewCard',
	component: MessagePreviewCard,
	tags: ['autodocs'],
	argTypes: {
		conversation: { control: 'object' }
	}
} satisfies Meta<MessagePreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleConversation = {
	id: 'conv1',
	otherUser: {
		id: 'user123',
		username: 'johndoe',
		displayName: 'John Doe',
		avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
	},
	lastMessage: {
		id: 'msg1',
		content: 'Hey! Is the jacket still available?',
		senderId: 'user123',
		createdAt: new Date('2024-01-15T14:30:00')
	},
	unreadCount: 0
};

export const Default: Story = {
	args: {
		conversation: sampleConversation
	}
};

export const WithUnread: Story = {
	args: {
		conversation: {
			...sampleConversation,
			unreadCount: 3,
			lastMessage: {
				...sampleConversation.lastMessage,
				content: "I'm interested in buying it. Can we meet tomorrow?"
			}
		}
	}
};

export const LongMessage: Story = {
	args: {
		conversation: {
			...sampleConversation,
			lastMessage: {
				...sampleConversation.lastMessage,
				content:
					"I saw your listing for the vintage leather jacket and I'm very interested. Would you be willing to negotiate on the price? Also, could you send me more photos showing any wear or damage?"
			}
		}
	}
};

export const RecentMessage: Story = {
	args: {
		conversation: {
			...sampleConversation,
			lastMessage: {
				...sampleConversation.lastMessage,
				createdAt: new Date(),
				content: 'Just sent you a message!'
			},
			unreadCount: 1
		}
	}
};

export const NoAvatar: Story = {
	args: {
		conversation: {
			...sampleConversation,
			otherUser: {
				...sampleConversation.otherUser,
				avatarUrl: null
			}
		}
	}
};

export const HighUnreadCount: Story = {
	args: {
		conversation: {
			...sampleConversation,
			unreadCount: 99,
			lastMessage: {
				...sampleConversation.lastMessage,
				content: 'This conversation has many unread messages!'
			}
		}
	}
};

export const OldMessage: Story = {
	args: {
		conversation: {
			...sampleConversation,
			lastMessage: {
				...sampleConversation.lastMessage,
				content: 'Last message from a week ago',
				createdAt: new Date('2024-01-08T10:00:00')
			}
		}
	}
};

export const MessageList: Story = {
	render: () => ({
		Component: MessagePreviewCard,
		slot: `
			<div style="max-width: 400px; display: flex; flex-direction: column;">
				<MessagePreviewCard conversation={${JSON.stringify({
					id: '1',
					otherUser: {
						id: 'u1',
						username: 'alice',
						displayName: 'Alice Smith',
						avatarUrl: 'https://i.pravatar.cc/150?u=alice'
					},
					lastMessage: {
						id: 'm1',
						content: 'Thanks for the quick response!',
						senderId: 'u1',
						createdAt: new Date()
					},
					unreadCount: 2
				})}} />
				<MessagePreviewCard conversation={${JSON.stringify({
					id: '2',
					otherUser: {
						id: 'u2',
						username: 'bob',
						displayName: 'Bob Johnson',
						avatarUrl: 'https://i.pravatar.cc/150?u=bob'
					},
					lastMessage: {
						id: 'm2',
						content: 'Is the price negotiable?',
						senderId: 'u2',
						createdAt: new Date(Date.now() - 3600000)
					},
					unreadCount: 0
				})}} />
				<MessagePreviewCard conversation={${JSON.stringify({
					id: '3',
					otherUser: {
						id: 'u3',
						username: 'carol',
						displayName: 'Carol White',
						avatarUrl: 'https://i.pravatar.cc/150?u=carol'
					},
					lastMessage: {
						id: 'm3',
						content: 'When can we meet?',
						senderId: 'u3',
						createdAt: new Date(Date.now() - 86400000)
					},
					unreadCount: 5
				})}} />
			</div>
		`
	})
};
