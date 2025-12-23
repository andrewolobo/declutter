import type { Meta, StoryObj } from '@storybook/svelte';
import DropdownMenu, { type MenuItem } from './DropdownMenu.svelte';

const meta = {
	title: 'Components/Buttons/DropdownMenu',
	component: DropdownMenu,
	tags: ['autodocs'],
	argTypes: {
		items: {
			control: 'object',
			description: 'Array of menu items'
		},
		align: {
			control: 'select',
			options: ['start', 'end'],
			description: 'Menu alignment'
		}
	}
} satisfies Meta<DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems: MenuItem[] = [
	{ icon: 'edit', label: 'Edit', onClick: () => console.log('Edit clicked') },
	{ icon: 'content_copy', label: 'Duplicate', onClick: () => console.log('Duplicate clicked') },
	{ icon: 'share', label: 'Share', onClick: () => console.log('Share clicked') },
	{ type: 'divider' },
	{ icon: 'delete', label: 'Delete', onClick: () => console.log('Delete clicked'), danger: true }
];

export const Default: Story = {
	args: {
		items: defaultItems
	}
};

export const AlignEnd: Story = {
	args: {
		items: defaultItems,
		align: 'end'
	}
};

export const SimpleMenu: Story = {
	args: {
		items: [
			{ icon: 'visibility', label: 'View', onClick: () => {} },
			{ icon: 'edit', label: 'Edit', onClick: () => {} },
			{ icon: 'archive', label: 'Archive', onClick: () => {} }
		]
	}
};

export const WithDisabledItems: Story = {
	args: {
		items: [
			{ icon: 'edit', label: 'Edit', onClick: () => {}, disabled: false },
			{ icon: 'delete', label: 'Delete (disabled)', onClick: () => {}, disabled: true },
			{ icon: 'share', label: 'Share', onClick: () => {} }
		]
	}
};

export const DangerActions: Story = {
	args: {
		items: [
			{ icon: 'flag', label: 'Report', onClick: () => {}, danger: true },
			{ icon: 'block', label: 'Block User', onClick: () => {}, danger: true },
			{ type: 'divider' },
			{ icon: 'delete', label: 'Delete', onClick: () => {}, danger: true }
		]
	}
};
