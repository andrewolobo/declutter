import type { Meta, StoryObj } from '@storybook/svelte';
import Tag from './Tag.svelte';

const meta = {
	title: 'Components/Media/Tag',
	component: Tag,
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'Tag text'
		},
		color: {
			control: 'color',
			description: 'Custom color (hex)'
		},
		icon: {
			control: 'text',
			description: 'Material icon name'
		},
		removable: {
			control: 'boolean',
			description: 'Show remove button'
		}
	}
} satisfies Meta<Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Electronics'
	}
};

export const WithIcon: Story = {
	args: {
		label: 'Featured',
		icon: 'star'
	}
};

export const Removable: Story = {
	args: {
		label: 'Fashion',
		removable: true
	}
};

export const CustomColor: Story = {
	args: {
		label: 'Custom',
		color: '#8b5cf6'
	}
};

export const WithIconAndRemove: Story = {
	args: {
		label: 'Premium',
		icon: 'workspace_premium',
		removable: true,
		color: '#f59e0b'
	}
};

export const Categories: Story = {
	render: () => ({
		Component: Tag,
		slot: `
			<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
				<Tag label="Electronics" icon="devices" />
				<Tag label="Fashion" icon="checkroom" />
				<Tag label="Home & Garden" icon="home" />
				<Tag label="Sports" icon="sports_basketball" />
				<Tag label="Books" icon="menu_book" />
				<Tag label="Automotive" icon="directions_car" />
			</div>
		`
	})
};

export const FilterTags: Story = {
	render: () => ({
		Component: Tag,
		slot: `
			<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
				<Tag label="Kampala" icon="location_on" removable />
				<Tag label="Under 100k" icon="payments" removable />
				<Tag label="New" icon="fiber_new" removable />
				<Tag label="Verified Seller" icon="verified_user" removable />
			</div>
		`
	})
};

export const ColorPalette: Story = {
	render: () => ({
		Component: Tag,
		slot: `
			<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
				<Tag label="Red" color="#ef4444" />
				<Tag label="Orange" color="#f97316" />
				<Tag label="Yellow" color="#eab308" />
				<Tag label="Green" color="#22c55e" />
				<Tag label="Blue" color="#3b82f6" />
				<Tag label="Purple" color="#a855f7" />
				<Tag label="Pink" color="#ec4899" />
			</div>
		`
	})
};
