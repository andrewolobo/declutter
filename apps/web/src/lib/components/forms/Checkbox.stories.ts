import type { Meta, StoryObj } from '@storybook/svelte';
import Checkbox from './Checkbox.svelte';

const meta = {
	title: 'Components/Forms/Checkbox',
	component: Checkbox,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		checked: { control: 'boolean' },
		disabled: { control: 'boolean' },
		error: { control: 'text' },
		required: { control: 'boolean' },
		indeterminate: { control: 'boolean' }
	}
} satisfies Meta<Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Accept terms and conditions'
	}
};

export const Checked: Story = {
	args: {
		label: 'Email notifications',
		checked: true
	}
};

export const Disabled: Story = {
	args: {
		label: 'Disabled option',
		disabled: true
	}
};

export const DisabledChecked: Story = {
	args: {
		label: 'Premium feature',
		checked: true,
		disabled: true
	}
};

export const WithError: Story = {
	args: {
		label: 'I agree to the terms',
		error: 'You must accept the terms to continue'
	}
};

export const LongLabel: Story = {
	args: {
		label:
			'I agree to receive marketing emails, promotional offers, and updates about new products and features. I understand I can unsubscribe at any time.'
	}
};

export const Terms: Story = {
	args: {
		label: 'I have read and agree to the Terms of Service and Privacy Policy',
		required: true
	}
};

export const Preferences: Story = {
	render: () => ({
		Component: Checkbox,
		slot: `
			<div style="max-width: 400px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Notification Preferences</h3>
				<div style="display: flex; flex-direction: column; gap: 0.75rem;">
					<Checkbox label="Email notifications" checked />
					<Checkbox label="Push notifications" checked />
					<Checkbox label="SMS notifications" />
					<Checkbox label="Marketing emails" />
					<Checkbox label="Weekly digest" checked />
				</div>
			</div>
		`
	})
};

export const FilterOptions: Story = {
	render: () => ({
		Component: Checkbox,
		slot: `
			<div style="max-width: 300px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Filter By Condition</h3>
				<div style="display: flex; flex-direction: column; gap: 0.5rem;">
					<Checkbox label="Brand New" checked />
					<Checkbox label="Like New" checked />
					<Checkbox label="Excellent" />
					<Checkbox label="Good" />
					<Checkbox label="Fair" />
				</div>
			</div>
		`
	})
};

export const FeatureToggles: Story = {
	render: () => ({
		Component: Checkbox,
		slot: `
			<div style="max-width: 400px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Account Features</h3>
				<div style="display: flex; flex-direction: column; gap: 0.75rem;">
					<Checkbox label="Profile visibility" checked />
					<Checkbox label="Show online status" checked />
					<Checkbox label="Allow messages from anyone" />
					<Checkbox label="Show posts in public feed" checked />
					<Checkbox label="Enable read receipts" />
				</div>
			</div>
		`
	})
};

export const FormAgreements: Story = {
	render: () => ({
		Component: Checkbox,
		slot: `
			<form style="max-width: 500px; display: flex; flex-direction: column; gap: 1rem;">
				<Checkbox 
					label="I agree to the Terms of Service and Privacy Policy" 
					required 
				/>
				<Checkbox 
					label="I confirm that I am 18 years or older" 
					required 
				/>
				<Checkbox 
					label="Send me promotional emails and updates (optional)" 
				/>
				<button type="submit" style="margin-top: 1rem; padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					Create Account
				</button>
			</form>
		`
	})
};

export const AllStates: Story = {
	render: () => ({
		Component: Checkbox,
		slot: `
			<div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Unchecked</h3>
					<Checkbox label="Unchecked option" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Checked</h3>
					<Checkbox label="Checked option" checked />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled</h3>
					<Checkbox label="Disabled option" disabled />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled & Checked</h3>
					<Checkbox label="Disabled checked option" checked disabled />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Error</h3>
					<Checkbox label="Required field" error="This field is required" />
				</div>
			</div>
		`
	})
};
