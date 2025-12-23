import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
// @ts-ignore
import ButtonTestWrapper from '$tests/ButtonTestWrapper.svelte';

describe('Button Component', () => {
	describe('Rendering', () => {
		it('renders with default props', () => {
			const { getByRole } = render(ButtonTestWrapper, { content: 'Click me' });
			const button = getByRole('button');
			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent('Click me');
		});

		it('applies primary variant classes by default', () => {
			const { getByRole } = render(ButtonTestWrapper, { content: 'Primary' });
			const button = getByRole('button');
			expect(button).toHaveClass('bg-primary');
		});

		it('applies secondary variant classes', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				variant: 'secondary',
				content: 'Secondary'
			});
			expect(getByRole('button')).toHaveClass('bg-white');
		});

		it('applies ghost variant classes', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				variant: 'ghost',
				content: 'Ghost'
			});
			expect(getByRole('button')).toHaveClass('bg-transparent');
		});

		it('applies danger variant classes', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				variant: 'danger',
				content: 'Delete'
			});
			expect(getByRole('button')).toHaveClass('bg-red-500');
		});

		it('applies small size classes', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				size: 'sm',
				content: 'Small'
			});
			expect(getByRole('button')).toHaveClass('h-8', 'px-3', 'text-sm');
		});

		it('applies medium size classes by default', () => {
			const { getByRole } = render(ButtonTestWrapper, { content: 'Medium' });
			expect(getByRole('button')).toHaveClass('h-10', 'px-4', 'text-base');
		});

		it('applies large size classes', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				size: 'lg',
				content: 'Large'
			});
			expect(getByRole('button')).toHaveClass('h-12', 'px-6', 'text-lg');
		});

		it('renders with icon on left side', () => {
			const { container } = render(ButtonTestWrapper, {
				icon: 'plus',
				content: 'Add Item'
			});
		const icon = container.querySelector('[data-testid="icon"]');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute('data-icon', 'plus');
				iconPosition: 'right',
				content: 'Next'
			});
		const icon = container.querySelector('[data-testid="icon"]');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute('data-icon', 'arrow-right');
			});
			expect(getByRole('button')).toHaveClass('w-full');
		});

		it('applies custom class names', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				class: 'custom-class',
				content: 'Custom'
			});
			expect(getByRole('button')).toHaveClass('custom-class');
		});

		it('sets correct button type attribute', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				type: 'submit',
				content: 'Submit'
			});
			expect(getByRole('button')).toHaveAttribute('type', 'submit');
		});

		it('defaults to button type', () => {
			const { getByRole } = render(ButtonTestWrapper, { content: 'Default Type' });
			expect(getByRole('button')).toHaveAttribute('type', 'button');
		});
	});

	describe('Loading State', () => {
		it('displays loading spinner when loading', () => {
			const { container } = render(ButtonTestWrapper, {
				loading: true,
				content: 'Submit'
			});
			const spinner = container.querySelector('.animate-spin');
			expect(spinner).toBeInTheDocument();
		});

		it('shows Loading... text when loading', () => {
			render(ButtonTestWrapper, {
				loading: true,
				content: 'Submit'
			});
			expect(screen.getByText('Loading...')).toBeInTheDocument();
		});

		it('disables button when loading', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				loading: true,
				content: 'Submit'
			});
			expect(getByRole('button')).toBeDisabled();
		});

		it('hides children content when loading', () => {
			const { queryByText } = render(ButtonTestWrapper, {
				loading: true,
				content: 'Submit Form'
			});
			expect(queryByText('Submit Form')).not.toBeInTheDocument();
		});

		it('hides icon when loading', () => {
			const { container } = render(ButtonTestWrapper, {
				loading: true,
				icon: 'plus',
				content: 'Add'
			});
			// Should only have spinner SVG, not icon SVG
			const svgs = container.querySelectorAll('svg');
			expect(svgs.length).toBe(1); // Only spinner
		});
	});

	describe('Disabled State', () => {
		it('disables button when disabled prop is true', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				disabled: true,
				content: 'Disabled'
			});
			expect(getByRole('button')).toBeDisabled();
		});

		it('applies disabled opacity class', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				disabled: true,
				content: 'Disabled'
			});
			expect(getByRole('button')).toHaveClass('disabled:opacity-50');
		});

		it('applies disabled cursor class', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				disabled: true,
				content: 'Disabled'
			});
			expect(getByRole('button')).toHaveClass('disabled:cursor-not-allowed');
		});
	});

	describe('Interactions', () => {
		it('calls onclick handler when clicked', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			const { getByRole } = render(ButtonTestWrapper, {
				onclick: handleClick,
				content: 'Click me'
			});

			await user.click(getByRole('button'));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('does not call onclick when disabled', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			const { getByRole } = render(ButtonTestWrapper, {
				onclick: handleClick,
				disabled: true,
				content: 'Disabled'
			});

			await user.click(getByRole('button'));
			expect(handleClick).not.toHaveBeenCalled();
		});

		it('does not call onclick when loading', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			const { getByRole } = render(ButtonTestWrapper, {
				onclick: handleClick,
				loading: true,
				content: 'Loading'
			});

			await user.click(getByRole('button'));
			expect(handleClick).not.toHaveBeenCalled();
		});

		it('handles multiple clicks correctly', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			const { getByRole } = render(ButtonTestWrapper, {
				onclick: handleClick,
				content: 'Click Multiple Times'
			});

			const button = getByRole('button');
			await user.click(button);
			await user.click(button);
			await user.click(button);
			expect(handleClick).toHaveBeenCalledTimes(3);
		});
	});

	describe('Accessibility', () => {
		it('is keyboard accessible', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			const { getByRole } = render(ButtonTestWrapper, {
				onclick: handleClick,
				content: 'Keyboard'
			});

			const button = getByRole('button');
			button.focus();
			expect(button).toHaveFocus();

			await user.keyboard('{Enter}');
			expect(handleClick).toHaveBeenCalled();
		});

		it('responds to spacebar key', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			const { getByRole } = render(ButtonTestWrapper, {
				onclick: handleClick,
				content: 'Spacebar'
			});

			const button = getByRole('button');
			button.focus();
			await user.keyboard(' ');
			expect(handleClick).toHaveBeenCalled();
		});

		it('has correct role', () => {
			const { getByRole } = render(ButtonTestWrapper, { content: 'Button' });
			expect(getByRole('button')).toBeInTheDocument();
		});

		it('is not focusable when disabled', () => {
			const { getByRole } = render(ButtonTestWrapper, {
				disabled: true,
				content: 'Not Focusable'
			});
			const button = getByRole('button');
			expect(button).toBeDisabled();
			expect(button).toHaveAttribute('disabled');
		});

		it('has proper transition classes for animations', () => {
			const { getByRole } = render(ButtonTestWrapper, { content: 'Animated' });
			expect(getByRole('button')).toHaveClass('transition-all', 'duration-200');
		});

		it('has active state scaling', () => {
			const { getByRole } = render(ButtonTestWrapper, { content: 'Active Scale' });
			expect(getByRole('button')).toHaveClass('active:scale-95');
		});
	});

	describe('Edge Cases', () => {
		it('handles empty children', () => {
			const { getByRole } = render(ButtonTestWrapper, { content: '' });
			expect(getByRole('button')).toBeInTheDocument();
		});

		it('renders without onclick handler', () => {
			const { getByRole } = render(ButtonTestWrapper, { content: 'No Handler' });
			expect(getByRole('button')).toBeInTheDocument();
		});

		it('handles all props simultaneously', () => {
			const handleClick = vi.fn();
			const { getByRole } = render(ButtonTestWrapper, {
				variant: 'danger',
				size: 'lg',
				icon: 'trash',
				iconPosition: 'left',
				fullWidth: true,
				type: 'button',
				onclick: handleClick,
				class: 'extra-class',
				content: 'Complex Button'
			});

			const button = getByRole('button');
			expect(button).toBeInTheDocument();
			expect(button).toHaveClass('bg-red-500', 'h-12', 'w-full', 'extra-class');
		});
	});
});
