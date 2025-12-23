import type { Meta, StoryObj } from '@storybook/svelte';
import DateTimePicker from './DateTimePicker.svelte';

const meta = {
	title: 'Components/Forms/DateTimePicker',
	component: DateTimePicker,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		value: { control: 'date' },
		showTime: { control: 'boolean' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' },
		minDate: { control: 'date' },
		maxDate: { control: 'date' }
	}
} satisfies Meta<DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Select Date'
	}
};

export const WithTime: Story = {
	args: {
		label: 'Select Date and Time',
		showTime: true
	}
};

export const WithValue: Story = {
	args: {
		label: 'Appointment Date',
		value: new Date('2024-12-20')
	}
};

export const WithError: Story = {
	args: {
		label: 'Pickup Date',
		error: 'Date must be in the future'
	}
};

export const DateTimeWithValue: Story = {
	args: {
		label: 'Preferred Meetup Time',
		showTime: true,
		value: new Date('2024-12-20T14:30:00')
	}
};

export const FormExample: Story = {
	render: () => ({
		Component: DateTimePicker,
		slot: `
			<form style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<DateTimePicker 
					label="Pickup Date" 
				/>
				<DateTimePicker 
					label="Pickup Time" 
					showTime={true}
				/>
				<button type="submit" style="padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					Schedule Pickup
				</button>
			</form>
		`
	})
};

export const AllStates: Story = {
	render: () => ({
		Component: DateTimePicker,
		slot: `
			<div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Date Only</h3>
					<DateTimePicker label="Select Date" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Date with Time</h3>
					<DateTimePicker label="Select Date & Time" showTime={true} />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Error</h3>
					<DateTimePicker label="Invalid Date" error="Date cannot be in the past" />
				</div>
			</div>
		`
	})
};
