import type { Meta, StoryObj } from '@storybook/svelte';
import Sidebar from './Sidebar.svelte';

const meta = {
	title: 'Components/Layout/Sidebar',
	component: Sidebar,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActiveItem: Story = {
	args: {
		activePath: '/feed'
	}
};

export const Collapsed: Story = {
	args: {
		collapsed: true
	}
};

export const WithUser: Story = {
	args: {
		user: {
			id: 'user123',
			username: 'johndoe',
			displayName: 'John Doe',
			avatarUrl: 'https://i.pravatar.cc/150?u=johndoe'
		},
		activePath: '/profile'
	}
};

export const Mobile: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1'
		}
	},
	args: {
		mobileOpen: true
	}
};

export const AllMenuItems: Story = {
	render: () => ({
		Component: Sidebar,
		slot: `
			<div style="display: flex; gap: 1rem;">
				<Sidebar activePath="/feed" />
				<div style="flex: 1; padding: 2rem; background: var(--color-background);">
					<h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">Main Content Area</h1>
					<p style="color: var(--color-text-secondary);">The sidebar shows all navigation options.</p>
				</div>
			</div>
		`
	})
};

export const WithExpandedSections: Story = {
	args: {
		expandedSections: ['main', 'user']
	}
};
