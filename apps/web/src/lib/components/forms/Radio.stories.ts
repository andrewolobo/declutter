import type { Meta, StoryObj } from '@storybook/svelte';
import Radio from './Radio.svelte';

const meta = {
	title: 'Components/Forms/Radio',
	component: Radio,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		name: { control: 'text' },
		value: { control: 'text' },
		disabled: { control: 'boolean' },
		error: { control: 'text' },
		required: { control: 'boolean' },
		layout: { control: 'select', options: ['vertical', 'horizontal'] }
	}
} satisfies Meta<Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Option 1',
		name: 'option',
		value: '1'
	}
};

export const Checked: Story = {
	args: {
		label: 'Selected option',
		name: 'option',
		value: '1'
	}
};

export const Disabled: Story = {
	args: {
		label: 'Disabled option',
		name: 'option',
		value: '1',
		disabled: true
	}
};

export const DisabledChecked: Story = {
	args: {
		label: 'Disabled selected',
		name: 'option',
		value: '1',
		disabled: true
	}
};

export const PaymentMethod: Story = {
	args: {
		name: 'payment'
	},
	render: () => ({
		Component: Radio,
		slot: `
			<div style="max-width: 400px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Payment Method</h3>
				<div style="display: flex; flex-direction: column; gap: 0.75rem;">
					<Radio label="Credit Card" name="payment" value="card" checked />
					<Radio label="PayPal" name="payment" value="paypal" />
					<Radio label="Bank Transfer" name="payment" value="bank" />
					<Radio label="Cash on Delivery" name="payment" value="cod" />
				</div>
			</div>
		`
	})
};

export const Shipping: Story = {
	args: {
		name: 'shipping'
	},
	render: () => ({
		Component: Radio,
		slot: `
			<div style="max-width: 400px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Shipping Option</h3>
				<div style="display: flex; flex-direction: column; gap: 0.75rem;">
					<Radio label="Standard Shipping (5-7 days) - Free" name="shipping" value="standard" checked />
					<Radio label="Express Shipping (2-3 days) - $9.99" name="shipping" value="express" />
					<Radio label="Next Day Delivery - $19.99" name="shipping" value="nextday" />
				</div>
			</div>
		`
	})
};

export const ItemCondition: Story = {
	args: {
		name: 'condition'
	},
	render: () => ({
		Component: Radio,
		slot: `
			<div style="max-width: 400px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Item Condition</h3>
				<div style="display: flex; flex-direction: column; gap: 0.75rem;">
					<Radio label="Brand New - Never used, with tags" name="condition" value="new" />
					<Radio label="Like New - Used once or twice" name="condition" value="like-new" checked />
					<Radio label="Good - Minor signs of wear" name="condition" value="good" />
					<Radio label="Fair - Noticeable wear, fully functional" name="condition" value="fair" />
				</div>
			</div>
		`
	})
};

export const SortOptions: Story = {
	args: {
		name: 'sort'
	},
	render: () => ({
		Component: Radio,
		slot: `
			<div style="max-width: 300px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Sort By</h3>
				<div style="display: flex; flex-direction: column; gap: 0.5rem;">
					<Radio label="Most Recent" name="sort" value="recent" checked />
					<Radio label="Most Popular" name="sort" value="popular" />
					<Radio label="Price: Low to High" name="sort" value="price-low" />
					<Radio label="Price: High to Low" name="sort" value="price-high" />
					<Radio label="Highest Rated" name="sort" value="rating" />
				</div>
			</div>
		`
	})
};

export const AccountType: Story = {
	args: {
		name: 'account'
	},
	render: () => ({
		Component: Radio,
		slot: `
			<div style="max-width: 500px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Select Account Type</h3>
				<div style="display: flex; flex-direction: column; gap: 1rem;">
					<Radio label="Personal - For individual buyers and sellers" name="account" value="personal" checked />
					<Radio label="Business - For companies and professional sellers" name="account" value="business" />
					<Radio label="Non-Profit - For charitable organizations" name="account" value="nonprofit" />
				</div>
			</div>
		`
	})
};

export const PrivacySettings: Story = {
	args: {
		name: 'privacy'
	},
	render: () => ({
		Component: Radio,
		slot: `
			<div style="max-width: 400px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Profile Visibility</h3>
				<div style="display: flex; flex-direction: column; gap: 0.75rem;">
					<Radio label="Public - Anyone can see your profile" name="privacy" value="public" checked />
					<Radio label="Friends Only - Only your connections" name="privacy" value="friends" />
					<Radio label="Private - Only you" name="privacy" value="private" />
				</div>
			</div>
		`
	})
};

export const HorizontalLayout: Story = {
	args: {
		name: 'size'
	},
	render: () => ({
		Component: Radio,
		slot: `
			<div style="max-width: 600px;">
				<h3 style="margin-bottom: 1rem; font-weight: 600;">Size</h3>
				<div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
					<Radio label="XS" name="size" value="xs" />
					<Radio label="S" name="size" value="s" />
					<Radio label="M" name="size" value="m" checked />
					<Radio label="L" name="size" value="l" />
					<Radio label="XL" name="size" value="xl" />
					<Radio label="XXL" name="size" value="xxl" />
				</div>
			</div>
		`
	})
};

export const FormExample: Story = {
	args: {
		name: 'delivery'
	},
	render: () => ({
		Component: Radio,
		slot: `
			<form style="max-width: 500px; display: flex; flex-direction: column; gap: 2rem;">
				<div>
					<h3 style="margin-bottom: 1rem; font-weight: 600;">Delivery Method *</h3>
					<div style="display: flex; flex-direction: column; gap: 0.75rem;">
						<Radio label="Meet in person" name="delivery" value="meetup" checked />
						<Radio label="Ship to address" name="delivery" value="shipping" />
					</div>
				</div>
				<div>
					<h3 style="margin-bottom: 1rem; font-weight: 600;">Payment Preference *</h3>
					<div style="display: flex; flex-direction: column; gap: 0.75rem;">
						<Radio label="Cash" name="payment" value="cash" checked />
						<Radio label="Online Payment" name="payment" value="online" />
					</div>
				</div>
				<button type="submit" style="padding: 0.75rem; background: #3b82f6; color: white; border-radius: 0.5rem; font-weight: 600;">
					Continue
				</button>
			</form>
		`
	})
};

export const AllStates: Story = {
	args: {
		name: 'state'
	},
	render: () => ({
		Component: Radio,
		slot: `
			<div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;">
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Unchecked</h3>
					<Radio label="Unchecked option" name="state1" value="1" />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Checked</h3>
					<Radio label="Checked option" name="state2" value="1" checked />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled</h3>
					<Radio label="Disabled option" name="state3" value="1" disabled />
				</div>
				<div>
					<h3 style="margin-bottom: 0.5rem; font-weight: 600;">Disabled & Checked</h3>
					<Radio label="Disabled checked option" name="state4" value="1" checked disabled />
				</div>
			</div>
		`
	})
};
