import type { Meta, StoryObj } from '@storybook/svelte';
import Input from './Input.svelte';

const meta = {
	title: 'Components/Forms/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		type: { control: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url'] },
		label: { control: 'text' },
		placeholder: { control: 'text' },
		value: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' },
		icon: { control: 'text' },
		iconPosition: { control: 'select', options: ['left', 'right'] },
		autocomplete: { control: 'text' }
	}
} satisfies Meta<Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Username',
		placeholder: 'Enter your username'
	}
};

export const WithValue: Story = {
	args: {
		label: 'Username',
		value: 'johndoe',
		placeholder: 'Enter your username'
	}
};

export const WithError: Story = {
	args: {
		label: 'Email',
		value: 'invalid-email',
		error: 'Please enter a valid email address',
		placeholder: 'Enter your email'
	}
};

export const Required: Story = {
	args: {
		label: 'Full Name',
		placeholder: 'Enter your full name',
		required: true
	}
};

export const Disabled: Story = {
	args: {
		label: 'Username',
		value: 'johndoe',
		disabled: true
	}
};

export const Email: Story = {
	args: {
		type: 'email',
		label: 'Email Address',
		placeholder: 'name@example.com'
	}
};

export const Password: Story = {
	args: {
		type: 'password',
		label: 'Password',
		placeholder: '••••••••'
	}
};

export const Number: Story = {
	args: {
		type: 'number',
		label: 'Age',
		placeholder: 'Enter your age'
	}
};

export const Telephone: Story = {
	args: {
		type: 'tel',
		label: 'Phone Number',
		placeholder: '+1 (555) 000-0000'
	}
};

export const URL: Story = {
	args: {
		type: 'url',
		label: 'Website',
		placeholder: 'https://example.com'
	}
};

export const WithHelperText: Story = {
	args: {
		label: 'API Key',
		placeholder: 'Enter your API key'
	}
};

export const FormExample: Story = {
	render: () => ({
		Component: Input,
		slot: `
			<form style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<Input label="Full Name" placeholder="John Doe" required />
				<Input type="email" label="Email" placeholder="john@example.com" required />
				<Input type="password" label="Password" placeholder="••••••••" required />
				<Input type="tel" label="Phone" placeholder="+1 (555) 000-0000" />
				<button type="submit" style="padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					Submit
				</button>
			</form>
		`
	})
};

export const AllStates: Story = {
	render: () => ({
		Component: Input,
		slot: `
			<div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Default</h3>
					<Input label="Username" placeholder="Enter username" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Value</h3>
					<Input label="Username" value="johndoe" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Error</h3>
					<Input label="Email" value="invalid" error="Invalid email format" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled</h3>
					<Input label="Username" value="johndoe" disabled />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Required</h3>
					<Input label="Full Name" required />
				</div>
			</div>
		`
	})
};
