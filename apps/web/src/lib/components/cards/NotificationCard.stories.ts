import type { Meta, StoryObj } from '@storybook/svelte';
import NotificationCard from './NotificationCard.svelte';

const meta = {
	title: 'Components/Cards/NotificationCard',
	component: NotificationCard,
	tags: ['autodocs'],
	argTypes: {
		notification: { control: 'object' }
	}
} satisfies Meta<NotificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleNotification = {
	id: 'notif1',
	type: 'like',
	read: false,
	createdAt: new Date('2024-01-15T14:30:00'),
	actor: {
		id: 'user123',
		username: 'johndoe',
		displayName: 'John Doe',
		avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
	},
	post: {
		id: 'post1',
		content: 'Just launched my new startup!'
	}
};

export const Like: Story = {
	args: {
		notification: sampleNotification
	}
};

export const Comment: Story = {
	args: {
		notification: {
			...sampleNotification,
			type: 'comment',
			comment: {
				id: 'comment1',
				content: 'This looks amazing! Congratulations on the launch!'
			}
		}
	}
};

export const Follow: Story = {
	args: {
		notification: {
			...sampleNotification,
			type: 'follow',
			post: undefined
		}
	}
};

export const Mention: Story = {
	args: {
		notification: {
			...sampleNotification,
			type: 'mention',
			post: {
				id: 'post2',
				content: '@currentuser check out this amazing find!'
			}
		}
	}
};

export const Read: Story = {
	args: {
		notification: {
			...sampleNotification,
			read: true
		}
	}
};

export const NoAvatar: Story = {
	args: {
		notification: {
			...sampleNotification,
			actor: {
				...sampleNotification.actor,
				avatarUrl: null
			}
		}
	}
};

export const RecentNotification: Story = {
	args: {
		notification: {
			...sampleNotification,
			createdAt: new Date(),
			type: 'like'
		}
	}
};

export const OldNotification: Story = {
	args: {
		notification: {
			...sampleNotification,
			createdAt: new Date('2024-01-01T10:00:00'),
			read: true
		}
	}
};

export const LongComment: Story = {
	args: {
		notification: {
			...sampleNotification,
			type: 'comment',
			comment: {
				id: 'comment1',
				content:
					"This is an absolutely fantastic achievement! I've been following your journey for months and I'm so excited to see you finally launch. The attention to detail is incredible and I can tell how much work went into this. Congratulations!"
			}
		}
	}
};

export const NotificationsList: Story = {
	render: () => ({
		Component: NotificationCard,
		slot: `
			<div style="max-width: 500px; display: flex; flex-direction: column;">
				<NotificationCard notification={${JSON.stringify({
					id: '1',
					type: 'like',
					read: false,
					createdAt: new Date(),
					actor: {
						id: 'u1',
						username: 'alice',
						displayName: 'Alice Smith',
						avatarUrl: 'https://i.pravatar.cc/150?u=alice'
					},
					post: { id: 'p1', content: 'My latest project' }
				})}} />
				<NotificationCard notification={${JSON.stringify({
					id: '2',
					type: 'comment',
					read: false,
					createdAt: new Date(Date.now() - 3600000),
					actor: {
						id: 'u2',
						username: 'bob',
						displayName: 'Bob Johnson',
						avatarUrl: 'https://i.pravatar.cc/150?u=bob'
					},
					post: { id: 'p2', content: 'Check this out!' },
					comment: { id: 'c1', content: 'Great work!' }
				})}} />
				<NotificationCard notification={${JSON.stringify({
					id: '3',
					type: 'follow',
					read: true,
					createdAt: new Date(Date.now() - 86400000),
					actor: {
						id: 'u3',
						username: 'carol',
						displayName: 'Carol White',
						avatarUrl: 'https://i.pravatar.cc/150?u=carol'
					}
				})}} />
			</div>
		`
	})
};

export const AllTypes: Story = {
	render: () => ({
		Component: NotificationCard,
		slot: `
			<div style="max-width: 500px; display: flex; flex-direction: column; gap: 0.5rem;">
				<div style="font-weight: 600; padding: 0.5rem;">Like Notification</div>
				<NotificationCard notification={${JSON.stringify({
					id: '1',
					type: 'like',
					read: false,
					createdAt: new Date(),
					actor: {
						id: 'u1',
						username: 'alice',
						displayName: 'Alice',
						avatarUrl: 'https://i.pravatar.cc/150?u=alice'
					},
					post: { id: 'p1', content: 'My post' }
				})}} />
				
				<div style="font-weight: 600; padding: 0.5rem; margin-top: 1rem;">Comment Notification</div>
				<NotificationCard notification={${JSON.stringify({
					id: '2',
					type: 'comment',
					read: false,
					createdAt: new Date(),
					actor: {
						id: 'u2',
						username: 'bob',
						displayName: 'Bob',
						avatarUrl: 'https://i.pravatar.cc/150?u=bob'
					},
					post: { id: 'p2', content: 'Another post' },
					comment: { id: 'c1', content: 'Nice!' }
				})}} />
				
				<div style="font-weight: 600; padding: 0.5rem; margin-top: 1rem;">Follow Notification</div>
				<NotificationCard notification={${JSON.stringify({
					id: '3',
					type: 'follow',
					read: false,
					createdAt: new Date(),
					actor: {
						id: 'u3',
						username: 'carol',
						displayName: 'Carol',
						avatarUrl: 'https://i.pravatar.cc/150?u=carol'
					}
				})}} />
				
				<div style="font-weight: 600; padding: 0.5rem; margin-top: 1rem;">Mention Notification</div>
				<NotificationCard notification={${JSON.stringify({
					id: '4',
					type: 'mention',
					read: false,
					createdAt: new Date(),
					actor: {
						id: 'u4',
						username: 'david',
						displayName: 'David',
						avatarUrl: 'https://i.pravatar.cc/150?u=david'
					},
					post: { id: 'p4', content: '@you mentioned in this post' }
				})}} />
			</div>
		`
	})
};
