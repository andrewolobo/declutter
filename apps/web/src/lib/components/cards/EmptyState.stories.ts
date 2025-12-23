import type { Meta, StoryObj } from '@storybook/svelte';
import EmptyState from './EmptyState.svelte';

const meta = {
	title: 'Components/Cards/EmptyState',
	component: EmptyState,
	tags: ['autodocs'],
	argTypes: {
		icon: { control: 'text' },
		title: { control: 'text' },
		description: { control: 'text' },
		actionText: { control: 'text' }
	}
} satisfies Meta<EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		icon: 'inbox',
		title: 'No items found',
		description: 'There are no items to display at the moment.'
	}
};

export const NoPosts: Story = {
	args: {
		icon: 'file-text',
		title: 'No posts yet',
		description: 'Start sharing your thoughts and connect with the community.',
		actionText: 'Create Post'
	}
};

export const NoMessages: Story = {
	args: {
		icon: 'message-circle',
		title: 'No messages',
		description: 'Your inbox is empty. Start a conversation to connect with others.',
		actionText: 'Browse Users'
	}
};

export const NoNotifications: Story = {
	args: {
		icon: 'bell',
		title: 'No notifications',
		description: "You're all caught up! Check back later for updates."
	}
};

export const NoSearchResults: Story = {
	args: {
		icon: 'search',
		title: 'No results found',
		description: "Try adjusting your search or filters to find what you're looking for.",
		actionText: 'Clear Filters'
	}
};

export const NoFollowers: Story = {
	args: {
		icon: 'users',
		title: 'No followers yet',
		description: 'Share great content and engage with others to build your community.',
		actionText: 'Find Users'
	}
};

export const NoSavedItems: Story = {
	args: {
		icon: 'bookmark',
		title: 'No saved items',
		description: 'Items you save will appear here for easy access later.',
		actionText: 'Explore Posts'
	}
};

export const ConnectionError: Story = {
	args: {
		icon: 'wifi-off',
		title: 'Connection lost',
		description: 'Unable to load content. Please check your internet connection.',
		actionText: 'Retry'
	}
};

export const NoProducts: Story = {
	args: {
		icon: 'package',
		title: 'No products listed',
		description: 'Start selling your items to reach thousands of potential buyers.',
		actionText: 'List Product'
	}
};

export const WithoutAction: Story = {
	args: {
		icon: 'check-circle',
		title: 'All done!',
		description: "You've completed all your tasks."
	}
};

export const MinimalText: Story = {
	args: {
		icon: 'inbox',
		title: 'Empty'
	}
};

export const CommonStates: Story = {
	render: () => ({
		Component: EmptyState,
		slot: `
			<div style="display: flex; flex-direction: column; gap: 3rem; max-width: 500px;">
				<EmptyState 
					icon="file-text" 
					title="No posts yet" 
					description="Start sharing your thoughts and connect with the community." 
					actionText="Create Post" 
				/>
				<EmptyState 
					icon="message-circle" 
					title="No messages" 
					description="Your inbox is empty. Start a conversation to connect with others." 
					actionText="Browse Users" 
				/>
				<EmptyState 
					icon="search" 
					title="No results found" 
					description="Try adjusting your search or filters to find what you're looking for." 
					actionText="Clear Filters" 
				/>
			</div>
		`
	})
};

export const AllIcons: Story = {
	render: () => ({
		Component: EmptyState,
		slot: `
			<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 2rem; max-width: 1200px;">
				<EmptyState icon="inbox" title="Inbox" />
				<EmptyState icon="file-text" title="Posts" />
				<EmptyState icon="message-circle" title="Messages" />
				<EmptyState icon="bell" title="Notifications" />
				<EmptyState icon="search" title="Search" />
				<EmptyState icon="users" title="Users" />
				<EmptyState icon="bookmark" title="Saved" />
				<EmptyState icon="package" title="Products" />
				<EmptyState icon="wifi-off" title="Offline" />
				<EmptyState icon="check-circle" title="Complete" />
			</div>
		`
	})
};
