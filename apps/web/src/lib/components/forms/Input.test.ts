import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
// @ts-ignore
import InputTestWrapper from '$tests/InputTestWrapper.svelte';

describe('Input Component', () => {
	describe('Rendering', () => {
		it('renders with default props', () => {
			const { container } = render(InputTestWrapper, { placeholder: 'Enter text' });
			const input = container.querySelector('input');
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('type', 'text');
		});

		it('renders with label', () => {
			render(InputTestWrapper, { label: 'Username' });
			expect(screen.getByText('Username')).toBeInTheDocument();
		});

		it('renders with different input types', () => {
			const { container, rerender } = render(InputTestWrapper, { type: 'email' });
			let input = container.querySelector('input');
			expect(input).toHaveAttribute('type', 'email');

			rerender({ type: 'password' });
			input = container.querySelector('input');
			expect(input).toHaveAttribute('type', 'password');

			rerender({ type: 'tel' });
			input = container.querySelector('input');
			expect(input).toHaveAttribute('type', 'tel');
		});

		it('renders with placeholder', () => {
			const { container } = render(InputTestWrapper, { placeholder: 'Enter email' });
			const input = container.querySelector('input');
			expect(input).toHaveAttribute('placeholder', 'Enter email');
		});

		it('renders with icon on left side', () => {
			const { container } = render(InputTestWrapper, {
				icon: 'search',
				iconPosition: 'left'
			});
			const icon = container.querySelector('[data-testid="icon"]');
			expect(icon).toBeInTheDocument();
			expect(icon).toHaveAttribute('data-icon', 'search');
		});

		it('renders with icon on right side', () => {
			const { container } = render(InputTestWrapper, {
				icon: 'eye',
				iconPosition: 'right'
			});
			const icon = container.querySelector('[data-testid="icon"]');
			expect(icon).toBeInTheDocument();
			expect(icon).toHaveAttribute('data-icon', 'eye');
		});

		it('displays required indicator when required', () => {
			const { container } = render(InputTestWrapper, {
				label: 'Email',
				required: true
			});
			const label = container.querySelector('label.required');
			expect(label).toBeInTheDocument();
		});
	});

	describe('Value Binding', () => {
		it('displays initial value', () => {
			const { container } = render(InputTestWrapper, { value: 'Initial' });
			const input = container.querySelector('input') as HTMLInputElement;
			expect(input.value).toBe('Initial');
		});

		it('updates value on input', async () => {
			const user = userEvent.setup();
			const { container } = render(InputTestWrapper);
			const input = container.querySelector('input') as HTMLInputElement;

			await user.type(input, 'Hello World');
			expect(input.value).toBe('Hello World');
		});

		it('clears value when cleared', async () => {
			const user = userEvent.setup();
			const { container } = render(InputTestWrapper, { value: 'Test' });
			const input = container.querySelector('input') as HTMLInputElement;

			await user.clear(input);
			expect(input.value).toBe('');
		});
	});

	describe('Error State', () => {
		it('displays error message', () => {
			render(InputTestWrapper, { error: 'This field is required' });
			expect(screen.getByText('This field is required')).toBeInTheDocument();
		});

		it('applies error styling', () => {
			const { container } = render(InputTestWrapper, { error: 'Invalid' });
			const inputContainer = container.querySelector('.input-container');
			expect(inputContainer).toHaveClass('error');
		});

		it('shows no error when error prop is undefined', () => {
			const { container } = render(InputTestWrapper);
			const errorElement = container.querySelector('.error-message');
			expect(errorElement).not.toBeInTheDocument();
		});
	});

	describe('Disabled State', () => {
		it('disables input when disabled prop is true', () => {
			const { container } = render(InputTestWrapper, { disabled: true });
			const input = container.querySelector('input');
			expect(input).toBeDisabled();
		});

		it('applies disabled styling', () => {
			const { container } = render(InputTestWrapper, { disabled: true });
			const inputContainer = container.querySelector('.input-container');
			expect(inputContainer).toHaveClass('disabled');
		});

		it('does not accept input when disabled', async () => {
			const user = userEvent.setup();
			const { container } = render(InputTestWrapper, { disabled: true });
			const input = container.querySelector('input') as HTMLInputElement;

			await user.type(input, 'Test');
			expect(input.value).toBe('');
		});
	});

	describe('Focus State', () => {
		it('applies focused class when focused', async () => {
			const user = userEvent.setup();
			const { container } = render(InputTestWrapper);
			const input = container.querySelector('input') as HTMLInputElement;
			const inputContainer = container.querySelector('.input-container');

			await user.click(input);
			expect(inputContainer).toHaveClass('focused');
		});

		it('removes focused class on blur', async () => {
			const user = userEvent.setup();
			const { container } = render(InputTestWrapper);
			const input = container.querySelector('input') as HTMLInputElement;
			const inputContainer = container.querySelector('.input-container');

			await user.click(input);
			expect(inputContainer).toHaveClass('focused');

			await user.tab();
			expect(inputContainer).not.toHaveClass('focused');
		});
	});

	describe('Accessibility', () => {
		it('associates label with input', () => {
			const { container } = render(InputTestWrapper, { label: 'Email Address' });
			const label = screen.getByText('Email Address');
			const input = container.querySelector('input');
			expect(label).toHaveAttribute('for', 'Email Address');
			expect(input).toHaveAttribute('id', 'Email Address');
		});

		it('sets required attribute when required', () => {
			const { container } = render(InputTestWrapper, { required: true });
			const input = container.querySelector('input');
			expect(input).toHaveAttribute('required');
		});

		it('sets autocomplete attribute', () => {
			const { container } = render(InputTestWrapper, { autocomplete: 'email' });
			const input = container.querySelector('input');
			expect(input).toHaveAttribute('autocomplete', 'email');
		});
	});

	describe('Edge Cases', () => {
		it('handles empty string value', () => {
			const { container } = render(InputTestWrapper, { value: '' });
			const input = container.querySelector('input') as HTMLInputElement;
			expect(input.value).toBe('');
		});

		it('handles all props simultaneously', () => {
			const { container } = render(InputTestWrapper, {
				type: 'email',
				label: 'Email',
				placeholder: 'you@example.com',
				value: 'test@test.com',
				error: 'Invalid email',
				icon: 'mail',
				iconPosition: 'left',
				disabled: false,
				required: true,
				autocomplete: 'email'
			});

			const input = container.querySelector('input') as HTMLInputElement;
			expect(input).toBeInTheDocument();
			expect(input.value).toBe('test@test.com');
			expect(input).toHaveAttribute('type', 'email');
			expect(screen.getByText('Invalid email')).toBeInTheDocument();
		});
	});
});
