import type { Meta, StoryObj } from '@storybook/svelte';
import IconButton from './IconButton.svelte';

const meta = {
	title: 'Components/Buttons/IconButton',
	component: IconButton,
	tags: ['autodocs'],
	argTypes: {
		icon: {
			control: 'text',
			description: 'Material icon name'
		},
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost'],
			description: 'Visual style variant'
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
			description: 'Button size'
		},
		badge: {
			control: 'number',
			description: 'Badge count (0 for dot, undefined for no badge)'
		},
		ariaLabel: {
			control: 'text',
			description: 'Accessibility label (required for screen readers)'
		}
	}
} satisfies Meta<IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		icon: 'notifications',
		ariaLabel: 'Notifications'
	}
};

export const WithBadgeCount: Story = {
	args: {
		icon: 'notifications',
		badge: 5,
		ariaLabel: 'Notifications with 5 unread'
	}
};

export const WithBadgeDot: Story = {
	args: {
		icon: 'notifications',
		badge: 0,
		ariaLabel: 'Notifications with new items'
	}
};

export const Primary: Story = {
	args: {
		icon: 'add',
		variant: 'primary',
		ariaLabel: 'Add new item'
	}
};

export const Secondary: Story = {
	args: {
		icon: 'settings',
		variant: 'secondary',
		ariaLabel: 'Settings'
	}
};

export const Ghost: Story = {
	args: {
		icon: 'more_vert',
		variant: 'ghost',
		ariaLabel: 'More options'
	}
};

export const Small: Story = {
	args: {
		icon: 'favorite',
		size: 'sm',
		ariaLabel: 'Like'
	}
};

export const Large: Story = {
	args: {
		icon: 'search',
		size: 'lg',
		ariaLabel: 'Search'
	}
};

export const CommonIcons: Story = {
	render: () => ({
		Component: IconButton,
		slot: `
			<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
				<IconButton icon="home" ariaLabel="Home" />
				<IconButton icon="notifications" badge={3} ariaLabel="3 notifications" />
				<IconButton icon="mail" badge={0} ariaLabel="New mail" />
				<IconButton icon="favorite" ariaLabel="Favorite" />
				<IconButton icon="share" ariaLabel="Share" />
				<IconButton icon="settings" ariaLabel="Settings" />
				<IconButton icon="search" ariaLabel="Search" />
				<IconButton icon="close" ariaLabel="Close" />
			</div>
		`
	})
};
