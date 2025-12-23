import type { Meta, StoryObj } from '@storybook/svelte';
import ImageCarousel from './ImageCarousel.svelte';

const meta = {
	title: 'Components/Media/ImageCarousel',
	component: ImageCarousel,
	tags: ['autodocs'],
	argTypes: {
		images: {
			control: 'object',
			description: 'Array of image URLs'
		},
		aspectRatio: {
			control: 'select',
			options: ['square', '4:3', '16:9', 'auto'],
			description: 'Image aspect ratio'
		},
		showThumbnails: {
			control: 'boolean',
			description: 'Show thumbnail strip'
		},
		showDots: {
			control: 'boolean',
			description: 'Show dot indicators'
		},
		autoPlay: {
			control: 'boolean',
			description: 'Auto-advance slides'
		},
		interval: {
			control: 'number',
			description: 'Auto-play interval (ms)'
		}
	}
} satisfies Meta<ImageCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImages = [
	'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
	'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
	'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
	'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800'
];

export const Default: Story = {
	args: {
		images: sampleImages
	}
};

export const WithThumbnails: Story = {
	args: {
		images: sampleImages,
		showThumbnails: true
	}
};

export const WithoutDots: Story = {
	args: {
		images: sampleImages,
		showDots: false
	}
};

export const AutoPlay: Story = {
	args: {
		images: sampleImages,
		autoPlay: true,
		interval: 3000
	}
};

export const Square: Story = {
	args: {
		images: sampleImages,
		aspectRatio: 'square'
	}
};

export const Ratio16x9: Story = {
	args: {
		images: sampleImages,
		aspectRatio: '16:9'
	}
};

export const SingleImage: Story = {
	args: {
		images: [sampleImages[0]]
	}
};

export const ManyImages: Story = {
	args: {
		images: [
			...sampleImages,
			'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
			'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
			'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800'
		],
		showThumbnails: true
	}
};
