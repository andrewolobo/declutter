import type { Meta, StoryObj } from '@storybook/svelte';
import PostCardSkeleton from './PostCardSkeleton.svelte';

const meta = {
	title: 'Components/Cards/PostCardSkeleton',
	component: PostCardSkeleton,
	tags: ['autodocs']
} satisfies Meta<PostCardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultipleSkeleton: Story = {
	render: () => ({
		Component: PostCardSkeleton,
		slot: `
			<div style="max-width: 600px; display: flex; flex-direction: column; gap: 1rem;">
				<PostCardSkeleton />
				<PostCardSkeleton />
				<PostCardSkeleton />
			</div>
		`
	})
};

export const InFeed: Story = {
	render: () => ({
		Component: PostCardSkeleton,
		slot: `
			<div style="max-width: 600px; display: flex; flex-direction: column; gap: 1rem; padding: 1rem; background: var(--color-background);">
				<PostCardSkeleton />
				<PostCardSkeleton />
				<PostCardSkeleton />
				<PostCardSkeleton />
				<PostCardSkeleton />
			</div>
		`
	})
};
