import type { Meta, StoryObj } from '@storybook/svelte';
import StatCard from './StatCard.svelte';

const meta = {
	title: 'Components/Cards/StatCard',
	component: StatCard,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		value: { control: 'text' },
		change: { control: 'number' },
		icon: { control: 'text' }
	}
} satisfies Meta<StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Total Sales',
		value: '$12,345',
		icon: 'trending-up'
	}
};

export const WithPositiveChange: Story = {
	args: {
		label: 'Revenue',
		value: '$54,321',
		change: 12.5,
		icon: 'dollar-sign'
	}
};

export const WithNegativeChange: Story = {
	args: {
		label: 'Orders',
		value: '234',
		change: -5.2,
		icon: 'shopping-bag'
	}
};

export const Users: Story = {
	args: {
		label: 'Active Users',
		value: '1,247',
		change: 8.3,
		icon: 'users'
	}
};

export const Products: Story = {
	args: {
		label: 'Products Listed',
		value: '3,456',
		change: 15.7,
		icon: 'package'
	}
};

export const Messages: Story = {
	args: {
		label: 'Messages',
		value: '89',
		change: 23.1,
		icon: 'message-circle'
	}
};

export const WithoutChange: Story = {
	args: {
		label: 'Total Categories',
		value: '12',
		icon: 'tag'
	}
};

export const LargeNumbers: Story = {
	args: {
		label: 'Total Views',
		value: '1.2M',
		change: 34.5,
		icon: 'eye'
	}
};

export const DashboardGrid: Story = {
	render: () => ({
		Component: StatCard,
		slot: `
			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; max-width: 1200px;">
				<StatCard label="Total Revenue" value="$124,352" change={12.5} icon="dollar-sign" />
				<StatCard label="Active Users" value="2,547" change={8.3} icon="users" />
				<StatCard label="Products Sold" value="1,234" change={-3.2} icon="shopping-bag" />
				<StatCard label="Average Rating" value="4.8/5" change={2.1} icon="star" />
			</div>
		`
	})
};

export const CompactList: Story = {
	render: () => ({
		Component: StatCard,
		slot: `
			<div style="max-width: 300px; display: flex; flex-direction: column; gap: 0.75rem;">
				<StatCard label="Today's Sales" value="$1,234" change={15.2} icon="trending-up" />
				<StatCard label="New Orders" value="45" change={8.5} icon="shopping-cart" />
				<StatCard label="Messages" value="12" change={-20.0} icon="message-circle" />
				<StatCard label="Reviews" value="8" change={33.3} icon="star" />
			</div>
		`
	})
};

export const AllIcons: Story = {
	render: () => ({
		Component: StatCard,
		slot: `
			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; max-width: 1000px;">
				<StatCard label="Trending" value="123" icon="trending-up" />
				<StatCard label="Money" value="$456" icon="dollar-sign" />
				<StatCard label="Shopping" value="789" icon="shopping-bag" />
				<StatCard label="Users" value="1.2K" icon="users" />
				<StatCard label="Products" value="345" icon="package" />
				<StatCard label="Messages" value="67" icon="message-circle" />
				<StatCard label="Tags" value="12" icon="tag" />
				<StatCard label="Views" value="8.9K" icon="eye" />
				<StatCard label="Cart" value="23" icon="shopping-cart" />
				<StatCard label="Rating" value="4.5" icon="star" />
			</div>
		`
	})
};
