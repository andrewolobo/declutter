import type { Meta, StoryObj } from '@storybook/svelte';
import Avatar from './Avatar.svelte';

const meta = {
	title: 'Components/Media/Avatar',
	component: Avatar,
	tags: ['autodocs'],
	argTypes: {
		src: {
			control: 'text',
			description: 'Image URL'
		},
		alt: {
			control: 'text',
			description: 'Alt text (used for initials fallback)'
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'md', 'lg', 'xl'],
			description: 'Avatar size'
		},
		status: {
			control: 'select',
			options: [undefined, 'online', 'offline', 'away'],
			description: 'Online status indicator'
		},
		badge: {
			control: 'text',
			description: 'Badge icon name'
		},
		editable: {
			control: 'boolean',
			description: 'Show edit overlay on hover'
		}
	}
} satisfies Meta<Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		src: 'https://i.pravatar.cc/150?img=1',
		alt: 'John Doe'
	}
};

export const WithInitials: Story = {
	args: {
		alt: 'Jane Smith'
	}
};

export const Online: Story = {
	args: {
		src: 'https://i.pravatar.cc/150?img=2',
		alt: 'Mike Johnson',
		status: 'online'
	}
};

export const Offline: Story = {
	args: {
		src: 'https://i.pravatar.cc/150?img=3',
		alt: 'Sarah Lee',
		status: 'offline'
	}
};

export const Away: Story = {
	args: {
		src: 'https://i.pravatar.cc/150?img=4',
		alt: 'Tom Wilson',
		status: 'away'
	}
};

export const Verified: Story = {
	args: {
		src: 'https://i.pravatar.cc/150?img=5',
		alt: 'Emma Brown',
		badge: 'verified_user'
	}
};

export const Admin: Story = {
	args: {
		src: 'https://i.pravatar.cc/150?img=6',
		alt: 'Admin User',
		badge: 'admin_panel_settings'
	}
};

export const Editable: Story = {
	args: {
		src: 'https://i.pravatar.cc/150?img=7',
		alt: 'Profile Picture',
		editable: true
	}
};

export const AllSizes: Story = {
	render: () => ({
		Component: Avatar,
		slot: `
			<div style="display: flex; align-items: center; gap: 1rem;">
				<Avatar src="https://i.pravatar.cc/150?img=8" alt="Extra Small" size="xs" />
				<Avatar src="https://i.pravatar.cc/150?img=9" alt="Small" size="sm" />
				<Avatar src="https://i.pravatar.cc/150?img=10" alt="Medium" size="md" />
				<Avatar src="https://i.pravatar.cc/150?img=11" alt="Large" size="lg" />
				<Avatar src="https://i.pravatar.cc/150?img=12" alt="Extra Large" size="xl" />
			</div>
		`
	})
};

export const StatusIndicators: Story = {
	render: () => ({
		Component: Avatar,
		slot: `
			<div style="display: flex; gap: 2rem;">
				<div style="text-align: center;">
					<Avatar src="https://i.pravatar.cc/150?img=13" alt="Online User" status="online" size="lg" />
					<p style="margin-top: 0.5rem; font-size: 0.875rem;">Online</p>
				</div>
				<div style="text-align: center;">
					<Avatar src="https://i.pravatar.cc/150?img=14" alt="Away User" status="away" size="lg" />
					<p style="margin-top: 0.5rem; font-size: 0.875rem;">Away</p>
				</div>
				<div style="text-align: center;">
					<Avatar src="https://i.pravatar.cc/150?img=15" alt="Offline User" status="offline" size="lg" />
					<p style="margin-top: 0.5rem; font-size: 0.875rem;">Offline</p>
				</div>
			</div>
		`
	})
};
