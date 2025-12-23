import type { Meta, StoryObj } from '@storybook/svelte';
import MobileBottomNav from './MobileBottomNav.svelte';

const meta = {
	title: 'Components/Layout/MobileBottomNav',
	component: MobileBottomNav,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		viewport: {
			defaultViewport: 'mobile1'
		}
	}
} satisfies Meta<MobileBottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HomeActive: Story = {
	args: {
		activePath: '/'
	}
};

export const ExploreActive: Story = {
	args: {
		activePath: '/explore'
	}
};

export const CreateActive: Story = {
	args: {
		activePath: '/create'
	}
};

export const MessagesActive: Story = {
	args: {
		activePath: '/messages'
	}
};

export const ProfileActive: Story = {
	args: {
		activePath: '/profile'
	}
};

export const WithNotificationBadge: Story = {
	args: {
		activePath: '/',
		notificationCount: 3
	}
};

export const WithMessageBadge: Story = {
	args: {
		activePath: '/',
		messageCount: 5
	}
};

export const WithAllBadges: Story = {
	args: {
		activePath: '/explore',
		notificationCount: 7,
		messageCount: 2
	}
};

export const InAppView: Story = {
	render: () => ({
		Component: MobileBottomNav,
		slot: `
			<div style="min-height: 100vh; padding-bottom: 60px; background: var(--color-background);">
				<div style="padding: 1rem;">
					<h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Mobile View</h1>
					<p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
						The bottom navigation is fixed at the bottom of the screen on mobile devices.
					</p>
					<div style="display: flex; flex-direction: column; gap: 1rem;">
						<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1rem;">
							<h3 style="font-weight: 600; margin-bottom: 0.5rem;">Post 1</h3>
							<p style="color: var(--color-text-secondary); font-size: 0.875rem;">Sample content</p>
						</div>
						<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1rem;">
							<h3 style="font-weight: 600; margin-bottom: 0.5rem;">Post 2</h3>
							<p style="color: var(--color-text-secondary); font-size: 0.875rem;">Sample content</p>
						</div>
					</div>
				</div>
				<MobileBottomNav activePath="/" notificationCount={3} messageCount={2} />
			</div>
		`
	})
};

export const AllStates: Story = {
	render: () => ({
		Component: MobileBottomNav,
		slot: `
			<div style="display: flex; flex-direction: column; gap: 2rem; padding-bottom: 80px;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600; padding: 0 1rem;">Home Active</h3>
					<MobileBottomNav activePath="/" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600; padding: 0 1rem;">With Badges</h3>
					<MobileBottomNav activePath="/explore" notificationCount={5} messageCount={3} />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600; padding: 0 1rem;">Messages Active</h3>
					<MobileBottomNav activePath="/messages" messageCount={8} />
				</div>
			</div>
		`
	})
};
