import type { Meta, StoryObj } from '@storybook/svelte';
import Header from './Header.svelte';

const meta = {
	title: 'Components/Layout/Header',
	component: Header,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LoggedOut: Story = {
	args: {
		user: null
	}
};

export const LoggedIn: Story = {
	args: {
		user: {
			id: 'user123',
			username: 'johndoe',
			displayName: 'John Doe',
			avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
		}
	}
};

export const WithNotifications: Story = {
	args: {
		user: {
			id: 'user123',
			username: 'johndoe',
			displayName: 'John Doe',
			avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
		},
		unreadCount: 3
	}
};

export const WithMessages: Story = {
	args: {
		user: {
			id: 'user123',
			username: 'johndoe',
			displayName: 'John Doe',
			avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
		},
		unreadMessages: 5
	}
};

export const Mobile: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1'
		}
	},
	args: {
		user: {
			id: 'user123',
			username: 'johndoe',
			displayName: 'John Doe',
			avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
		}
	}
};

export const Tablet: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'tablet'
		}
	},
	args: {
		user: {
			id: 'user123',
			username: 'johndoe',
			displayName: 'John Doe',
			avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
		}
	}
};

export const WithSearch: Story = {
	args: {
		user: {
			id: 'user123',
			username: 'johndoe',
			displayName: 'John Doe',
			avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
		},
		showSearch: true
	}
};

export const AllFeatures: Story = {
	args: {
		user: {
			id: 'user123',
			username: 'johndoe',
			displayName: 'John Doe',
			avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
		},
		unreadCount: 7,
		unreadMessages: 3,
		showSearch: true
	}
};
