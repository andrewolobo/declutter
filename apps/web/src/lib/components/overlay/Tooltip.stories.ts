import type { Meta, StoryObj } from '@storybook/svelte';
import Tooltip from './Tooltip.svelte';
import Button from '$lib/components/buttons/Button.svelte';

const meta = {
	title: 'Components/Overlay/Tooltip',
	component: Tooltip,
	tags: ['autodocs'],
	argTypes: {
		content: {
			control: 'text',
			description: 'Tooltip text'
		},
		position: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right'],
			description: 'Tooltip position'
		},
		trigger: {
			control: 'select',
			options: ['hover', 'click', 'focus'],
			description: 'Trigger mode'
		},
		delay: {
			control: 'number',
			description: 'Delay before showing (ms)'
		},
		maxWidth: {
			control: 'text',
			description: 'Maximum width'
		}
	}
} satisfies Meta<Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
	args: {
		content: 'This is a tooltip on top',
		position: 'top',
		children:
			'<button style="padding: 0.5rem 1rem; background: #13ecec; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Hover me</button>'
	}
};

export const Bottom: Story = {
	args: {
		content: 'This tooltip appears at the bottom',
		position: 'bottom',
		children:
			'<button style="padding: 0.5rem 1rem; background: #13ecec; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Hover me</button>'
	}
};

export const Left: Story = {
	args: {
		content: 'Tooltip on the left',
		position: 'left',
		children:
			'<button style="padding: 0.5rem 1rem; background: #13ecec; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Hover me</button>'
	}
};

export const Right: Story = {
	args: {
		content: 'Tooltip on the right side',
		position: 'right',
		children:
			'<button style="padding: 0.5rem 1rem; background: #13ecec; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Hover me</button>'
	}
};

export const ClickTrigger: Story = {
	args: {
		content: 'Click to see this tooltip',
		trigger: 'click',
		children:
			'<button style="padding: 0.5rem 1rem; background: #13ecec; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Click me</button>'
	}
};

export const FocusTrigger: Story = {
	args: {
		content: 'This appears when focused',
		trigger: 'focus',
		children:
			'<input type="text" placeholder="Focus me" style="padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.5rem;" />'
	}
};

export const LongText: Story = {
	args: {
		content:
			'This is a longer tooltip with more information. It wraps to multiple lines when the content exceeds the maximum width.',
		maxWidth: '200px',
		children:
			'<button style="padding: 0.5rem 1rem; background: #13ecec; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Hover for more info</button>'
	}
};

export const CustomDelay: Story = {
	args: {
		content: 'This tooltip has a 1 second delay',
		delay: 1000,
		children:
			'<button style="padding: 0.5rem 1rem; background: #13ecec; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Hover (with delay)</button>'
	}
};

export const IconWithTooltip: Story = {
	args: {
		content: 'Help information',
		position: 'top',
		children:
			'<button style="width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">ⓘ</button>'
	}
};
