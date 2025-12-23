import type { Meta, StoryObj } from '@storybook/svelte';
import SplitLayout from './SplitLayout.svelte';

const meta = {
	title: 'Components/Layout/SplitLayout',
	component: SplitLayout,
	tags: ['autodocs'],
	argTypes: {
		ratio: { control: 'select', options: ['1:1', '1:2', '2:1', '1:3', '3:1'] },
		reverse: { control: 'boolean' }
	}
} satisfies Meta<SplitLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => ({
		Component: SplitLayout,
		slot: `
			<SplitLayout>
				<div slot="left" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem; min-height: 300px;">
					<h2 style="font-weight: 600; margin-bottom: 1rem;">Left Side</h2>
					<p style="color: var(--color-text-secondary);">This is the left panel.</p>
				</div>
				<div slot="right" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem; min-height: 300px;">
					<h2 style="font-weight: 600; margin-bottom: 1rem;">Right Side</h2>
					<p style="color: var(--color-text-secondary);">This is the right panel.</p>
				</div>
			</SplitLayout>
		`
	})
};

export const Ratio1to2: Story = {
	args: {
		ratio: '1:2'
	},
	render: () => ({
		Component: SplitLayout,
		slot: `
			<SplitLayout ratio="1:2">
				<div slot="left" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem; min-height: 300px;">
					<h3 style="font-weight: 600;">Sidebar (1)</h3>
				</div>
				<div slot="right" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem; min-height: 300px;">
					<h3 style="font-weight: 600;">Main Content (2)</h3>
				</div>
			</SplitLayout>
		`
	})
};

export const Ratio2to1: Story = {
	args: {
		ratio: '2:1'
	},
	render: () => ({
		Component: SplitLayout,
		slot: `
			<SplitLayout ratio="2:1">
				<div slot="left" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem; min-height: 300px;">
					<h3 style="font-weight: 600;">Main Content (2)</h3>
				</div>
				<div slot="right" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem; min-height: 300px;">
					<h3 style="font-weight: 600;">Sidebar (1)</h3>
				</div>
			</SplitLayout>
		`
	})
};

export const ProductPage: Story = {
	render: () => ({
		Component: SplitLayout,
		slot: `
			<SplitLayout>
				<div slot="left" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 400px;">
					<p style="color: var(--color-text-secondary);">Product Images</p>
				</div>
				<div slot="right" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem;">
					<h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem;">Vintage Leather Jacket</h1>
					<p style="font-size: 1.5rem; font-weight: 600; color: #3b82f6; margin-bottom: 1rem;">$129.99</p>
					<p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
						Beautiful vintage leather jacket in excellent condition. Classic style that never goes out of fashion.
					</p>
					<button style="width: 100%; padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
						Add to Cart
					</button>
				</div>
			</SplitLayout>
		`
	})
};

export const FeedWithSidebar: Story = {
	render: () => ({
		Component: SplitLayout,
		slot: `
			<SplitLayout ratio="2:1">
				<div slot="left" style="display: flex; flex-direction: column; gap: 1rem;">
					<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1.5rem;">
						<h3 style="font-weight: 600; margin-bottom: 0.5rem;">Post 1</h3>
						<p style="color: var(--color-text-secondary);">Content of the first post.</p>
					</div>
					<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1.5rem;">
						<h3 style="font-weight: 600; margin-bottom: 0.5rem;">Post 2</h3>
						<p style="color: var(--color-text-secondary);">Content of the second post.</p>
					</div>
				</div>
				<div slot="right">
					<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1.5rem;">
						<h3 style="font-weight: 600; margin-bottom: 1rem;">Suggested Users</h3>
						<p style="color: var(--color-text-secondary); font-size: 0.875rem;">User recommendations here</p>
					</div>
				</div>
			</SplitLayout>
		`
	})
};

export const SettingsLayout: Story = {
	render: () => ({
		Component: SplitLayout,
		slot: `
			<SplitLayout ratio="1:3">
				<div slot="left" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1.5rem;">
					<h3 style="font-weight: 600; margin-bottom: 1rem;">Settings Menu</h3>
					<ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
						<li style="padding: 0.5rem; border-radius: 0.25rem; background: #3b82f6; color: white;">Profile</li>
						<li style="padding: 0.5rem; border-radius: 0.25rem;">Privacy</li>
						<li style="padding: 0.5rem; border-radius: 0.25rem;">Notifications</li>
						<li style="padding: 0.5rem; border-radius: 0.25rem;">Security</li>
					</ul>
				</div>
				<div slot="right" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem;">
					<h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem;">Profile Settings</h2>
					<p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
						Manage your profile information and preferences.
					</p>
					<div style="display: flex; flex-direction: column; gap: 1rem;">
						<div>
							<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Display Name</label>
							<input type="text" value="John Doe" style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 0.25rem;" />
						</div>
						<div>
							<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Bio</label>
							<textarea style="width: 100%; padding: 0.5rem; border: 1px solid var(--color-border); border-radius: 0.25rem; min-height: 100px;">Tell us about yourself...</textarea>
						</div>
					</div>
				</div>
			</SplitLayout>
		`
	})
};

export const Mobile: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1'
		}
	},
	render: () => ({
		Component: SplitLayout,
		slot: `
			<SplitLayout>
				<div slot="left" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1.5rem;">
					<h3 style="font-weight: 600;">Left</h3>
				</div>
				<div slot="right" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1.5rem;">
					<h3 style="font-weight: 600;">Right</h3>
				</div>
			</SplitLayout>
		`
	})
};
