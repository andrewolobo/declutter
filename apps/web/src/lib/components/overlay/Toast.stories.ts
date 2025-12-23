import type { Meta, StoryObj } from '@storybook/svelte';
import Toast from './Toast.svelte';

const meta = {
	title: 'Components/Overlay/Toast',
	component: Toast,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['success', 'error', 'warning', 'info'],
			description: 'Toast variant'
		},
		message: {
			control: 'text',
			description: 'Toast message'
		},
		duration: {
			control: 'number',
			description: 'Auto-dismiss duration (ms, 0 for no auto-dismiss)'
		},
		actionLabel: {
			control: 'text',
			description: 'Action button label'
		}
	},
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
	args: {
		variant: 'success',
		message: 'Post published successfully!'
	}
};

export const Error: Story = {
	args: {
		variant: 'error',
		message: 'Failed to upload image. Please try again.'
	}
};

export const Warning: Story = {
	args: {
		variant: 'warning',
		message: 'Your session will expire in 5 minutes.'
	}
};

export const Info: Story = {
	args: {
		variant: 'info',
		message: 'New message from John Doe'
	}
};

export const WithAction: Story = {
	args: {
		variant: 'success',
		message: 'Post saved as draft',
		actionLabel: 'View'
	}
};

export const NoDismiss: Story = {
	args: {
		variant: 'error',
		message: 'Action required: Please verify your email',
		duration: 0,
		actionLabel: 'Verify Now'
	}
};

export const LongMessage: Story = {
	args: {
		variant: 'info',
		message:
			'Your post has been submitted for review. We will notify you once it has been approved by our moderation team. This usually takes 24-48 hours.'
	}
};
