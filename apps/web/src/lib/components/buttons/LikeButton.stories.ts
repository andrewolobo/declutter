import type { Meta, StoryObj } from '@storybook/svelte';
import LikeButton from './LikeButton.svelte';

const meta = {
	title: 'Components/Buttons/LikeButton',
	component: LikeButton ,
	tags: ['autodocs'],
	argTypes: {
		liked: {
			control: 'boolean',
			description: 'Whether item is liked'
		},
		count: {
			control: 'number',
			description: 'Number of likes'
		},
		disabled: {
			control: 'boolean',
			description: 'Disable button interactions'
		}
	}
} satisfies Meta<LikeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unliked: Story = {
	args: {
		liked: false,
		count: 24
	}
};

export const Liked: Story = {
	args: {
		liked: true,
		count: 25
	}
};

export const Disabled: Story = {
	args: {
		liked: false,
		count: 24,
		disabled: true
	}
};

export const ZeroLikes: Story = {
	args: {
		liked: false,
		count: 0
	}
};

export const HighCount: Story = {
	args: {
		liked: true,
		count: 1543
	}
};

export const Interactive: Story = {
	args: {
		liked: false,
		count: 42,
		onToggle: (liked: boolean) => {
			console.log('Liked:', liked);
		}
	},
	play: async ({ canvasElement }) => {
		// Simulate clicking the like button
		const button = canvasElement.querySelector('button');
		if (button) {
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}
};
