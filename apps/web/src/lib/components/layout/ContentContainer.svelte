<script lang="ts">
	/**
	 * ContentContainer Component
	 * Wrapper for main content with proper spacing and constraints
	 * Provides consistent layout and responsive behavior
	 */
	
	interface Props {
		/** Maximum width constraint */
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		/** Padding size */
		padding?: 'none' | 'sm' | 'md' | 'lg';
		/** Center the content */
		centered?: boolean;
		/** Children content */
		children?: any;
	}
	
	let {
		maxWidth = 'lg',
		padding = 'md',
		centered = true,
		children
	}: Props = $props();
	
	// Compute container classes
	const maxWidthClasses = {
		sm: 'max-w-2xl',
		md: 'max-w-4xl',
		lg: 'max-w-6xl',
		xl: 'max-w-7xl',
		full: 'max-w-none'
	};
	
	const paddingClasses = {
		none: '',
		sm: 'px-4 py-4',
		md: 'px-4 py-6 md:px-6',
		lg: 'px-4 py-8 md:px-8'
	};
	
	const containerClass = $derived(
		`${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${centered ? 'mx-auto' : ''}`
	);
</script>

<div class={containerClass}>
	{@render children?.()}
</div>
