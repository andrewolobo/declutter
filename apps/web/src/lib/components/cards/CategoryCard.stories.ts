import type { Meta, StoryObj } from '@storybook/svelte';
import CategoryCard from './CategoryCard.svelte';

const meta = {
	title: 'Components/Cards/CategoryCard',
	component: CategoryCard,
	tags: ['autodocs'],
	argTypes: {
		category: { control: 'object' }
	}
} satisfies Meta<CategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCategory = {
	id: 'cat1',
	name: 'Technology',
	slug: 'technology',
	description: 'Gadgets, electronics, and tech gear',
	_count: {
		posts: 1247
	}
};

export const Default: Story = {
	args: {
		category: sampleCategory
	}
};

export const Fashion: Story = {
	args: {
		category: {
			id: 'cat2',
			name: 'Fashion',
			slug: 'fashion',
			description: 'Clothing, accessories, and style',
			_count: {
				posts: 3456
			}
		}
	}
};

export const HomeDecor: Story = {
	args: {
		category: {
			id: 'cat3',
			name: 'Home & Decor',
			slug: 'home-decor',
			description: 'Furniture, decorations, and home essentials',
			_count: {
				posts: 892
			}
		}
	}
};

export const LowPostCount: Story = {
	args: {
		category: {
			...sampleCategory,
			name: 'Collectibles',
			description: 'Rare finds and vintage items',
			_count: {
				posts: 23
			}
		}
	}
};

export const NoDescription: Story = {
	args: {
		category: {
			...sampleCategory,
			description: ''
		}
	}
};

export const LongName: Story = {
	args: {
		category: {
			...sampleCategory,
			name: 'Sports & Outdoor Equipment',
			description: 'Gear for all your athletic and outdoor adventures'
		}
	}
};

export const HighPostCount: Story = {
	args: {
		category: {
			...sampleCategory,
			name: 'Electronics',
			description: 'Phones, computers, and accessories',
			_count: {
				posts: 15789
			}
		}
	}
};

export const CategoryGrid: Story = {
	render: () => ({
		Component: CategoryCard,
		slot: `
			<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; max-width: 1200px;">
				<CategoryCard category={${JSON.stringify({ id: '1', name: 'Technology', slug: 'tech', description: 'Latest tech gear', _count: { posts: 1247 } })}} />
				<CategoryCard category={${JSON.stringify({ id: '2', name: 'Fashion', slug: 'fashion', description: 'Style and clothing', _count: { posts: 3456 } })}} />
				<CategoryCard category={${JSON.stringify({ id: '3', name: 'Home', slug: 'home', description: 'Home essentials', _count: { posts: 892 } })}} />
				<CategoryCard category={${JSON.stringify({ id: '4', name: 'Sports', slug: 'sports', description: 'Athletic gear', _count: { posts: 654 } })}} />
				<CategoryCard category={${JSON.stringify({ id: '5', name: 'Books', slug: 'books', description: 'Reading materials', _count: { posts: 234 } })}} />
				<CategoryCard category={${JSON.stringify({ id: '6', name: 'Art', slug: 'art', description: 'Creative works', _count: { posts: 445 } })}} />
			</div>
		`
	})
};

export const CompactList: Story = {
	render: () => ({
		Component: CategoryCard,
		slot: `
			<div style="max-width: 800px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
				<CategoryCard category={${JSON.stringify({ id: '1', name: 'Technology', slug: 'tech', description: 'Tech gear', _count: { posts: 1247 } })}} />
				<CategoryCard category={${JSON.stringify({ id: '2', name: 'Fashion', slug: 'fashion', description: 'Clothing', _count: { posts: 3456 } })}} />
				<CategoryCard category={${JSON.stringify({ id: '3', name: 'Home', slug: 'home', description: 'Home items', _count: { posts: 892 } })}} />
				<CategoryCard category={${JSON.stringify({ id: '4', name: 'Sports', slug: 'sports', description: 'Sports gear', _count: { posts: 654 } })}} />
			</div>
		`
	})
};

export const PopularCategories: Story = {
	render: () => ({
		Component: CategoryCard,
		slot: `
			<div style="max-width: 1000px;">
				<h2 style="margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700;">Popular Categories</h2>
				<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
					<CategoryCard category={${JSON.stringify({ id: '1', name: 'Fashion & Apparel', slug: 'fashion', description: 'Sustainable fashion and second-hand clothing', _count: { posts: 8934 } })}} />
					<CategoryCard category={${JSON.stringify({ id: '2', name: 'Electronics', slug: 'electronics', description: 'Phones, laptops, and tech accessories', _count: { posts: 6542 } })}} />
					<CategoryCard category={${JSON.stringify({ id: '3', name: 'Home & Garden', slug: 'home', description: 'Furniture, decor, and outdoor items', _count: { posts: 4321 } })}} />
				</div>
			</div>
		`
	})
};
