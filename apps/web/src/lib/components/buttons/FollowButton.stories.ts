import type { Meta, StoryObj } from '@storybook/svelte';
import FollowButton from './FollowButton.svelte';

const meta = {
	title: 'Components/Buttons/FollowButton',
	component: FollowButton,
	tags: ['autodocs'],
	argTypes: {
		following: {
			control: 'boolean',
			description: 'Whether user is following'
		}
	}
} satisfies Meta<FollowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFollowing: Story = {
	args: {
		following: false
	}
};

export const Following: Story = {
	args: {
		following: true
	}
};

export const Interactive: Story = {
	args: {
		following: false
	},
	parameters: {
		docs: {
			description: {
				story: 'Hover over the button when following to see the "Unfollow" state.'
			}
		}
	}
};
