import type { Meta, StoryObj } from '@storybook/svelte';
import PageHeader from './PageHeader.svelte';

const meta = {
	title: 'Components/Layout/PageHeader',
	component: PageHeader,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		subtitle: { control: 'text' },
		showBackButton: { control: 'boolean' }
	}
} satisfies Meta<PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'Page Title'
	}
};

export const WithSubtitle: Story = {
	args: {
		title: 'Settings',
		subtitle: 'Manage your account preferences'
	}
};

export const WithBackButton: Story = {
	args: {
		title: 'Product Details',
		showBackButton: true
	}
};

export const WithActions: Story = {
	render: () => ({
		Component: PageHeader,
		slot: `
			<PageHeader title="My Posts">
				<button slot="actions" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					Create Post
				</button>
			</PageHeader>
		`
	})
};

export const WithMultipleActions: Story = {
	render: () => ({
		Component: PageHeader,
		slot: `
			<PageHeader title="Products" subtitle="Manage your product listings">
				<div slot="actions" style="display: flex; gap: 0.75rem;">
					<button style="padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--color-border); border-radius: 0.5rem; font-weight: 600;">
						Export
					</button>
					<button style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
						Add Product
					</button>
				</div>
			</PageHeader>
		`
	})
};

export const ProfileHeader: Story = {
	render: () => ({
		Component: PageHeader,
		slot: `
			<PageHeader title="John Doe" subtitle="@johndoe • Member since 2024" showBackButton>
				<button slot="actions" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					Edit Profile
				</button>
			</PageHeader>
		`
	})
};

export const MessagesHeader: Story = {
	render: () => ({
		Component: PageHeader,
		slot: `
			<PageHeader title="Messages" subtitle="3 unread conversations">
				<button slot="actions" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					New Message
				</button>
			</PageHeader>
		`
	})
};

export const DashboardHeader: Story = {
	render: () => ({
		Component: PageHeader,
		slot: `
			<PageHeader title="Dashboard" subtitle="Welcome back! Here's your overview.">
				<div slot="actions" style="display: flex; gap: 0.75rem;">
					<button style="padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--color-border); border-radius: 0.5rem;">
						Download Report
					</button>
					<button style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
						Refresh Data
					</button>
				</div>
			</PageHeader>
		`
	})
};

export const SettingsHeader: Story = {
	args: {
		title: 'Account Settings',
		subtitle: 'Manage your account and privacy preferences'
	}
};

export const NotificationsHeader: Story = {
	render: () => ({
		Component: PageHeader,
		slot: `
			<PageHeader title="Notifications" subtitle="7 new notifications">
				<button slot="actions" style="padding: 0.5rem 1rem; color: #3b82f6; background: transparent; font-weight: 600;">
					Mark all as read
				</button>
			</PageHeader>
		`
	})
};

export const ProductDetailHeader: Story = {
	render: () => ({
		Component: PageHeader,
		slot: `
			<PageHeader title="Vintage Leather Jacket" subtitle="Listed by @fashionista" showBackButton>
				<div slot="actions" style="display: flex; gap: 0.75rem;">
					<button style="padding: 0.5rem; background: transparent; border: 1px solid var(--color-border); border-radius: 0.5rem;">
						❤️
					</button>
					<button style="padding: 0.5rem; background: transparent; border: 1px solid var(--color-border); border-radius: 0.5rem;">
						📤
					</button>
					<button style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
						Buy Now
					</button>
				</div>
			</PageHeader>
		`
	})
};

export const Mobile: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1'
		}
	},
	args: {
		title: 'Mobile View',
		subtitle: 'Subtitle text',
		showBackButton: true
	}
};

export const AllVariants: Story = {
	render: () => ({
		Component: PageHeader,
		slot: `
			<div style="display: flex; flex-direction: column; gap: 2rem;">
				<PageHeader title="Simple Title" />
				
				<PageHeader title="With Subtitle" subtitle="This is a subtitle" />
				
				<PageHeader title="With Back Button" showBackButton />
				
				<PageHeader title="With Action">
					<button slot="actions" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border-radius: 0.5rem;">
						Action
					</button>
				</PageHeader>
				
				<PageHeader title="All Features" subtitle="Subtitle text" showBackButton>
					<button slot="actions" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border-radius: 0.5rem;">
						Action
					</button>
				</PageHeader>
			</div>
		`
	})
};
