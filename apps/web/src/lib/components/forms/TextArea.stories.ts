import type { Meta, StoryObj } from '@storybook/svelte';
import TextArea from './TextArea.svelte';

const meta = {
	title: 'Components/Forms/TextArea',
	component: TextArea,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		value: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' },
		rows: { control: 'number' },
		maxLength: { control: 'number' },
		autoResize: { control: 'boolean' }
	}
} satisfies Meta<TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Description',
		placeholder: 'Enter description...'
	}
};

export const WithValue: Story = {
	args: {
		label: 'Bio',
		value:
			'Passionate about sustainable fashion and second-hand shopping. Love finding unique pieces!',
		placeholder: 'Tell us about yourself'
	}
};

export const WithError: Story = {
	args: {
		label: 'Message',
		value: 'Hi',
		error: 'Message must be at least 10 characters',
		placeholder: 'Enter your message'
	}
};

export const Required: Story = {
	args: {
		label: 'Product Description',
		placeholder: 'Describe your product in detail',
		required: true
	}
};

export const Disabled: Story = {
	args: {
		label: 'Description',
		value: 'This field is disabled',
		disabled: true
	}
};

export const CustomRows: Story = {
	args: {
		label: 'Long Description',
		placeholder: 'Enter a detailed description',
		rows: 8
	}
};

export const WithCharacterCount: Story = {
	args: {
		label: 'Post Content',
		placeholder: "What's on your mind?",
		maxLength: 500,
		value: 'This textarea has a character limit of 500 characters.'
	}
};

export const PostCreation: Story = {
	args: {
		label: 'Create Post',
		placeholder: 'Share your thoughts with the community...',
		rows: 5,
		maxLength: 1000
	}
};

export const ProductDescription: Story = {
	args: {
		label: 'Product Description',
		placeholder: 'Describe the condition, features, and any defects...',
		rows: 6,
		required: true
	}
};

export const ReviewForm: Story = {
	args: {
		label: 'Your Review',
		placeholder: 'Share your experience with this product...',
		rows: 4,
		maxLength: 500
	}
};

export const MessageComposer: Story = {
	args: {
		label: 'Message',
		placeholder: 'Type your message...',
		rows: 3
	}
};

export const AllStates: Story = {
	render: () => ({
		Component: TextArea,
		slot: `
			<div style="max-width: 500px; display: flex; flex-direction: column; gap: 1.5rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Default</h3>
					<TextArea label="Description" placeholder="Enter description..." />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Value</h3>
					<TextArea label="Bio" value="Full-stack developer and designer" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Error</h3>
					<TextArea label="Message" value="Hi" error="Message too short" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled</h3>
					<TextArea label="Description" value="Disabled field" disabled />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Character Limit</h3>
					<TextArea label="Post" placeholder="What's on your mind?" maxLength={280} />
				</div>
			</div>
		`
	})
};

export const FormExample: Story = {
	render: () => ({
		Component: TextArea,
		slot: `
			<form style="max-width: 600px; display: flex; flex-direction: column; gap: 1.5rem;">
				<TextArea 
					label="Product Description" 
					placeholder="Describe your item in detail..."
					rows={6}
					required
					helperText="Include condition, brand, size, and any defects"
				/>
				<TextArea 
					label="Additional Notes" 
					placeholder="Any other information buyers should know..."
					rows={3}
				/>
				<button type="submit" style="padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					List Product
				</button>
			</form>
		`
	})
};
