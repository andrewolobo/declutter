import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
// @ts-ignore
import IconButtonTestWrapper from '$tests/IconButtonTestWrapper.svelte';

describe('IconButton Component', () => {
	describe('Rendering', () => {
		it('renders with required props', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'heart',
				ariaLabel: 'Like'
			});
			const button = getByRole('button', { name: 'Like' });
			expect(button).toBeInTheDocument();
		});

		it('renders icon element', () => {
			const { container } = render(IconButtonTestWrapper, {
				icon: 'star',
				ariaLabel: 'Favorite'
			});
			const icon = container.querySelector('[data-testid="icon"]');
			expect(icon).toBeInTheDocument();
			expect(icon).toHaveAttribute('data-icon', 'star');
		});

		it('applies default variant classes', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'menu',
				ariaLabel: 'Menu'
			});
			expect(getByRole('button')).toHaveClass('text-slate-900');
		});

		it('applies primary variant classes', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'check',
				ariaLabel: 'Confirm',
				variant: 'primary'
			});
			expect(getByRole('button')).toHaveClass('text-primary');
		});

		it('applies danger variant classes', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'trash',
				ariaLabel: 'Delete',
				variant: 'danger'
			});
			expect(getByRole('button')).toHaveClass('text-red-500');
		});

		it('applies small size classes', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'x',
				ariaLabel: 'Close',
				size: 'sm'
			});
			expect(getByRole('button')).toHaveClass('size-8');
		});

		it('applies medium size classes by default', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'bell',
				ariaLabel: 'Notifications'
			});
			expect(getByRole('button')).toHaveClass('size-10');
		});

		it('applies large size classes', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'settings',
				ariaLabel: 'Settings',
				size: 'lg'
			});
			expect(getByRole('button')).toHaveClass('size-12');
		});

		it('applies custom class names', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'edit',
				ariaLabel: 'Edit',
				class: 'custom-class'
			});
			expect(getByRole('button')).toHaveClass('custom-class');
		});

		it('has rounded-full class', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'user',
				ariaLabel: 'Profile'
			});
			expect(getByRole('button')).toHaveClass('rounded-full');
		});
	});

	describe('Badge Display', () => {
		it('renders badge with boolean true', () => {
			const { container } = render(IconButtonTestWrapper, {
				icon: 'bell',
				ariaLabel: 'Notifications',
				badge: true
			});
			const badge = container.querySelector('.bg-red-500');
			expect(badge).toBeInTheDocument();
		});

		it('renders badge with numeric value', () => {
			const { container } = render(IconButtonTestWrapper, {
				icon: 'bell',
				ariaLabel: 'Notifications',
				badge: 5
			});
			const badge = container.querySelector('.bg-red-500');
			expect(badge).toBeInTheDocument();
			expect(badge).toHaveTextContent('5');
		});

		it('displays badge count correctly', () => {
			render(IconButtonTestWrapper, {
				icon: 'message',
				ariaLabel: 'Messages',
				badge: 42
			});
			expect(screen.getByText('42')).toBeInTheDocument();
		});

		it('does not render badge when undefined', () => {
			const { container } = render(IconButtonTestWrapper, {
				icon: 'heart',
				ariaLabel: 'Like'
			});
			const badge = container.querySelector('.bg-red-500');
			expect(badge).not.toBeInTheDocument();
		});

		it('does not render badge when false', () => {
			const { container } = render(IconButtonTestWrapper, {
				icon: 'heart',
				ariaLabel: 'Like',
				badge: false
			});
			const badge = container.querySelector('.bg-red-500');
			expect(badge).not.toBeInTheDocument();
		});

		it('positions badge absolutely', () => {
			const { container } = render(IconButtonTestWrapper, {
				icon: 'bell',
				ariaLabel: 'Notifications',
				badge: 3
			});
			const badge = container.querySelector('.bg-red-500');
			expect(badge).toHaveClass('absolute', '-top-1', '-right-1');
		});

		it('applies correct badge size for small button', () => {
			const { container } = render(IconButtonTestWrapper, {
				icon: 'bell',
				ariaLabel: 'Notifications',
				size: 'sm',
				badge: 1
			});
			const badge = container.querySelector('.bg-red-500');
			expect(badge).toHaveClass('min-w-[14px]', 'h-[14px]');
		});

		it('applies correct badge size for medium button', () => {
			const { container } = render(IconButtonTestWrapper, {
				icon: 'bell',
				ariaLabel: 'Notifications',
				size: 'md',
				badge: 2
			});
			const badge = container.querySelector('.bg-red-500');
			expect(badge).toHaveClass('min-w-[16px]', 'h-[16px]');
		});

		it('applies correct badge size for large button', () => {
			const { container } = render(IconButtonTestWrapper, {
				icon: 'bell',
				ariaLabel: 'Notifications',
				size: 'lg',
				badge: 3
			});
			const badge = container.querySelector('.bg-red-500');
			expect(badge).toHaveClass('min-w-[18px]', 'h-[18px]');
		});
	});

	describe('Disabled State', () => {
		it('disables button when disabled prop is true', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'lock',
				ariaLabel: 'Locked',
				disabled: true
			});
			expect(getByRole('button')).toBeDisabled();
		});

		it('applies disabled opacity class', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'lock',
				ariaLabel: 'Locked',
				disabled: true
			});
			expect(getByRole('button')).toHaveClass('disabled:opacity-50');
		});

		it('applies disabled cursor class', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'lock',
				ariaLabel: 'Locked',
				disabled: true
			});
			expect(getByRole('button')).toHaveClass('disabled:cursor-not-allowed');
		});
	});

	describe('Interactions', () => {
		it('calls onclick handler when clicked', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'plus',
				ariaLabel: 'Add',
				onclick: handleClick
			});

			await user.click(getByRole('button'));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('does not call onclick when disabled', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'plus',
				ariaLabel: 'Add',
				onclick: handleClick,
				disabled: true
			});

			await user.click(getByRole('button'));
			expect(handleClick).not.toHaveBeenCalled();
		});

		it('handles multiple clicks', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'refresh',
				ariaLabel: 'Refresh',
				onclick: handleClick
			});

			const button = getByRole('button');
			await user.click(button);
			await user.click(button);
			await user.click(button);
			expect(handleClick).toHaveBeenCalledTimes(3);
		});

		it('renders without onclick handler', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'info',
				ariaLabel: 'Information'
			});
			expect(getByRole('button')).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('has correct aria-label', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'download',
				ariaLabel: 'Download file'
			});
			const button = getByRole('button', { name: 'Download file' });
			expect(button).toBeInTheDocument();
			expect(button).toHaveAttribute('aria-label', 'Download file');
		});

		it('is keyboard accessible', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'save',
				ariaLabel: 'Save',
				onclick: handleClick
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

			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'copy',
				ariaLabel: 'Copy',
				onclick: handleClick
			});

			const button = getByRole('button');
			button.focus();
			await user.keyboard(' ');
			expect(handleClick).toHaveBeenCalled();
		});

		it('has correct button role', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'search',
				ariaLabel: 'Search'
			});
			expect(getByRole('button')).toBeInTheDocument();
		});

		it('has button type attribute', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'filter',
				ariaLabel: 'Filter'
			});
			expect(getByRole('button')).toHaveAttribute('type', 'button');
		});

		it('is not focusable when disabled', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'ban',
				ariaLabel: 'Disabled',
				disabled: true
			});
			const button = getByRole('button');
			expect(button).toBeDisabled();
			expect(button).toHaveAttribute('disabled');
		});

		it('has transition classes for smooth animations', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'star',
				ariaLabel: 'Star'
			});
			expect(getByRole('button')).toHaveClass('transition-all', 'duration-200');
		});

		it('has active state scaling', () => {
			const { getByRole } = render(IconButtonTestWrapper, {
				icon: 'thumbs-up',
				ariaLabel: 'Like'
			});
			expect(getByRole('button')).toHaveClass('active:scale-95');
		});
	});

	describe('Edge Cases', () => {
		it('handles all props simultaneously', () => {
			const handleClick = vi.fn();
			const { getByRole, container } = render(IconButtonTestWrapper, {
				icon: 'bell',
				ariaLabel: 'Notifications with badge',
				size: 'lg',
				variant: 'primary',
				badge: 99,
				class: 'extra-class',
				onclick: handleClick
			});

			const button = getByRole('button');
			expect(button).toBeInTheDocument();
			expect(button).toHaveClass('size-12', 'text-primary', 'extra-class');
			expect(screen.getByText('99')).toBeInTheDocument();
		});

		it('handles zero badge count', () => {
			const { container } = render(IconButtonTestWrapper, {
				icon: 'message',
				ariaLabel: 'Messages',
				badge: 0
			});
			// Badge should NOT render with 0 (0 is falsy)
			const badge = container.querySelector('.bg-red-500');
			expect(badge).not.toBeInTheDocument();
		});
	});
});
