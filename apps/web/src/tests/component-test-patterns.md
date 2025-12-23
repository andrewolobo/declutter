# Component Test Patterns

This guide provides standardized testing patterns for UI components to ensure consistency, maintainability, and comprehensive coverage.

## Test Structure

All component tests should follow the AAA (Arrange-Act-Assert) pattern:

```typescript
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComponentName from './ComponentName.svelte';

describe('ComponentName', () => {
	beforeEach(() => {
		// Clean up any state, clear mocks, reset DOM
	});

	it('should describe what the test validates', () => {
		// Arrange: Set up test data and render component
		// Act: Perform user interactions or state changes
		// Assert: Verify expected outcomes
	});
});
```

## Testing Categories

### 1. Rendering Tests

Verify component renders correctly with various props:

```typescript
describe('Button - Rendering', () => {
	it('renders with default props', () => {
		const { getByRole } = render(Button, { children: 'Click me' });
		const button = getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Click me');
	});

	it('applies variant classes correctly', () => {
		const { getByRole } = render(Button, {
			variant: 'primary',
			children: 'Primary'
		});
		expect(getByRole('button')).toHaveClass('bg-primary');
	});

	it('renders with icon when provided', () => {
		const { container } = render(Button, {
			icon: 'plus',
			children: 'Add'
		});
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('renders loading state correctly', () => {
		const { getByRole } = render(Button, {
			loading: true,
			children: 'Submit'
		});
		expect(getByRole('button')).toBeDisabled();
		expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
	});
});
```

### 2. Interaction Tests

Test user interactions and event handlers:

```typescript
describe('Button - Interactions', () => {
	it('calls onclick handler when clicked', async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		const { getByRole } = render(Button, {
			onclick: handleClick,
			children: 'Click me'
		});

		await user.click(getByRole('button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onclick when disabled', async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		const { getByRole } = render(Button, {
			onclick: handleClick,
			disabled: true,
			children: 'Disabled'
		});

		await user.click(getByRole('button'));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('handles keyboard interactions', async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		const { getByRole } = render(Button, {
			onclick: handleClick,
			children: 'Press Enter'
		});

		const button = getByRole('button');
		button.focus();
		await user.keyboard('{Enter}');
		expect(handleClick).toHaveBeenCalled();
	});
});
```

### 3. Form Input Tests

Special patterns for form components:

```typescript
describe('Input - Form Behavior', () => {
	it('updates value on user input', async () => {
		const user = userEvent.setup();
		let value = '';

		const { getByLabelText } = render(Input, {
			label: 'Email',
			value,
			onchange: (e) => {
				value = e.target.value;
			}
		});

		const input = getByLabelText('Email');
		await user.type(input, 'test@example.com');
		expect(value).toBe('test@example.com');
	});

	it('displays error message when error prop is provided', () => {
		const { getByText } = render(Input, {
			label: 'Username',
			error: 'Username is required'
		});

		expect(getByText('Username is required')).toBeInTheDocument();
	});

	it('associates label with input correctly', () => {
		const { getByLabelText } = render(Input, {
			label: 'Password'
		});

		const input = getByLabelText('Password');
		expect(input).toHaveAttribute('type', 'password');
	});

	it('validates required field', () => {
		const { getByLabelText } = render(Input, {
			label: 'Email',
			required: true
		});

		const input = getByLabelText('Email');
		expect(input).toHaveAttribute('required');
		expect(input).toBeInvalid(); // Empty required field
	});
});
```

### 4. Accessibility Tests

Ensure components meet WCAG standards:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Button - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = render(Button, { children: 'Accessible Button' });
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('has correct ARIA attributes', () => {
		const { getByRole } = render(Button, {
			'aria-label': 'Close dialog',
			children: 'X'
		});

		expect(getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
	});

	it('is keyboard navigable', async () => {
		const user = userEvent.setup();
		const { getByRole } = render(Button, { children: 'Tab to me' });

		await user.tab();
		expect(getByRole('button')).toHaveFocus();
	});
});
```

### 5. Async Behavior Tests

Handle loading states and async operations:

```typescript
describe('SearchBar - Async Behavior', () => {
	it('shows loading state during search', async () => {
		const user = userEvent.setup();
		const handleSearch = vi.fn().mockResolvedValue({ results: [] });

		const { getByPlaceholderText, getByTestId } = render(SearchBar, {
			onSearch: handleSearch
		});

		const input = getByPlaceholderText('Search...');
		await user.type(input, 'query');

		expect(getByTestId('loading-spinner')).toBeInTheDocument();

		await vi.waitFor(() => {
			expect(handleSearch).toHaveBeenCalledWith('query');
		});
	});

	it('debounces search input', async () => {
		const user = userEvent.setup();
		const handleSearch = vi.fn();

		const { getByPlaceholderText } = render(SearchBar, {
			onSearch: handleSearch,
			debounce: 300
		});

		await user.type(getByPlaceholderText('Search...'), 'test');

		// Should not call immediately
		expect(handleSearch).not.toHaveBeenCalled();

		// Should call after debounce period
		await vi.waitFor(
			() => {
				expect(handleSearch).toHaveBeenCalledTimes(1);
			},
			{ timeout: 500 }
		);
	});
});
```

### 6. Complex Component Tests

Patterns for modals, dropdowns, and overlays:

```typescript
describe('Modal - Complex Interactions', () => {
	it('traps focus within modal when open', async () => {
		const user = userEvent.setup();

		const { getByRole, getByText } = render(Modal, {
			isOpen: true,
			children: `
        <button>First</button>
        <button>Second</button>
      `
		});

		const firstButton = getByText('First');
		const secondButton = getByText('Second');

		firstButton.focus();
		await user.tab();
		expect(secondButton).toHaveFocus();

		await user.tab();
		expect(firstButton).toHaveFocus(); // Loops back
	});

	it('closes on Escape key press', async () => {
		const user = userEvent.setup();
		const handleClose = vi.fn();

		render(Modal, {
			isOpen: true,
			onClose: handleClose
		});

		await user.keyboard('{Escape}');
		expect(handleClose).toHaveBeenCalled();
	});

	it('closes on backdrop click', async () => {
		const user = userEvent.setup();
		const handleClose = vi.fn();

		const { container } = render(Modal, {
			isOpen: true,
			onClose: handleClose
		});

		const backdrop = container.querySelector('[data-backdrop]');
		await user.click(backdrop);
		expect(handleClose).toHaveBeenCalled();
	});
});
```

### 7. Snapshot Tests (Use Sparingly)

For components with complex markup:

```typescript
describe('PostCard - Snapshots', () => {
	it('matches snapshot for default state', () => {
		const { container } = render(PostCard, {
			post: {
				id: '1',
				title: 'Test Post',
				content: 'Content',
				author: { name: 'John', avatar: 'url' }
			}
		});

		expect(container.firstChild).toMatchSnapshot();
	});
});
```

## Common Test Utilities

### Custom Render Function

```typescript
// src/tests/render-utils.ts
import { render as testingLibraryRender } from '@testing-library/svelte';
import type { SvelteComponent } from 'svelte';

export function renderWithProviders(Component: typeof SvelteComponent, props = {}) {
	// Add providers, contexts, or wrappers here
	return testingLibraryRender(Component, props);
}
```

### Mock Data Helpers

```typescript
import { createMockUser, createMockPost } from '$tests/mockData/factories';

const mockUser = createMockUser({ name: 'Test User' });
const mockPost = createMockPost({ authorId: mockUser.id });
```

### Waiting for Conditions

```typescript
import { waitFor } from '@testing-library/svelte';

await waitFor(
	() => {
		expect(screen.getByText('Loaded')).toBeInTheDocument();
	},
	{ timeout: 2000 }
);
```

## Coverage Goals

Each component test file should aim for:

- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 75%+
- **Statements**: 80%+

Focus on:

1. All user-facing interactions
2. All props and variants
3. Error states and edge cases
4. Accessibility requirements
5. Keyboard navigation
6. Loading/async states

## Test File Naming

- Component: `Button.svelte`
- Test file: `Button.test.ts`
- Location: Same directory as component

## Running Tests

```bash
# Watch mode
npm run test

# Single run
npm run test:run

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

## Best Practices

1. **Test user behavior, not implementation** - Focus on what users see and do
2. **Use semantic queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Avoid testing library internals** - Don't test Svelte reactivity, test outcomes
4. **Keep tests independent** - Each test should work in isolation
5. **Use descriptive test names** - Should read like documentation
6. **Mock external dependencies** - Use MSW for API calls, mock stores/services
7. **Test accessibility** - Every interactive component needs a11y tests
8. **Don't over-test** - Skip trivial rendering tests for simple components

## Resources

- [Testing Library Documentation](https://testing-library.com/docs/svelte-testing-library/intro)
- [Vitest Documentation](https://vitest.dev/)
- [Accessibility Testing Guide](https://www.w3.org/WAI/test-evaluate/)
- [Project Test Utils](./utils.ts)
- [Mock Data Factories](./mockData/factories.ts)
