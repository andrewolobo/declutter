import type { Meta, StoryObj } from '@storybook/svelte';
import ConfirmDialog from './ConfirmDialog.svelte';

const meta = {
	title: 'Components/Overlay/ConfirmDialog',
	component: ConfirmDialog,
	tags: ['autodocs'],
	argTypes: {
		open: {
			control: 'boolean',
			description: 'Dialog open state'
		},
		title: {
			control: 'text',
			description: 'Dialog title'
		},
		message: {
			control: 'text',
			description: 'Dialog message'
		},
		confirmLabel: {
			control: 'text',
			description: 'Confirm button label'
		},
		cancelLabel: {
			control: 'text',
			description: 'Cancel button label'
		},
		danger: {
			control: 'boolean',
			description: 'Danger variant (red confirm button)'
		}
	}
} satisfies Meta<ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		open: true,
		title: 'Confirm Action',
		message: 'Are you sure you want to proceed with this action?'
	}
};

export const Danger: Story = {
	args: {
		open: true,
		title: 'Delete Post',
		message: 'Are you sure you want to delete this post? This action cannot be undone.',
		confirmLabel: 'Delete',
		danger: true
	}
};

export const CustomLabels: Story = {
	args: {
		open: true,
		title: 'Discard Changes',
		message: 'You have unsaved changes. Do you want to discard them?',
		confirmLabel: 'Discard',
		cancelLabel: 'Keep Editing',
		danger: true
	}
};

export const DeleteAccount: Story = {
	args: {
		open: true,
		title: 'Delete Account',
		message:
			'Are you absolutely sure? This will permanently delete your account and remove all your data from our servers. This action cannot be undone.',
		confirmLabel: 'Delete Account',
		cancelLabel: 'Cancel',
		danger: true
	}
};

export const LogoutConfirmation: Story = {
	args: {
		open: true,
		title: 'Logout',
		message: 'Are you sure you want to logout?',
		confirmLabel: 'Logout',
		cancelLabel: 'Stay'
	}
};

export const RemoveItem: Story = {
	args: {
		open: true,
		title: 'Remove Item',
		message: 'Remove this item from your wishlist?',
		confirmLabel: 'Remove',
		danger: true
	}
};
