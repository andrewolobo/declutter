import type { Meta, StoryObj } from '@storybook/svelte';
import Toggle from './Toggle.svelte';

const meta = {
	title: 'Components/Forms/Toggle',
	component: Toggle,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		checked: { control: 'boolean' },
		disabled: { control: 'boolean' },
		error: { control: 'text' },
		required: { control: 'boolean' },
		size: { control: 'select', options: ['sm', 'md', 'lg'] }
	}
} satisfies Meta<Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Enable notifications'
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

export const WithDescription: Story = {
	args: {
		label: 'Dark Mode',
		checked: true
	}
};

export const NotificationSettings: Story = {
	render: () => ({
		Component: Toggle,
		slot: `
			<div style="max-width: 500px;">
				<h3 style="margin-bottom: 1.5rem; font-weight: 600;">Notification Preferences</h3>
				<div style="display: flex; flex-direction: column; gap: 1.5rem;">
					<Toggle 
						label="Email Notifications" 
						description="Receive email updates about your activity"
						checked 
					/>
					<Toggle 
						label="Push Notifications" 
						description="Get push notifications on your devices"
						checked 
					/>
					<Toggle 
						label="SMS Notifications" 
						description="Receive text messages for important updates"
					/>
					<Toggle 
						label="Marketing Emails" 
						description="Promotional offers and updates"
					/>
				</div>
			</div>
		`
	})
};

export const PrivacySettings: Story = {
	render: () => ({
		Component: Toggle,
		slot: `
			<div style="max-width: 500px;">
				<h3 style="margin-bottom: 1.5rem; font-weight: 600;">Privacy Settings</h3>
				<div style="display: flex; flex-direction: column; gap: 1.5rem;">
					<Toggle 
						label="Profile Visibility" 
						description="Allow others to view your profile"
						checked 
					/>
					<Toggle 
						label="Show Online Status" 
						description="Let others see when you're online"
						checked 
					/>
					<Toggle 
						label="Allow Messages" 
						description="Allow anyone to send you messages"
						checked 
					/>
					<Toggle 
						label="Show Email Address" 
						description="Display your email on your profile"
					/>
				</div>
			</div>
		`
	})
};

export const AccountFeatures: Story = {
	render: () => ({
		Component: Toggle,
		slot: `
			<div style="max-width: 500px;">
				<h3 style="margin-bottom: 1.5rem; font-weight: 600;">Account Features</h3>
				<div style="display: flex; flex-direction: column; gap: 1.5rem;">
					<Toggle 
						label="Two-Factor Authentication" 
						description="Add an extra layer of security"
						checked 
					/>
					<Toggle 
						label="Email Verification" 
						description="Verify your email address"
						checked 
						disabled 
					/>
					<Toggle 
						label="Auto-Save Drafts" 
						description="Automatically save your work"
						checked 
					/>
					<Toggle 
						label="Show Activity Status" 
						description="Display your recent activity"
					/>
				</div>
			</div>
		`
	})
};

export const AppSettings: Story = {
	render: () => ({
		Component: Toggle,
		slot: `
			<div style="max-width: 500px;">
				<h3 style="margin-bottom: 1.5rem; font-weight: 600;">App Settings</h3>
				<div style="display: flex; flex-direction: column; gap: 1.5rem;">
					<Toggle 
						label="Dark Mode" 
						description="Switch between light and dark theme"
						checked 
					/>
					<Toggle 
						label="Compact View" 
						description="Show more content in less space"
					/>
					<Toggle 
						label="Auto-Play Videos" 
						description="Automatically play videos in feed"
						checked 
					/>
					<Toggle 
						label="High Quality Images" 
						description="Load higher resolution images (uses more data)"
						checked 
					/>
				</div>
			</div>
		`
	})
};

export const CompactList: Story = {
	render: () => ({
		Component: Toggle,
		slot: `
			<div style="max-width: 400px;">
				<div style="display: flex; flex-direction: column; gap: 1rem;">
					<Toggle label="Email notifications" checked />
					<Toggle label="Push notifications" checked />
					<Toggle label="SMS notifications" />
					<Toggle label="Marketing emails" />
					<Toggle label="Weekly digest" checked />
				</div>
			</div>
		`
	})
};

export const AllStates: Story = {
	render: () => ({
		Component: Toggle,
		slot: `
			<div style="max-width: 500px; display: flex; flex-direction: column; gap: 1.5rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Unchecked</h3>
					<Toggle label="Feature disabled" description="This feature is currently off" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Checked</h3>
					<Toggle label="Feature enabled" description="This feature is currently on" checked />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled</h3>
					<Toggle label="Unavailable feature" description="This feature is not available" disabled />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled & Checked</h3>
					<Toggle label="Locked feature" description="This feature is enabled and locked" checked disabled />
				</div>
			</div>
		`
	})
};
