import type { Meta, StoryObj } from '@storybook/svelte';
import ImageUploader from './ImageUploader.svelte';

const meta = {
	title: 'Components/Forms/ImageUploader',
	component: ImageUploader,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		images: { control: 'object' },
		maxImages: { control: 'number' },
		disabled: { control: 'boolean' },
		error: { control: 'text' },
		required: { control: 'boolean' }
	}
} satisfies Meta<ImageUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Upload Images'
	}
};

export const SingleImage: Story = {
	args: {
		label: 'Profile Picture'
	}
};

export const MultipleImages: Story = {
	args: {
		label: 'Product Images',
		maxImages: 5
	}
};

export const WithPreview: Story = {
	args: {
		label: 'Gallery Images'
	}
};

export const Disabled: Story = {
	args: {
		label: 'Upload Images',
		disabled: true
	}
};

export const WithError: Story = {
	args: {
		label: 'Upload Images',
		error: 'Image size too large. Maximum 5MB per image.'
	}
};

export const ProductListing: Story = {
	args: {
		label: 'Product Photos',
		maxImages: 8
	}
};

export const CoverPhoto: Story = {
	args: {
		label: 'Cover Photo',
		aspectRatio: '16:9'
	}
};

export const Avatar: Story = {
	args: {
		label: 'Avatar',
		aspectRatio: '1:1'
	}
};

export const WithDragDrop: Story = {
	args: {
		label: 'Upload Images'
	}
};

export const FormExample: Story = {
	render: () => ({
		Component: ImageUploader,
		slot: `
			<form style="max-width: 600px; display: flex; flex-direction: column; gap: 2rem;">
				<ImageUploader 
					label="Product Images" 
					multiple
					maxImages={5}
					showPreview
					helperText="Upload 1-5 images. First image will be the cover."
				/>
				<ImageUploader 
					label="Product Certificate (Optional)" 
					multiple={false}
					helperText="Upload authenticity certificate if available"
				/>
				<button type="submit" style="padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					List Product
				</button>
			</form>
		`
	})
};

export const AllStates: Story = {
	render: () => ({
		Component: ImageUploader,
		slot: `
			<div style="max-width: 600px; display: flex; flex-direction: column; gap: 2rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Single Image</h3>
					<ImageUploader label="Upload Photo" multiple={false} />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Multiple Images</h3>
					<ImageUploader label="Upload Photos" multiple maxImages={3} />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Preview</h3>
					<ImageUploader label="Gallery" multiple showPreview />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Error</h3>
					<ImageUploader label="Upload Image" error="File format not supported" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled</h3>
					<ImageUploader label="Upload Photo" disabled />
				</div>
			</div>
		`
	})
};
