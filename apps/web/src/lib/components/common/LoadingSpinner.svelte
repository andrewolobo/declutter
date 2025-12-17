<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg' | 'xl';
		color?: 'primary' | 'secondary' | 'white';
		text?: string;
	}

	let { size = 'md', color = 'primary', text }: Props = $props();

	const sizeClasses = {
		sm: 'w-4 h-4 border-2',
		md: 'w-8 h-8 border-2',
		lg: 'w-12 h-12 border-3',
		xl: 'w-16 h-16 border-4'
	};

	const colorClasses = {
		primary: 'border-primary border-t-transparent',
		secondary: 'border-secondary-400 border-t-transparent',
		white: 'border-white border-t-transparent'
	};
</script>

<div class="flex flex-col items-center justify-center gap-3">
	<div
		class="rounded-full animate-spin {sizeClasses[size]} {colorClasses[color]}"
		role="status"
		aria-label="Loading"
	></div>
	{#if text}
		<p class="text-sm text-gray-600 dark:text-gray-400">{text}</p>
	{/if}
</div>
