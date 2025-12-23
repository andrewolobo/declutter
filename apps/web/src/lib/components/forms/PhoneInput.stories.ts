import type { Meta, StoryObj } from '@storybook/svelte';
import PhoneInput from './PhoneInput.svelte';

const meta = {
	title: 'Components/Forms/PhoneInput',
	component: PhoneInput,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		value: { control: 'text' },
		placeholder: { control: 'text' },
		countryCode: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' }
	}
} satisfies Meta<PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Phone Number',
		placeholder: '+1 (555) 000-0000'
	}
};

export const WithValue: Story = {
	args: {
		label: 'Phone Number',
		value: '+1 (555) 123-4567'
	}
};

export const WithError: Story = {
	args: {
		label: 'Phone Number',
		value: '123',
		error: 'Please enter a valid phone number'
	}
};

export const Required: Story = {
	args: {
		label: 'Contact Number',
		placeholder: '+1 (555) 000-0000',
		required: true
	}
};

export const Disabled: Story = {
	args: {
		label: 'Phone Number',
		value: '+1 (555) 123-4567',
		disabled: true
	}
};

export const WithCountryCode: Story = {
	args: {
		label: 'International Number',
		placeholder: '+44 20 1234 5678'
	}
};

export const Mobile: Story = {
	args: {
		label: 'Mobile Number',
		placeholder: '+1 (555) 000-0000',
		required: true
	}
};

export const EmergencyContact: Story = {
	args: {
		label: 'Emergency Contact',
		placeholder: '+1 (555) 000-0000'
	}
};

export const BusinessPhone: Story = {
	args: {
		label: 'Business Phone',
		placeholder: '+1 (555) 000-0000 ext. 123'
	}
};

export const VerificationForm: Story = {
	render: () => ({
		Component: PhoneInput,
		slot: `
			<form style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<PhoneInput 
					label="Mobile Number" 
					placeholder="+1 (555) 000-0000"
					helperText="We'll send a verification code to this number"
					required
				/>
				<button type="submit" style="padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					Send Code
				</button>
			</form>
		`
	})
};

export const ContactForm: Story = {
	render: () => ({
		Component: PhoneInput,
		slot: `
			<form style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<PhoneInput 
					label="Primary Phone" 
					placeholder="+1 (555) 000-0000"
					required
				/>
				<PhoneInput 
					label="Secondary Phone (Optional)" 
					placeholder="+1 (555) 000-0000"
				/>
				<button type="submit" style="padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					Save Contact Info
				</button>
			</form>
		`
	})
};

export const AllStates: Story = {
	render: () => ({
		Component: PhoneInput,
		slot: `
			<div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Default</h3>
					<PhoneInput label="Phone Number" placeholder="+1 (555) 000-0000" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Value</h3>
					<PhoneInput label="Phone Number" value="+1 (555) 123-4567" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Error</h3>
					<PhoneInput label="Phone Number" value="invalid" error="Invalid phone number format" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled</h3>
					<PhoneInput label="Phone Number" value="+1 (555) 123-4567" disabled />
				</div>
			</div>
		`
	})
};
