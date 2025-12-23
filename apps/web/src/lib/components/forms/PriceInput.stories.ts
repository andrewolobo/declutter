import type { Meta, StoryObj } from '@storybook/svelte';
import PriceInput from './PriceInput.svelte';

const meta = {
	title: 'Components/Forms/PriceInput',
	component: PriceInput,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		value: { control: 'number' },
		currency: { control: 'text' },
		error: { control: 'text' },
		min: { control: 'number' },
		max: { control: 'number' },
		placeholder: { control: 'text' },
		disabled: { control: 'boolean' },
		required: { control: 'boolean' }
	}
} satisfies Meta<PriceInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Price',
		currency: 'USD'
	}
};

export const WithValue: Story = {
	args: {
		label: 'Product Price',
		value: 49.99,
		currency: 'USD'
	}
};

export const WithError: Story = {
	args: {
		label: 'Price',
		value: 0,
		error: 'Price must be greater than 0',
		currency: 'USD'
	}
};

export const Required: Story = {
	args: {
		label: 'Asking Price',
		currency: 'USD',
		required: true
	}
};

export const Disabled: Story = {
	args: {
		label: 'Price',
		value: 99.99,
		currency: 'USD',
		disabled: true
	}
};

export const WithMinMax: Story = {
	args: {
		label: 'Bid Amount',
		currency: 'USD',
		min: 10,
		max: 1000
	}
};

export const Euro: Story = {
	args: {
		label: 'Price',
		value: 39.9,
		currency: 'EUR'
	}
};

export const GBP: Story = {
	args: {
		label: 'Price',
		value: 29.99,
		currency: 'GBP'
	}
};

export const ProductListing: Story = {
	args: {
		label: 'Listing Price',
		currency: 'USD',
		required: true
	}
};

export const OfferPrice: Story = {
	args: {
		label: 'Your Offer',
		currency: 'USD',
		min: 1
	}
};

export const ShippingCost: Story = {
	args: {
		label: 'Shipping Cost',
		value: 0,
		currency: 'USD',
		min: 0
	}
};

export const FormExample: Story = {
	render: () => ({
		Component: PriceInput,
		slot: `
			<form style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<PriceInput 
					label="Product Price" 
					currency="USD"
					required
					helperText="Set your asking price"
					min={1}
				/>
				<PriceInput 
					label="Shipping Cost" 
					currency="USD"
					helperText="Enter 0 for free shipping"
					min={0}
				/>
				<button type="submit" style="padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					List Product
				</button>
			</form>
		`
	})
};

export const PricingOptions: Story = {
	render: () => ({
		Component: PriceInput,
		slot: `
			<div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<PriceInput 
					label="Original Price" 
					value={129.99}
					currency="USD"
					disabled
					helperText="Retail price"
				/>
				<PriceInput 
					label="Your Price" 
					value={89.99}
					currency="USD"
					required
					helperText="Your selling price"
				/>
				<PriceInput 
					label="Minimum Offer" 
					value={75.00}
					currency="USD"
					helperText="Lowest offer you'll accept"
				/>
			</div>
		`
	})
};

export const AllStates: Story = {
	render: () => ({
		Component: PriceInput,
		slot: `
			<div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Default</h3>
					<PriceInput label="Price" currency="USD" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Value</h3>
					<PriceInput label="Price" value={49.99} currency="USD" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">With Error</h3>
					<PriceInput label="Price" value={0} error="Price required" currency="USD" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled</h3>
					<PriceInput label="Price" value={99.99} currency="USD" disabled />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Different Currency</h3>
					<PriceInput label="Price" value={39.99} currency="EUR" />
				</div>
			</div>
		`
	})
};

export const AllCurrencies: Story = {
	render: () => ({
		Component: PriceInput,
		slot: `
			<div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<PriceInput label="US Dollar" value={49.99} currency="USD" />
				<PriceInput label="Euro" value={39.99} currency="EUR" />
				<PriceInput label="British Pound" value={34.99} currency="GBP" />
				<PriceInput label="Canadian Dollar" value={59.99} currency="CAD" />
				<PriceInput label="Australian Dollar" value={64.99} currency="AUD" />
			</div>
		`
	})
};
