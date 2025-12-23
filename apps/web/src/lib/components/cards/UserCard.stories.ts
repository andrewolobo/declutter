import type { Meta, StoryObj } from '@storybook/svelte';
import UserCard from './UserCard.svelte';

const meta = {
	title: 'Components/Cards/UserCard',
	component: UserCard,
	tags: ['autodocs'],
	argTypes: {
		user: { control: 'object' },
		isFollowing: { control: 'boolean' },
		showFollowButton: { control: 'boolean' }
	}
} satisfies Meta<UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleUser = {
	id: 'user123',
	username: 'johndoe',
	displayName: 'John Doe',
	avatarUrl: 'https://i.pravatar.cc/150?u=johndoe',
	bio: 'Full-stack developer passionate about sustainable fashion and technology. Building the future of e-commerce.',
	_count: {
		followers: 1247,
		following: 342,
		posts: 89
	}
};

export const Default: Story = {
	args: {
		user: sampleUser,
		isFollowing: false,
		showFollowButton: true
	}
};

export const Following: Story = {
	args: {
		user: sampleUser,
		isFollowing: true,
		showFollowButton: true
	}
};

export const WithoutFollowButton: Story = {
	args: {
		user: sampleUser,
		isFollowing: false,
		showFollowButton: false
	}
};

export const NoAvatar: Story = {
	args: {
		user: {
			...sampleUser,
			avatarUrl: null
		},
		showFollowButton: true
	}
};

export const ShortBio: Story = {
	args: {
		user: {
			...sampleUser,
			bio: 'Designer & maker'
		},
		showFollowButton: true
	}
};

export const NoBio: Story = {
	args: {
		user: {
			...sampleUser,
			bio: null
		},
		showFollowButton: true
	}
};

export const HighFollowerCount: Story = {
	args: {
		user: {
			...sampleUser,
			displayName: 'Fashion Influencer',
			username: 'fashionista',
			bio: 'Sustainable fashion advocate | Style inspiration | DM for collabs',
			_count: {
				followers: 125000,
				following: 543,
				posts: 2341
			}
		},
		isFollowing: true,
		showFollowButton: true
	}
};

export const NewUser: Story = {
	args: {
		user: {
			...sampleUser,
			displayName: 'New User',
			username: 'newbie2024',
			bio: 'Just joined! Excited to be here 👋',
			_count: {
				followers: 3,
				following: 12,
				posts: 1
			}
		},
		showFollowButton: true
	}
};

export const SuggestedUsers: Story = {
	render: () => ({
		Component: UserCard,
		slot: `
			<div style="max-width: 320px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Suggested Users</h3>
				<div style="display: flex; flex-direction: column; gap: 0.75rem;">
					<UserCard user={${JSON.stringify({ ...sampleUser, id: '1', username: 'fashionista', displayName: 'Fashion Pro' })}} showFollowButton={true} />
					<UserCard user={${JSON.stringify({ ...sampleUser, id: '2', username: 'ecowarrior', displayName: 'Eco Warrior', avatarUrl: 'https://i.pravatar.cc/150?u=eco' })}} showFollowButton={true} />
					<UserCard user={${JSON.stringify({ ...sampleUser, id: '3', username: 'styleblogger', displayName: 'Style Blogger', avatarUrl: 'https://i.pravatar.cc/150?u=style' })}} showFollowButton={true} />
				</div>
			</div>
		`
	})
};

export const CompactList: Story = {
	render: () => ({
		Component: UserCard,
		slot: `
			<div style="max-width: 280px; display: flex; flex-direction: column; gap: 0.5rem;">
				<UserCard user={${JSON.stringify({ ...sampleUser, id: '1', username: 'user1' })}} showFollowButton={false} />
				<UserCard user={${JSON.stringify({ ...sampleUser, id: '2', username: 'user2' })}} showFollowButton={false} />
				<UserCard user={${JSON.stringify({ ...sampleUser, id: '3', username: 'user3' })}} showFollowButton={false} />
				<UserCard user={${JSON.stringify({ ...sampleUser, id: '4', username: 'user4' })}} showFollowButton={false} />
			</div>
		`
	})
};
