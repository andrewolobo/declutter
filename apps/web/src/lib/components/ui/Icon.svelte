<script lang="ts">
	/**
	 * Icon Component
	 * Wrapper for Material Symbols Outlined icons with proper font-variation-settings
	 * 
	 * @example
	 * <Icon name="home" />
	 * <Icon name="search" size={32} />
	 * <Icon name="favorite" fill={true} weight={700} />
	 */
	
	interface Props {
		/** Icon name from Material Symbols (e.g., 'home', 'search', 'favorite') */
		name: string;
		/** Icon size in pixels (default: 24) */
		size?: number;
		/** Fill variation: 0 (outlined) or 1 (filled) (default: 0) */
		fill?: 0 | 1;
		/** Font weight: 100-700 (default: 400) */
		weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
		/** Grade: -25 to 200 (default: 0) */
		grade?: number;
		/** Optical size: 20-48 (default: 24) */
		opsz?: number;
		/** Additional CSS classes */
		class?: string;
		/** ARIA label for accessibility */
		ariaLabel?: string;
	}
	
	let {
		name,
		size = 24,
		fill = 0,
		weight = 400,
		grade = 0,
		opsz = 24,
		class: className = '',
		ariaLabel
	}: Props = $props();
	
	// Compute font-variation-settings
	const fontVariationSettings = $derived(
		`'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`
	);
	
	// Compute inline styles
	const iconStyle = $derived(
		`font-size: ${size}px; font-variation-settings: ${fontVariationSettings};`
	);
</script>

<span
	class="material-symbols-outlined {className}"
	style={iconStyle}
	role="img"
	aria-label={ariaLabel || name}
>
	{name}
</span>

<style>
	/* Additional icon-specific styles if needed */
	.material-symbols-outlined {
		user-select: none;
		-webkit-user-select: none;
	}
</style>
