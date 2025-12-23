# Storybook for DEC_L Web Components

This Storybook instance provides interactive documentation and development environment for all 42 UI components.

## 🚀 Getting Started

### Prerequisites

- Node.js 22.8+ or compatible version
- All dependencies installed (`npm install`)

### Running Storybook

```bash
# From the apps/web directory
npm run storybook

# Or using npx directly
npx storybook dev -p 6006
```

Storybook will start at [http://localhost:6006](http://localhost:6006)

### Building Storybook

```bash
npm run build-storybook
```

This creates a static build in `storybook-static/` that can be deployed.

## 📚 Component Stories

### Current Coverage

- ✅ **Button Components** (6 stories)
  - Button (all variants, sizes, with icons, loading states)
  - IconButton (with badges, all sizes)
  - LikeButton (liked/unliked states, counts)
  - ShareButton (social sharing)
  - FollowButton (follow/unfollow states)
  - DropdownMenu (menu items, dividers, danger actions)

- ✅ **Media Components** (5 stories)
  - Avatar (all sizes, status indicators, badges, editable)
  - ImageCarousel (thumbnails, dots, auto-play, aspect ratios)
  - Badge (status/count/label variants, all colors, pulse)
  - Tag (with icons, removable, custom colors)
  - ProgressBar (striped, animated, with labels)

- ✅ **Overlay Components** (5 stories)
  - Modal (all sizes, with header/footer slots)
  - Drawer (left/right/bottom positions, custom sizes)
  - Toast (all variants, with actions, auto-dismiss)
  - Tooltip (all positions, triggers, delays)
  - ConfirmDialog (default and danger variants)

- 🔄 **Card Components** (8 stories) - In Progress
- ⏳ **Form Components** (12 stories) - Pending
- ⏳ **Layout Components** (6 stories) - Pending

## 🎨 Features

### Theme Decorator

Toggle between light and dark modes using the toolbar theme switcher. All components support both themes.

### Accessibility Testing

The a11y addon automatically checks components for accessibility violations. View the "Accessibility" panel for WCAG compliance issues.

### Interactive Controls

Use the "Controls" panel to dynamically change component props and see updates in real-time.

### Responsive Viewports

Test components at different screen sizes using the viewport toolbar.

## 📖 Story Patterns

### Basic Story

```typescript
export const Default: Story = {
	args: {
		variant: 'primary',
		children: 'Click me'
	}
};
```

### Story with Custom Render

```typescript
export const AllVariants: Story = {
	render: () => ({
		Component: Button,
		slot: `
      <div style="display: flex; gap: 1rem;">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </div>
    `
	})
};
```

### Story with Interactions

```typescript
export const Interactive: Story = {
	args: {
		liked: false
	},
	play: async ({ canvasElement }) => {
		const button = canvasElement.querySelector('button');
		await userEvent.click(button);
	}
};
```

## 🔌 Addons Configured

- **Essentials**: Controls, Actions, Docs, Viewport, Backgrounds, Toolbars, Measure, Outline
- **A11y**: Accessibility testing and reporting
- **Themes**: Dark/light mode toggle
- **Interactions**: Simulate user interactions
- **Svelte CSF**: Svelte Component Story Format support

## 📁 Project Structure

```
.storybook/
  ├── main.js          # Storybook configuration
  └── preview.js       # Global decorators and parameters

src/lib/components/
  ├── buttons/
  │   ├── Button.svelte
  │   ├── Button.stories.ts
  │   └── ...
  ├── media/
  │   ├── Avatar.svelte
  │   ├── Avatar.stories.ts
  │   └── ...
  └── ...
```

## 🎯 Best Practices

1. **Use Autodocs**: Tag stories with `tags: ['autodocs']` for automatic documentation generation
2. **ArgTypes**: Define comprehensive argTypes for better controls
3. **Multiple Stories**: Create multiple stories to showcase different use cases
4. **Accessibility**: Always test with the a11y addon
5. **Responsive**: Test components at multiple viewports
6. **Dark Mode**: Verify components in both light and dark themes

## 🐛 Troubleshooting

### Storybook won't start

- Ensure all dependencies are installed: `npm install`
- Clear cache: `npx storybook@latest reset`
- Check Node version: `node --version` (should be 22.8+)

### Stories not showing

- Verify story files match pattern: `*.stories.@(js|ts|svelte)`
- Check file location: Must be inside `src/` directory
- Restart Storybook server

### Import errors

- Check `$lib` alias configuration in `.storybook/main.js`
- Verify component imports use correct paths
- Ensure all dependencies are installed

## 🚢 Deployment

Storybook can be built and deployed as a static site:

```bash
# Build for production
npm run build-storybook

# Deploy to GitHub Pages
npm run deploy-storybook

# Deploy to Netlify, Vercel, or any static host
# Upload the storybook-static/ directory
```

## 📊 Coverage Goals

- [x] Button & Action Components: 6/6 (100%)
- [x] Media & Display Components: 5/5 (100%)
- [x] Overlay & Modal Components: 5/5 (100%)
- [ ] Card & List Components: 0/8 (0%)
- [ ] Form Components: 0/12 (0%)
- [ ] Layout Components: 0/6 (0%)

**Total Progress**: 16/42 components (38%)

## 📞 Support

For issues or questions about Storybook setup:

1. Check the [Storybook Documentation](https://storybook.js.org/docs)
2. Review component README files
3. Check the troubleshooting section above

---

**Last Updated**: December 17, 2025
**Storybook Version**: 8.4.7
**Framework**: @storybook/svelte-vite
