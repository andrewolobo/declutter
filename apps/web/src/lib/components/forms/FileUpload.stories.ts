import type { Meta, StoryObj } from '@storybook/svelte';
import FileUpload from './FileUpload.svelte';

const meta = {
	title: 'Components/Forms/FileUpload',
	component: FileUpload,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		accept: { control: 'text' },
		multiple: { control: 'boolean' },
		disabled: { control: 'boolean' },
		error: { control: 'text' },
		required: { control: 'boolean' },
		maxSize: { control: 'number' },
		maxFiles: { control: 'number' },
		preview: { control: 'boolean' }
	}
} satisfies Meta<FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Upload File'
	}
};

export const Images: Story = {
	args: {
		label: 'Upload Images',
		accept: 'image/*'
	}
};

export const MultipleFiles: Story = {
	args: {
		label: 'Upload Documents',
		accept: '.pdf,.doc,.docx',
		multiple: true
	}
};

export const WithMaxSize: Story = {
	args: {
		label: 'Upload Photo',
		accept: 'image/*',
		maxSize: 5242880 // 5MB
	}
};

export const Disabled: Story = {
	args: {
		label: 'Upload File',
		disabled: true
	}
};

export const WithError: Story = {
	args: {
		label: 'Upload File',
		error: 'File size exceeds maximum limit'
	}
};

export const ProductImages: Story = {
	args: {
		label: 'Product Images',
		accept: 'image/jpeg,image/png,image/webp',
		multiple: true,
		maxSize: 10485760 // 10MB
	}
};

export const ProfilePicture: Story = {
	args: {
		label: 'Profile Picture',
		accept: 'image/*',
		maxSize: 2097152 // 2MB
	}
};

export const Documents: Story = {
	args: {
		label: 'Verification Documents',
		accept: '.pdf,.jpg,.jpeg,.png',
		multiple: true
	}
};

export const VideoUpload: Story = {
	args: {
		label: 'Upload Video',
		accept: 'video/*',
		maxSize: 104857600 // 100MB
	}
};

export const FormExample: Story = {
	render: () => ({
		Component: FileUpload,
		slot: `
			<form style="max-width: 500px; display: flex; flex-direction: column; gap: 1.5rem;">
				<FileUpload 
					label="Product Images" 
					accept="image/*"
					multiple
					helperText="Upload up to 5 images (JPG, PNG, WebP)"
				/>
				<FileUpload 
					label="Product Manual (Optional)" 
					accept=".pdf"
					helperText="Upload product manual or documentation"
				/>
				<button type="submit" style="padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					Upload Files
				</button>
			</form>
		`
	})
};

export const AllStates: Story = {
	render: () => ({
		Component: FileUpload,
		slot: `
			<div style="max-width: 500px; display: flex; flex-direction: column; gap: 1.5rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Default</h3>
					<FileUpload label="Upload File" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Helper Text</h3>
					<FileUpload label="Upload Image" accept="image/*" helperText="PNG or JPG, max 5MB" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Multiple Files</h3>
					<FileUpload label="Upload Documents" multiple helperText="You can select multiple files" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Error</h3>
					<FileUpload label="Upload File" error="File type not supported" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled</h3>
					<FileUpload label="Upload File" disabled />
				</div>
			</div>
		`
	})
};
