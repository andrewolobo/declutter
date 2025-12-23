import type { Meta, StoryObj } from '@storybook/svelte';
import Drawer from './Drawer.svelte';

const meta = {
	title: 'Components/Overlay/Drawer',
	component: Drawer,
	tags: ['autodocs'],
	argTypes: {
		open: {
			control: 'boolean',
			description: 'Drawer open state'
		},
		position: {
			control: 'select',
			options: ['left', 'right', 'bottom'],
			description: 'Drawer position'
		},
		size: {
			control: 'text',
			description: 'Custom size (CSS value)'
		}
	}
} satisfies Meta<Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Left: Story = {
	args: {
		open: true,
		position: 'left',
		children: `
			<div style="padding: 1.5rem;">
				<h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Navigation</h2>
				<nav style="display: flex; flex-direction: column; gap: 0.5rem;">
					<a href="#" style="padding: 0.75rem; border-radius: 0.5rem; background: #f1f5f9; text-decoration: none; color: #1e293b;">Home</a>
					<a href="#" style="padding: 0.75rem; border-radius: 0.5rem; text-decoration: none; color: #64748b;">Messages</a>
					<a href="#" style="padding: 0.75rem; border-radius: 0.5rem; text-decoration: none; color: #64748b;">Profile</a>
					<a href="#" style="padding: 0.75rem; border-radius: 0.5rem; text-decoration: none; color: #64748b;">Settings</a>
				</nav>
			</div>
		`
	}
};

export const Right: Story = {
	args: {
		open: true,
		position: 'right',
		children: `
			<div style="padding: 1.5rem;">
				<h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Filters</h2>
				<div style="display: flex; flex-direction: column; gap: 1rem;">
					<div>
						<label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Category</label>
						<select style="width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.5rem;">
							<option>All Categories</option>
							<option>Electronics</option>
							<option>Fashion</option>
						</select>
					</div>
					<div>
						<label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Price Range</label>
						<input type="range" style="width: 100%;" />
					</div>
					<button style="width: 100%; padding: 0.75rem; background: #13ecec; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">Apply Filters</button>
				</div>
			</div>
		`
	}
};

export const Bottom: Story = {
	args: {
		open: true,
		position: 'bottom',
		children: `
			<div style="padding: 1.5rem;">
				<h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Share</h2>
				<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
					<button style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: white; cursor: pointer;">
						<span style="font-size: 1.5rem;">📱</span>
						<span style="font-size: 0.875rem;">SMS</span>
					</button>
					<button style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: white; cursor: pointer;">
						<span style="font-size: 1.5rem;">✉️</span>
						<span style="font-size: 0.875rem;">Email</span>
					</button>
					<button style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: white; cursor: pointer;">
						<span style="font-size: 1.5rem;">🔗</span>
						<span style="font-size: 0.875rem;">Copy Link</span>
					</button>
					<button style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: white; cursor: pointer;">
						<span style="font-size: 1.5rem;">📤</span>
						<span style="font-size: 0.875rem;">More</span>
					</button>
				</div>
			</div>
		`
	}
};

export const CustomSize: Story = {
	args: {
		open: true,
		position: 'right',
		size: '500px',
		children: `
			<div style="padding: 1.5rem;">
				<h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Wide Drawer</h2>
				<p style="color: #64748b;">This drawer has a custom width of 500px.</p>
			</div>
		`
	}
};
