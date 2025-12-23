import type { Meta, StoryObj } from '@storybook/svelte';
import ProgressBar from './ProgressBar.svelte';

const meta = {
	title: 'Components/Media/ProgressBar',
	component: ProgressBar,
	tags: ['autodocs'],
	argTypes: {
		value: {
			control: { type: 'range', min: 0, max: 100, step: 1 },
			description: 'Progress value (0-100)'
		},
		max: {
			control: 'number',
			description: 'Maximum value'
		},
		label: {
			control: 'text',
			description: 'Progress label'
		},
		showPercentage: {
			control: 'boolean',
			description: 'Show percentage text'
		},
		striped: {
			control: 'boolean',
			description: 'Striped pattern'
		},
		animated: {
			control: 'boolean',
			description: 'Animated stripes'
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
			description: 'Bar size'
		}
	}
} satisfies Meta<ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: 65
	}
};

export const WithLabel: Story = {
	args: {
		value: 45,
		label: 'Uploading images'
	}
};

export const WithPercentage: Story = {
	args: {
		value: 80,
		label: 'Profile completion',
		showPercentage: true
	}
};

export const Striped: Story = {
	args: {
		value: 70,
		striped: true
	}
};

export const Animated: Story = {
	args: {
		value: 55,
		striped: true,
		animated: true,
		label: 'Processing'
	}
};

export const Small: Story = {
	args: {
		value: 40,
		size: 'sm'
	}
};

export const Large: Story = {
	args: {
		value: 90,
		size: 'lg',
		label: 'Installation progress',
		showPercentage: true
	}
};

export const Complete: Story = {
	args: {
		value: 100,
		label: 'Complete!',
		showPercentage: true
	}
};

export const ProgressStages: Story = {
	render: () => ({
		Component: ProgressBar,
		slot: `
			<div style="display: flex; flex-direction: column; gap: 1.5rem; width: 400px;">
				<ProgressBar value={25} label="Step 1: Basic Info" showPercentage />
				<ProgressBar value={50} label="Step 2: Images" showPercentage />
				<ProgressBar value={75} label="Step 3: Pricing" showPercentage />
				<ProgressBar value={100} label="Step 4: Review" showPercentage />
			</div>
		`
	}),
	parameters: {
		layout: 'centered'
	}
};

export const ColorStates: Story = {
	render: () => ({
		Component: ProgressBar,
		slot: `
			<div style="display: flex; flex-direction: column; gap: 1.5rem; width: 400px;">
				<ProgressBar value={30} label="Low Progress" />
				<ProgressBar value={60} label="Medium Progress" />
				<ProgressBar value={90} label="High Progress" />
			</div>
		`
	}),
	parameters: {
		layout: 'centered'
	}
};
