import type { Meta, StoryObj } from '@storybook/svelte';
import Select from './Select.svelte';

const meta = {
	title: 'Components/Forms/Select',
	component: Select,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		value: { control: 'text' },
		options: { control: 'object' },
		placeholder: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		searchable: { control: 'boolean' },
		multiple: { control: 'boolean' },
		required: { control: 'boolean' }
	}
} satisfies Meta<Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const categoryOptions = [
	{ value: '', label: 'Select a category' },
	{ value: 'fashion', label: 'Fashion' },
	{ value: 'electronics', label: 'Electronics' },
	{ value: 'home', label: 'Home & Decor' },
	{ value: 'sports', label: 'Sports & Outdoors' },
	{ value: 'books', label: 'Books' }
];

export const Default: Story = {
	args: {
		label: 'Category',
		options: categoryOptions
	}
};

export const WithValue: Story = {
	args: {
		label: 'Category',
		value: 'fashion',
		options: categoryOptions
	}
};

export const WithError: Story = {
	args: {
		label: 'Category',
		error: 'Please select a category',
		options: categoryOptions
	}
};

export const Required: Story = {
	args: {
		label: 'Category',
		options: categoryOptions,
		required: true
	}
};

export const Disabled: Story = {
	args: {
		label: 'Category',
		value: 'fashion',
		options: categoryOptions,
		disabled: true
	}
};

export const Countries: Story = {
	args: {
		label: 'Country',
		options: [
			{ value: '', label: 'Select your country' },
			{ value: 'us', label: 'United States' },
			{ value: 'uk', label: 'United Kingdom' },
			{ value: 'ca', label: 'Canada' },
			{ value: 'au', label: 'Australia' },
			{ value: 'de', label: 'Germany' },
			{ value: 'fr', label: 'France' },
			{ value: 'jp', label: 'Japan' }
		]
	}
};

export const Sizes: Story = {
	args: {
		label: 'Size',
		options: [
			{ value: '', label: 'Select size' },
			{ value: 'xs', label: 'Extra Small (XS)' },
			{ value: 's', label: 'Small (S)' },
			{ value: 'm', label: 'Medium (M)' },
			{ value: 'l', label: 'Large (L)' },
			{ value: 'xl', label: 'Extra Large (XL)' },
			{ value: 'xxl', label: '2XL' }
		]
	}
};

export const Conditions: Story = {
	args: {
		label: 'Item Condition',
		options: [
			{ value: '', label: 'Select condition' },
			{ value: 'new', label: 'Brand New' },
			{ value: 'like-new', label: 'Like New' },
			{ value: 'excellent', label: 'Excellent' },
			{ value: 'good', label: 'Good' },
			{ value: 'fair', label: 'Fair' },
			{ value: 'poor', label: 'Poor' }
		],
		required: true
	}
};

export const SortBy: Story = {
	args: {
		label: 'Sort By',
		value: 'recent',
		options: [
			{ value: 'recent', label: 'Most Recent' },
			{ value: 'popular', label: 'Most Popular' },
			{ value: 'price-low', label: 'Price: Low to High' },
			{ value: 'price-high', label: 'Price: High to Low' },
			{ value: 'rating', label: 'Highest Rated' }
		]
	}
};

export const FormExample: Story = {
	render: () => ({
		Component: Select,
		slot: `
			<form style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<Select 
					label="Category" 
					options={${JSON.stringify(categoryOptions)}}
					required
				/>
				<Select 
					label="Condition" 
					options={${JSON.stringify([
						{ value: '', label: 'Select condition' },
						{ value: 'new', label: 'Brand New' },
						{ value: 'like-new', label: 'Like New' },
						{ value: 'good', label: 'Good' }
					])}}
					required
				/>
				<Select 
					label="Size" 
					options={${JSON.stringify([
						{ value: '', label: 'Select size' },
						{ value: 's', label: 'Small' },
						{ value: 'm', label: 'Medium' },
						{ value: 'l', label: 'Large' }
					])}}
				/>
				<button type="submit" style="padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					Continue
				</button>
			</form>
		`
	})
};

export const AllStates: Story = {
	render: () => ({
		Component: Select,
		slot: `
			<div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Default</h3>
					<Select label="Category" options={${JSON.stringify(categoryOptions)}} />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Value</h3>
					<Select label="Category" value="fashion" options={${JSON.stringify(categoryOptions)}} />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Error</h3>
					<Select label="Category" error="Required field" options={${JSON.stringify(categoryOptions)}} />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled</h3>
					<Select label="Category" value="fashion" disabled options={${JSON.stringify(categoryOptions)}} />
				</div>
			</div>
		`
	})
};
