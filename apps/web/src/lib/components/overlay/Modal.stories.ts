import type { Meta, StoryObj } from '@storybook/svelte';
import Modal from './Modal.svelte';
import Button from '$lib/components/buttons/Button.svelte';

const meta = {
	title: 'Components/Overlay/Modal',
	component: Modal,
	tags: ['autodocs'],
	argTypes: {
		open: {
			control: 'boolean',
			description: 'Modal open state'
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg', 'xl', 'full'],
			description: 'Modal size'
		},
		closeOnClickOutside: {
			control: 'boolean',
			description: 'Close when clicking backdrop'
		}
	}
} satisfies Meta<Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		open: true,
		children: `
			<div>
				<h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Modal Title</h2>
				<p style="color: #64748b; margin-bottom: 1.5rem;">This is a basic modal with some content. You can put any content here.</p>
				<button style="padding: 0.5rem 1rem; background: #13ecec; color: white; border-radius: 0.5rem; border: none; cursor: pointer;">Close</button>
			</div>
		`
	}
};

export const Small: Story = {
	args: {
		open: true,
		size: 'sm',
		children: `
			<div>
				<h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">Small Modal</h2>
				<p style="color: #64748b;">This is a small modal.</p>
			</div>
		`
	}
};

export const Large: Story = {
	args: {
		open: true,
		size: 'lg',
		children: `
			<div>
				<h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Large Modal</h2>
				<p style="color: #64748b; margin-bottom: 1rem;">This is a large modal with more content space.</p>
				<p style="color: #64748b;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
			</div>
		`
	}
};

export const FullScreen: Story = {
	args: {
		open: true,
		size: 'full',
		children: `
			<div>
				<h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Full Screen Modal</h2>
				<p style="color: #64748b; margin-bottom: 1rem;">This modal takes up the entire viewport.</p>
				<div style="height: 400px; background: #f1f5f9; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
					<p>Your content here</p>
				</div>
			</div>
		`
	}
};

export const WithHeaderAndFooter: Story = {
	args: {
		open: true,
		children: `
			<div>
				<div slot="header" style="padding: 1.5rem; border-bottom: 1px solid #e2e8f0;">
					<h2 style="font-size: 1.5rem; font-weight: bold;">Confirm Action</h2>
				</div>
				<div style="padding: 1.5rem;">
					<p style="color: #64748b;">Are you sure you want to proceed with this action? This cannot be undone.</p>
				</div>
				<div slot="footer" style="padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0; display: flex; gap: 0.5rem; justify-content: flex-end;">
					<button style="padding: 0.5rem 1rem; background: white; color: #64748b; border: 1px solid #e2e8f0; border-radius: 0.5rem; cursor: pointer;">Cancel</button>
					<button style="padding: 0.5rem 1rem; background: #13ecec; color: white; border-radius: 0.5rem; border: none; cursor: pointer;">Confirm</button>
				</div>
			</div>
		`
	}
};
