# DEC_L Design System

> Theme & Design System documentation for the DEC_L application
> Last Updated: 2024
> Based on HTML mockups and Phase 0 implementation

## Table of Contents

- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing](#spacing)
- [Shadows & Effects](#shadows--effects)
- [Icons](#icons)
- [Dark Mode](#dark-mode)
- [Mobile Considerations](#mobile-considerations)
- [Component Guidelines](#component-guidelines)

---

## Color Palette

### Primary Color

The primary brand color is a vibrant cyan/turquoise:

- **Primary**: `#13ecec`
- Usage: Buttons, links, highlights, active states

### Background Colors

- **Light Background**: `#f6f8f8` - Used in light mode
- **Dark Background**: `#102222` - Used in dark mode (default)

### Semantic Colors

#### Secondary (Grays)

- `50`: `#f9fafb`
- `100`: `#f3f4f6`
- `200`: `#e5e7eb`
- `300`: `#d1d5db`
- `400`: `#9ca3af`
- `500`: `#6b7280`
- `600`: `#4b5563`
- `700`: `#374151`
- `800`: `#1f2937`
- `900`: `#111827`

#### Success (Green)

- `400`: `#4ade80`
- `500`: `#22c55e`
- `600`: `#16a34a`

#### Warning (Amber)

- `400`: `#fbbf24`
- `500`: `#f59e0b`
- `600`: `#d97706`

#### Danger (Red)

- `400`: `#f87171`
- `500`: `#ef4444`
- `600`: `#dc2626`

### Usage Examples

```html
<!-- Primary button -->
<button class="bg-primary text-white">Submit</button>

<!-- Success message -->
<div class="text-success-500 bg-success-50">Operation successful</div>

<!-- Dark mode card -->
<div class="bg-white dark:bg-background-dark">Card content</div>
```

---

## Typography

### Font Family

**Plus Jakarta Sans** is used throughout the application:

- Available weights: 400 (Regular), 500 (Medium), 700 (Bold), 800 (Extra Bold)
- Loaded via Google Fonts

### Font Scale

| Class       | Size            | Line Height | Usage                    |
| ----------- | --------------- | ----------- | ------------------------ |
| `text-xs`   | 0.75rem (12px)  | 1rem        | Tiny labels, badges      |
| `text-sm`   | 0.875rem (14px) | 1.25rem     | Secondary text, captions |
| `text-base` | 1rem (16px)     | 1.5rem      | Body text (default)      |
| `text-lg`   | 1.125rem (18px) | 1.75rem     | Emphasized text          |
| `text-xl`   | 1.25rem (20px)  | 1.75rem     | Card titles              |
| `text-2xl`  | 1.5rem (24px)   | 2rem        | Section headers          |
| `text-3xl`  | 1.875rem (30px) | 2.25rem     | Page titles              |
| `text-4xl`  | 2.25rem (36px)  | 2.5rem      | Hero headers             |
| `text-5xl`  | 3rem (48px)     | 1           | Large displays           |
| `text-6xl`  | 3.75rem (60px)  | 1           | Extra large displays     |

### Font Weights

- `font-normal` (400): Body text
- `font-medium` (500): Emphasized text
- `font-bold` (700): Headings
- `font-extrabold` (800): Hero text

### Typography Best Practices

1. Use `text-base` for body text
2. Headings should use `font-semibold` or `font-bold`
3. Secondary text uses `text-secondary-500`
4. Always consider dark mode text colors: `text-gray-900 dark:text-gray-100`

---

## Spacing

### Base Scale (Tailwind Default)

Uses 0.25rem (4px) increments:

- `p-1` = 4px
- `p-2` = 8px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px

### Extended Spacing

Additional spacing values for specific use cases:

- `18` (4.5rem / 72px)
- `22` (5.5rem / 88px)
- `88` (22rem / 352px)
- `112` (28rem / 448px)
- `128` (32rem / 512px)

### Spacing Guidelines

- **Component padding**: Use `p-4` (16px) or `p-6` (24px)
- **Section spacing**: Use `space-y-6` (24px) or `space-y-8` (32px)
- **Card spacing**: Internal padding `p-6`, external margin `m-4`
- **Grid gaps**: Use `gap-4` (16px) or `gap-6` (24px)

---

## Shadows & Effects

### Box Shadows

- **card**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
  - Usage: Standard cards and containers
- **card-hover**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
  - Usage: Interactive cards on hover
- **modal**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
  - Usage: Modals and overlays
- **none**: No shadow
  - Usage: Minimalist design elements

### Glassmorphism

The mockup uses glassmorphism effect for headers and navigation:

```html
<!-- Glassmorphic header -->
<header class="glass-header">Content</header>

<!-- Custom glass effect -->
<div class="glass">Translucent content</div>
```

CSS Classes:

- `.glass`: `backdrop-blur-sm bg-white/10 dark:bg-gray-900/10`
- `.glass-header`: `backdrop-blur-sm bg-white/80 dark:bg-background-dark/80`

### Backdrop Blur

- `backdrop-blur-xs` (2px)
- `backdrop-blur-sm` (4px) - Most common
- `backdrop-blur` (8px)
- `backdrop-blur-md` (12px)
- `backdrop-blur-lg` (16px)
- `backdrop-blur-xl` (24px)

### Border Radius

- `rounded` (0.25rem): Small elements
- `rounded-md` (0.375rem): Buttons, inputs
- `rounded-lg` (0.5rem): Cards
- `rounded-xl` (0.75rem): Large cards
- `rounded-2xl` (1rem): Hero sections
- `rounded-4xl` (2rem): Extra large elements
- `rounded-full`: Circular elements (avatars, icons)

---

## Icons

### Material Symbols Outlined

The application uses **Material Symbols Outlined** icon font.

### Icon Component

Use the `Icon` component for all icons:

```svelte
<script>
	import Icon from '$lib/components/ui/Icon.svelte';
</script>

<!-- Basic icon -->
<Icon name="home" />

<!-- Custom size -->
<Icon name="search" size={32} />

<!-- Filled icon -->
<Icon name="favorite" fill={1} />

<!-- Custom weight and grade -->
<Icon name="star" weight={700} grade={200} />

<!-- With accessibility label -->
<Icon name="settings" ariaLabel="Open settings" />
```

### Icon Props

- `name`: Icon name (required)
- `size`: Size in pixels (default: 24)
- `fill`: 0 (outlined) or 1 (filled) (default: 0)
- `weight`: 100-700 (default: 400)
- `grade`: -25 to 200 (default: 0)
- `opsz`: 20-48 (default: 24)
- `class`: Additional CSS classes
- `ariaLabel`: Accessibility label

### Common Icons

- Navigation: `home`, `search`, `notifications`, `person`, `menu`, `more_vert`
- Actions: `add`, `edit`, `delete`, `close`, `check`, `arrow_back`
- Media: `image`, `photo_camera`, `videocam`, `play_arrow`, `favorite`
- Messaging: `chat`, `send`, `mail`, `call`
- Content: `bookmark`, `share`, `star`, `visibility`, `download`

### Font Variation Settings

Default settings (can be customized per icon):

```css
font-variation-settings:
	'FILL' 0,
	'wght' 400,
	'GRAD' 0,
	'opsz' 24;
```

---

## Dark Mode

### Implementation

Dark mode is **enabled by default** via the `dark` class on `<html>`:

```html
<html lang="en" class="dark"></html>
```

### Color Usage

Always provide both light and dark variants:

```html
<!-- Background -->
<div class="bg-white dark:bg-background-dark">
	<!-- Text -->
	<p class="text-gray-900 dark:text-gray-100">
		<!-- Borders -->
	</p>

	<div class="border border-gray-200 dark:border-gray-700"></div>
</div>
```

### Best Practices

1. **Always specify dark variants**: Don't rely on Tailwind defaults
2. **Test in both modes**: Even though dark is default, light mode should work
3. **Use semantic colors**: `background-light`, `background-dark`
4. **Consider contrast**: Ensure text is readable in both modes
5. **Shadows in dark mode**: Reduce or remove shadows in dark mode

### Common Patterns

```html
<!-- Card -->
<div class="bg-white dark:bg-background-dark shadow-card dark:shadow-none">
	<!-- Input -->
	<input class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />

	<!-- Button -->
	<button class="bg-primary text-white hover:bg-primary/90"></button>
</div>
```

---

## Mobile Considerations

### iOS Safe Areas

The design system includes safe area insets for iOS devices:

```css
:root {
	--safe-area-top: env(safe-area-inset-top, 0px);
	--safe-area-bottom: env(safe-area-inset-bottom, 0px);
	--safe-area-left: env(safe-area-inset-left, 0px);
	--safe-area-right: env(safe-area-inset-right, 0px);
}
```

### Safe Area Classes

```html
<!-- Apply safe areas -->
<header class="safe-top">Header</header>
<nav class="safe-bottom">Bottom Navigation</nav>
```

### Viewport Configuration

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

### Mobile-First Design

All components should be designed mobile-first:

```html
<!-- Mobile: stack vertically, Desktop: horizontal -->
<div class="flex flex-col md:flex-row gap-4"></div>
```

### Touch Targets

- Minimum height: `h-12` (48px) for tap targets
- Buttons: `px-4 py-2` minimum padding
- Icons: `size={24}` minimum for touch

---

## Component Guidelines

### Card Components

```html
<!-- Basic card -->
<div class="card p-6">
	<h3 class="text-xl font-semibold">Title</h3>
	<p class="text-secondary-500">Content</p>
</div>

<!-- Interactive card -->
<div class="card-hover p-6 cursor-pointer">Content</div>

<!-- Minimalist card (mockup style) -->
<div class="bg-white dark:bg-background-dark rounded-lg p-6 shadow-none">Content</div>
```

### Button Components

```html
<!-- Primary button -->
<button class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">Action</button>

<!-- Secondary button -->
<button
	class="bg-secondary-200 dark:bg-secondary-700 text-gray-900 dark:text-gray-100 px-6 py-2 rounded-md"
>
	Cancel
</button>

<!-- Icon button -->
<button class="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800">
	<Icon name="favorite" />
</button>
```

### Form Components

```html
<!-- Input field -->
<input
	type="text"
	class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
/>

<!-- Label -->
<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> Field Name </label>
```

### Navigation Components

```html
<!-- Glassmorphic header -->
<header class="glass-header fixed top-0 left-0 right-0 z-50 safe-top">
	<div class="container mx-auto px-4 py-4">
		<!-- Header content -->
	</div>
</header>

<!-- Bottom navigation -->
<nav
	class="fixed bottom-0 left-0 right-0 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 safe-bottom"
>
	<!-- Nav items -->
</nav>
```

### Layout Patterns

```html
<!-- Page container -->
<div class="min-h-screen bg-background-light dark:bg-background-dark">
	<main class="container mx-auto px-4 py-8">
		<!-- Content -->
	</main>
</div>

<!-- Grid layout -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	<!-- Items -->
</div>

<!-- Flex layout -->
<div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
	<!-- Items -->
</div>
```

---

## Animation & Transitions

### Transition Durations

- `duration-75`: Very fast (75ms)
- `duration-100`: Fast (100ms)
- `duration-150`: Default (150ms)
- `duration-200`: Moderate (200ms)
- `duration-300`: Slow (300ms)
- `duration-2000`: Extra slow (2000ms)
- `duration-3000`: Very slow (3000ms)

### Custom Animations

- `animate-spin-slow`: 3s linear infinite spin
- `animate-pulse-slow`: 3s cubic-bezier pulse
- `animate-bounce-slow`: 2s infinite bounce

### Transition Best Practices

```html
<!-- Hover transitions -->
<button class="transition-colors duration-200 hover:bg-primary">
	<!-- Shadow transitions -->
	<div class="transition-shadow duration-200 hover:shadow-card-hover">
		<!-- Transform transitions -->
		<div class="transition-transform duration-200 hover:scale-105"></div>
	</div>
</button>
```

---

## Accessibility

### Color Contrast

- Ensure text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Test both light and dark modes
- Use tools like WebAIM Contrast Checker

### Focus States

Always provide visible focus indicators:

```html
<button class="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"></button>
```

### ARIA Labels

Use `ariaLabel` prop on Icon components and semantic HTML:

```html
<Icon name="close" ariaLabel="Close dialog" />
<button aria-label="Search">
	<Icon name="search" />
</button>
```

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<button>` for actions, `<a>` for navigation
- Use `<nav>`, `<main>`, `<aside>`, `<article>`, etc.

---

## Usage Examples

### Complete Card Example

```html
<div
	class="bg-white dark:bg-background-dark rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden"
>
	<!-- Card header with glassmorphism -->
	<div class="glass-header px-6 py-4 border-b border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between">
			<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Card Title</h3>
			<Icon name="more_vert" size="{20}" />
		</div>
	</div>

	<!-- Card content -->
	<div class="p-6">
		<p class="text-secondary-500 mb-4">Card description goes here.</p>
		<button
			class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
		>
			Action
		</button>
	</div>
</div>
```

### Complete Form Example

```html
<form class="space-y-6">
	<div>
		<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> Email </label>
		<input
			type="email"
			class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
			placeholder="you@example.com"
		/>
	</div>

	<div class="flex gap-4">
		<button
			type="submit"
			class="flex-1 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
		>
			Submit
		</button>
		<button
			type="button"
			class="flex-1 bg-secondary-200 dark:bg-secondary-700 text-gray-900 dark:text-gray-100 px-6 py-2 rounded-md hover:bg-secondary-300 dark:hover:bg-secondary-600 transition-colors duration-200"
		>
			Cancel
		</button>
	</div>
</form>
```

---

## Next Steps

With Phase 0 complete, you can now:

1. **Build Foundation Components** (Phase 1): Button, Input, Select, Checkbox, etc.
2. **Refer to this document** when implementing any component
3. **Update this document** as the design system evolves
4. **Share with team members** for consistency

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Material Symbols Guide](https://fonts.google.com/icons)
- [Plus Jakarta Sans Font](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Design System Version**: 1.0  
**Last Updated**: Phase 0 Implementation  
**Maintained by**: DEC_L Development Team
