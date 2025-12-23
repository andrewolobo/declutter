import type { Meta, StoryObj } from '@storybook/svelte';
import Button from './Button.svelte';

interface ButtonProps {
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
	size?: 'sm' | 'md' | 'lg';
	loading?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
	icon?: string;
	children?: any;
}

const meta = {
	title: 'Components/Buttons/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost', 'danger'],
			description: 'Visual style variant',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'primary' }
			}
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
			description: 'Button size',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'md' }
			}
		},
		loading: {
			control: 'boolean',
			description: 'Show loading spinner',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' }
			}
		},
		disabled: {
			control: 'boolean',
			description: 'Disable button interactions',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' }
			}
		},
		fullWidth: {
			control: 'boolean',
			description: 'Expand to full container width',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' }
			}
		},
		icon: {
			control: 'text',
			description: 'Material icon name',
			table: {
				type: { summary: 'string' }
			}
		}
	}
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: 'Primary Button',
		variant: 'primary'
	}
};

export const Secondary: Story = {
	args: {
		children: 'Secondary Button',
		variant: 'secondary'
	}
};

export const Ghost: Story = {
	args: {
		children: 'Ghost Button',
		variant: 'ghost'
	}
};

export const Danger: Story = {
	args: {
		children: 'Delete',
		variant: 'danger'
	}
};

export const Small: Story = {
	args: {
		children: 'Small Button',
		size: 'sm'
	}
};

export const Large: Story = {
	args: {
		children: 'Large Button',
		size: 'lg'
	}
};

export const WithIcon: Story = {
	args: {
		children: 'Add Post',
		icon: 'add',
		variant: 'primary'
	}
};

export const Loading: Story = {
	args: {
		children: 'Submitting...',
		loading: true,
		variant: 'primary'
	}
};

export const Disabled: Story = {
	args: {
		children: 'Disabled Button',
		disabled: true
	}
};

export const FullWidth: Story = {
	args: {
		children: 'Full Width Button',
		fullWidth: true,
		variant: 'primary'
	},
	parameters: {
		layout: 'padded'
	}
};

export const AllVariants: Story = {
	render: () => ({
		Component: Button,
		slot: `
			<div style="display: flex; flex-direction: column; gap: 1rem; width: 300px;">
				<Button variant="primary">Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="danger">Danger</Button>
			</div>
		`
	})
};

export const AllSizes: Story = {
	render: () => ({
		Component: Button,
		slot: `
			<div style="display: flex; align-items: center; gap: 1rem;">
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="lg">Large</Button>
			</div>
		`
	})
};
