import type { Meta, StoryObj } from '@storybook/svelte';
import Badge from './Badge.svelte';

const meta = {
	title: 'Components/Media/Badge',
	component: Badge,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['status', 'count', 'label'],
			description: 'Badge variant'
		},
		color: {
			control: 'select',
			options: ['primary', 'success', 'warning', 'danger', 'info'],
			description: 'Color theme'
		},
		label: {
			control: 'text',
			description: 'Badge text (for label variant)'
		},
		count: {
			control: 'number',
			description: 'Count number (for count variant)'
		},
		pulse: {
			control: 'boolean',
			description: 'Pulse animation'
		}
	}
} satisfies Meta<Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusDot: Story = {
	args: {
		variant: 'status',
		color: 'success'
	}
};

export const CountBadge: Story = {
	args: {
		variant: 'count',
		count: 5,
		color: 'danger'
	}
};

export const LabelBadge: Story = {
	args: {
		variant: 'label',
		label: 'New',
		color: 'primary'
	}
};

export const WithPulse: Story = {
	args: {
		variant: 'status',
		color: 'success',
		pulse: true
	}
};

export const AllColors: Story = {
	render: () => ({
		Component: Badge,
		slot: `
			<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
				<Badge variant="label" label="Primary" color="primary" />
				<Badge variant="label" label="Success" color="success" />
				<Badge variant="label" label="Warning" color="warning" />
				<Badge variant="label" label="Danger" color="danger" />
				<Badge variant="label" label="Info" color="info" />
			</div>
		`
	})
};

export const CountVariations: Story = {
	render: () => ({
		Component: Badge,
		slot: `
			<div style="display: flex; gap: 1rem; align-items: center;">
				<Badge variant="count" count={1} color="danger" />
				<Badge variant="count" count={5} color="danger" />
				<Badge variant="count" count={10} color="danger" />
				<Badge variant="count" count={99} color="danger" />
				<Badge variant="count" count={100} color="danger" />
			</div>
		`
	})
};

export const StatusStates: Story = {
	render: () => ({
		Component: Badge,
		slot: `
			<div style="display: flex; gap: 2rem; align-items: center;">
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<Badge variant="status" color="success" pulse />
					<span>Online</span>
				</div>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<Badge variant="status" color="warning" />
					<span>Away</span>
				</div>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<Badge variant="status" color="danger" />
					<span>Busy</span>
				</div>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<Badge variant="status" color="info" />
					<span>Offline</span>
				</div>
			</div>
		`
	})
};
