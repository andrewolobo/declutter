import type { Meta, StoryObj } from '@storybook/svelte';
import ContentContainer from './ContentContainer.svelte';

const meta = {
	title: 'Components/Layout/ContentContainer',
	component: ContentContainer,
	tags: ['autodocs'],
	argTypes: {
		maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'] },
		padding: { control: 'boolean' }
	}
} satisfies Meta<ContentContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => ({
		Component: ContentContainer,
		slot: `
			<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem;">
				<h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">Content Container</h1>
				<p style="color: var(--color-text-secondary);">This content is centered with a maximum width.</p>
			</div>
		`
	})
};

export const Small: Story = {
	args: {
		maxWidth: 'sm'
	},
	render: () => ({
		Component: ContentContainer,
		slot: `
			<ContentContainer maxWidth="sm">
				<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem;">
					<h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Small Container</h2>
					<p style="color: var(--color-text-secondary);">Perfect for forms and narrow content.</p>
				</div>
			</ContentContainer>
		`
	})
};

export const Medium: Story = {
	args: {
		maxWidth: 'md'
	},
	render: () => ({
		Component: ContentContainer,
		slot: `
			<ContentContainer maxWidth="md">
				<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem;">
					<h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Medium Container</h2>
					<p style="color: var(--color-text-secondary);">Good for blog posts and articles.</p>
				</div>
			</ContentContainer>
		`
	})
};

export const Large: Story = {
	args: {
		maxWidth: 'lg'
	},
	render: () => ({
		Component: ContentContainer,
		slot: `
			<ContentContainer maxWidth="lg">
				<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem;">
					<h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Large Container</h2>
					<p style="color: var(--color-text-secondary);">Ideal for dashboards and wide layouts.</p>
				</div>
			</ContentContainer>
		`
	})
};

export const ExtraLarge: Story = {
	args: {
		maxWidth: 'xl'
	},
	render: () => ({
		Component: ContentContainer,
		slot: `
			<ContentContainer maxWidth="xl">
				<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem;">
					<h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Extra Large Container</h2>
					<p style="color: var(--color-text-secondary);">For complex layouts with multiple columns.</p>
				</div>
			</ContentContainer>
		`
	})
};

export const FullWidth: Story = {
	args: {
		maxWidth: 'full'
	},
	render: () => ({
		Component: ContentContainer,
		slot: `
			<ContentContainer maxWidth="full">
				<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem;">
					<h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Full Width Container</h2>
					<p style="color: var(--color-text-secondary);">Takes up the entire available width.</p>
				</div>
			</ContentContainer>
		`
	})
};

export const NoPadding: Story = {
	args: {
		padding: false
	},
	render: () => ({
		Component: ContentContainer,
		slot: `
			<ContentContainer padding={false}>
				<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 2rem;">
					<h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">No Padding</h2>
					<p style="color: var(--color-text-secondary);">Container without default padding.</p>
				</div>
			</ContentContainer>
		`
	})
};

export const ArticleLayout: Story = {
	render: () => ({
		Component: ContentContainer,
		slot: `
			<ContentContainer maxWidth="md">
				<article>
					<h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">Article Title</h1>
					<p style="color: var(--color-text-secondary); margin-bottom: 2rem;">Published on December 17, 2024</p>
					<p style="line-height: 1.75; margin-bottom: 1rem;">
						This is a sample article layout using the ContentContainer component with medium width. 
						The content is centered and has a comfortable reading width.
					</p>
					<p style="line-height: 1.75; margin-bottom: 1rem;">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
						ut labore et dolore magna aliqua.
					</p>
					<p style="line-height: 1.75;">
						Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
						commodo consequat.
					</p>
				</article>
			</ContentContainer>
		`
	})
};

export const DashboardLayout: Story = {
	render: () => ({
		Component: ContentContainer,
		slot: `
			<ContentContainer maxWidth="xl">
				<h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 2rem;">Dashboard</h1>
				<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
					<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1.5rem;">
						<h3 style="font-weight: 600; margin-bottom: 0.5rem;">Total Sales</h3>
						<p style="font-size: 2rem; font-weight: 700; color: #3b82f6;">$12,345</p>
					</div>
					<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1.5rem;">
						<h3 style="font-weight: 600; margin-bottom: 0.5rem;">Active Users</h3>
						<p style="font-size: 2rem; font-weight: 700; color: #10b981;">1,247</p>
					</div>
					<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; padding: 1.5rem;">
						<h3 style="font-weight: 600; margin-bottom: 0.5rem;">Orders</h3>
						<p style="font-size: 2rem; font-weight: 700; color: #f59e0b;">234</p>
					</div>
				</div>
			</ContentContainer>
		`
	})
};

export const AllSizes: Story = {
	render: () => ({
		Component: ContentContainer,
		slot: `
			<div style="display: flex; flex-direction: column; gap: 2rem;">
				<ContentContainer maxWidth="sm">
					<div style="background: #3b82f6; color: white; border-radius: 0.5rem; padding: 1rem; text-align: center;">
						Small (sm)
					</div>
				</ContentContainer>
				<ContentContainer maxWidth="md">
					<div style="background: #10b981; color: white; border-radius: 0.5rem; padding: 1rem; text-align: center;">
						Medium (md)
					</div>
				</ContentContainer>
				<ContentContainer maxWidth="lg">
					<div style="background: #f59e0b; color: white; border-radius: 0.5rem; padding: 1rem; text-align: center;">
						Large (lg)
					</div>
				</ContentContainer>
				<ContentContainer maxWidth="xl">
					<div style="background: #ef4444; color: white; border-radius: 0.5rem; padding: 1rem; text-align: center;">
						Extra Large (xl)
					</div>
				</ContentContainer>
				<ContentContainer maxWidth="2xl">
					<div style="background: #8b5cf6; color: white; border-radius: 0.5rem; padding: 1rem; text-align: center;">
						2XL (2xl)
					</div>
				</ContentContainer>
			</div>
		`
	})
};
