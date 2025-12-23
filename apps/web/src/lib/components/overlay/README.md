# Overlay & Modal Components

A collection of overlay and modal components for dialogs, notifications, and contextual UI elements.

## Components

### Modal

Overlay dialog for focused content with customizable sizes and slots.

**Props:**

- `open: boolean` - Control modal visibility (bindable)
- `title?: string` - Modal title
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Modal width (default: 'md')
- `closeOnClickOutside?: boolean` - Close when clicking backdrop (default: true)
- `closeButton?: boolean` - Show close button (default: true)
- `onClose: () => void` - Close callback (required)

**Snippets:**

- `children` - Main content (default slot)
- `header` - Custom header (overrides title)
- `footer` - Footer actions

**Features:**

- Backdrop with blur effect
- Keyboard support (Escape to close, Enter on focused elements)
- Body scroll lock when open
- Focus trap
- Smooth fade + scale animation
- Multiple size presets
- Accessible with ARIA attributes

**Example:**

```svelte
<script>
	import { Modal } from '$lib/components/overlay';

	let showModal = $state(false);
</script>

<!-- Basic modal with title -->
<Modal bind:open={showModal} title="Edit Profile" onClose={() => console.log('Closed')}>
	<p>Modal content goes here...</p>

	{#snippet footer()}
		<button onclick={() => (showModal = false)}>Cancel</button>
		<button onclick={handleSave}>Save</button>
	{/snippet}
</Modal>

<!-- Custom header and size -->
<Modal bind:open={showModal} size="lg" onClose={() => (showModal = false)}>
	{#snippet header()}
		<div class="flex items-center gap-2">
			<Icon name="image" />
			<h2>Image Gallery</h2>
		</div>
	{/snippet}

	<!-- Content -->
	<div class="grid grid-cols-3 gap-4">
		<!-- Images -->
	</div>
</Modal>
```

---

### Drawer

Slide-in panel from screen edges for navigation, filters, or supplementary content.

**Props:**

- `open: boolean` - Control drawer visibility (bindable)
- `position?: 'left' | 'right' | 'bottom'` - Slide direction (default: 'right')
- `size?: string` - Custom size (e.g., '400px', '80%')
- `closeOnClickOutside?: boolean` - Close when clicking backdrop (default: true)
- `onClose: () => void` - Close callback (required)

**Features:**

- Smooth slide-in animation
- Backdrop with blur effect
- Body scroll lock
- Keyboard support (Escape to close)
- Sticky close button
- Auto-scrolling content area
- Mobile responsive

**Default Sizes:**

- Left/Right: 320px
- Bottom: 70vh

**Example:**

```svelte
<script>
	import { Drawer } from '$lib/components/overlay';

	let showFilters = $state(false);
	let showMenu = $state(false);
</script>

<!-- Filters drawer (right) -->
<Drawer bind:open={showFilters} onClose={() => (showFilters = false)}>
	<h2 class="text-xl font-bold mb-4">Filters</h2>
	<!-- Filter options -->
</Drawer>

<!-- Mobile menu (left) -->
<Drawer bind:open={showMenu} position="left" onClose={() => (showMenu = false)}>
	<nav>
		<a href="/">Home</a>
		<a href="/browse">Browse</a>
		<a href="/messages">Messages</a>
	</nav>
</Drawer>

<!-- Bottom sheet (mobile) -->
<Drawer bind:open={showSheet} position="bottom" size="60vh" onClose={() => (showSheet = false)}>
	<!-- Bottom sheet content -->
</Drawer>
```

---

### Toast

Temporary notification message with auto-dismiss and action support.

**Props:**

- `message: string` - Notification text (required)
- `variant?: 'success' | 'error' | 'warning' | 'info'` - Visual style (default: 'info')
- `duration?: number` - Auto-dismiss time in ms (default: 5000, 0 = no auto-dismiss)
- `action?: { label: string; onClick: () => void }` - Optional action button
- `onClose?: () => void` - Close callback

**Features:**

- Auto-dismiss with configurable duration
- Pause timer on hover
- Icon based on variant
- Action button support
- Manual close button
- Slide-in animation from right
- Color-coded by variant
- Accessible with ARIA live region

**Example:**

```svelte
<script>
	import { Toast } from '$lib/components/overlay';

	let toasts = $state([]);

	function showToast(message, variant = 'info') {
		const id = Date.now();
		toasts = [...toasts, { id, message, variant }];
	}

	function removeToast(id) {
		toasts = toasts.filter((t) => t.id !== id);
	}
</script>

<!-- Toast container -->
<div class="fixed top-4 right-4 z-[100] flex flex-col gap-2">
	{#each toasts as toast (toast.id)}
		<Toast message={toast.message} variant={toast.variant} onClose={() => removeToast(toast.id)} />
	{/each}
</div>

<!-- Usage examples -->
<button onclick={() => showToast('Item saved successfully!', 'success')}> Show Success </button>

<button onclick={() => showToast('Failed to delete item', 'error')}> Show Error </button>

<!-- With action -->
<Toast
	message="Post deleted"
	variant="success"
	action={{ label: 'Undo', onClick: () => restorePost() }}
	onClose={() => console.log('Toast closed')}
/>
```

---

### Tooltip

Contextual help text that appears on hover, click, or focus.

**Props:**

- `content: string` - Tooltip text (required)
- `position?: 'top' | 'bottom' | 'left' | 'right'` - Placement (default: 'top')
- `delay?: number` - Show delay in ms (default: 200)
- `trigger?: 'hover' | 'click' | 'focus'` - Activation method (default: 'hover')
- `maxWidth?: string` - Maximum width (default: '250px')

**Features:**

- Multiple trigger modes
- Smart positioning with arrow
- Configurable delay
- Fade-in animation
- Keyboard support (Escape to close)
- Dark theme by default
- Pointer-events disabled to avoid interference

**Example:**

```svelte
<script>
	import { Tooltip, IconButton } from '$lib/components';
</script>

<!-- Hover tooltip -->
<Tooltip content="Add to favorites">
	<IconButton icon="favorite_border" ariaLabel="Favorite" />
</Tooltip>

<!-- Click tooltip -->
<Tooltip content="Click anywhere to close" trigger="click" position="bottom">
	<button>Click me</button>
</Tooltip>

<!-- Focus tooltip (for form fields) -->
<Tooltip content="Password must be at least 8 characters" trigger="focus" position="right">
	<input type="password" placeholder="Password" />
</Tooltip>

<!-- Custom max width -->
<Tooltip
	content="This is a longer tooltip with more detailed information that needs more space"
	maxWidth="400px"
>
	<span>Hover for info</span>
</Tooltip>
```

---

### ConfirmDialog

Confirmation dialog for destructive or important actions.

**Props:**

- `open: boolean` - Control dialog visibility (bindable)
- `title: string` - Dialog title (required)
- `message: string` - Confirmation message (required)
- `confirmLabel?: string` - Confirm button text (default: 'Confirm')
- `cancelLabel?: string` - Cancel button text (default: 'Cancel')
- `danger?: boolean` - Use danger styling (red button) (default: false)
- `loading?: boolean` - Show loading state (default: false)
- `onConfirm: () => void | Promise<void>` - Confirm action (required)
- `onCancel: () => void` - Cancel action (required)

**Features:**

- Two-action layout (Cancel/Confirm)
- Danger variant for destructive actions
- Async action support with loading state
- Icon based on danger prop
- Keyboard shortcuts (Enter to confirm, Escape to cancel)
- Prevents body scroll
- Accessible with ARIA alertdialog

**Example:**

```svelte
<script>
	import { ConfirmDialog } from '$lib/components/overlay';

	let showDeleteConfirm = $state(false);

	async function handleDelete() {
		await fetch('/api/posts/123', { method: 'DELETE' });
		console.log('Deleted!');
	}
</script>

<!-- Delete confirmation (danger) -->
<ConfirmDialog
	bind:open={showDeleteConfirm}
	title="Delete Post?"
	message="This action cannot be undone. Your post will be permanently deleted."
	confirmLabel="Delete"
	cancelLabel="Keep Post"
	danger
	onConfirm={handleDelete}
	onCancel={() => console.log('Cancelled')}
/>

<!-- Regular confirmation -->
<ConfirmDialog
	bind:open={showLogoutConfirm}
	title="Log Out?"
	message="Are you sure you want to log out?"
	confirmLabel="Log Out"
	onConfirm={handleLogout}
	onCancel={() => (showLogoutConfirm = false)}
/>

<!-- With loading state -->
<ConfirmDialog
	bind:open={showPublishConfirm}
	title="Publish Post?"
	message="Your post will be visible to everyone immediately."
	confirmLabel="Publish"
	loading={isPublishing}
	onConfirm={async () => {
		isPublishing = true;
		await publishPost();
		isPublishing = false;
	}}
	onCancel={() => (showPublishConfirm = false)}
/>
```

---

## Design System

### Colors

**Toast Variants:**

- Success: Green (#22c55e)
- Error: Red (#ef4444)
- Warning: Yellow (#eab308)
- Info: Blue (#3b82f6)

**ConfirmDialog:**

- Normal: Primary (#13ecec)
- Danger: Red (#ef4444)

### Z-Index Layers

- Modal/Drawer backdrop: z-40
- Modal/Drawer content: z-50
- Toast notifications: z-[100]
- Tooltip: z-50

### Animations

- Modal/Drawer: 300ms ease-out
- Toast: 300ms slide-in from right
- Tooltip: 150ms fade-in

---

## Accessibility

All components include:

- Proper ARIA roles and attributes
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Semantic HTML

**Keyboard Shortcuts:**

- **Escape**: Close modal/drawer/dialog/tooltip
- **Enter**: Confirm action in ConfirmDialog

---

## Usage Tips

1. **Import from barrel export:**

   ```svelte
   import {(Modal, Drawer, Toast, Tooltip, ConfirmDialog)} from '$lib/components/overlay';
   ```

2. **Toast notifications:**
   - Create a toast manager/store for queue management
   - Position container at `fixed top-4 right-4 z-[100]`
   - Use unique keys when rendering multiple toasts
   - Pause timer on hover for better UX

3. **Modal best practices:**
   - Always provide `onClose` callback
   - Use footer snippet for actions
   - Keep modals focused and concise
   - Consider Drawer for mobile-friendly alternatives

4. **Tooltip positioning:**
   - Use 'top' for actions at bottom of screen
   - Use 'bottom' for actions in headers
   - Adjust `maxWidth` for longer content
   - Use 'focus' trigger for form field help

5. **ConfirmDialog pattern:**
   - Use `danger={true}` for destructive actions
   - Handle async operations with loading state
   - Provide clear, action-oriented button labels
   - Keep messages concise but informative

6. **Body scroll management:**
   - Modal, Drawer, and ConfirmDialog automatically prevent body scroll
   - Scroll is restored on unmount
   - Nested modals may need special handling

7. **Mobile considerations:**
   - Drawer with `position="bottom"` works great for mobile sheets
   - Modal automatically adapts with max-height
   - Toast width is constrained with `max-w-md`
