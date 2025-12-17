<script lang="ts">
	interface Props {
		variant?: 'text' | 'circle' | 'rect' | 'card';
		width?: string;
		height?: string;
		count?: number;
	}

	let { variant = 'text', width, height, count = 1 }: Props = $props();

	const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700';

	const variantStyles = {
		text: 'h-4 rounded',
		circle: 'rounded-full',
		rect: 'rounded',
		card: 'h-64 rounded-lg'
	};

	const getStyle = () => {
		const styles = [];
		if (width) styles.push(`width: ${width}`);
		if (height) styles.push(`height: ${height}`);
		return styles.join('; ');
	};
</script>

<div class="space-y-3">
	{#each Array(count) as _, i (i)}
		<div 
			class="{baseClass} {variantStyles[variant]}" 
			style={getStyle()}
			role="status" 
			aria-label="Loading"
		>
			<span class="sr-only">Loading...</span>
		</div>
	{/each}
</div>
