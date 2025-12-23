<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface TagProps {
		label: string;
		color?: string;
		removable?: boolean;
		icon?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		onRemove?: () => void;
		onclick?: () => void;
	}

	let {
		label,
		color,
		removable = false,
		icon,
		size = 'md',
		class: className = '',
		onRemove,
		onclick
	}: TagProps = $props();

	const sizeClasses = {
		sm: 'text-xs px-2 py-1 gap-1',
		md: 'text-sm px-3 py-1.5 gap-1.5',
		lg: 'text-base px-4 py-2 gap-2'
	};

	const iconSizes = {
		sm: 14,
		md: 16,
		lg: 18
	};

	const baseClasses =
		'inline-flex items-center rounded-full font-medium transition-all duration-200';

	const interactiveClasses = $derived(
		onclick ? 'cursor-pointer hover:opacity-80 active:scale-95' : ''
	);

	const colorStyles = $derived(
		color ? `background-color: ${color}20; color: ${color}; border: 1px solid ${color}40;` : ''
	);

	const defaultColorClasses = $derived(
		!color
			? 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-white/10 dark:text-gray-300 dark:border-white/20'
			: ''
	);

	const tagClasses = $derived(
		[baseClasses, sizeClasses[size], interactiveClasses, defaultColorClasses, className]
			.filter(Boolean)
			.join(' ')
	);

	function handleRemove(e: MouseEvent) {
		e.stopPropagation();
		onRemove?.();
	}
</script>

{#if onclick}
	<button
		type="button"
		class={tagClasses}
		style={colorStyles}
		{onclick}
	>
		{#if icon}
			<Icon name={icon} size={iconSizes[size]} />
		{/if}

		<span>{label}</span>

		{#if removable}
			<span
				class="ml-1 -mr-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
				onclick={handleRemove}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleRemove(e);
					}
				}}
				role="button"
				tabindex="0"
				aria-label={`Remove ${label}`}
			>
				<Icon name="close" size={iconSizes[size]} />
			</span>
		{/if}
	</button>
{:else}
	<span class={tagClasses} style={colorStyles}>
		{#if icon}
			<Icon name={icon} size={iconSizes[size]} />
		{/if}

		<span>{label}</span>

		{#if removable}
			<button
				type="button"
				class="ml-1 -mr-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
				onclick={handleRemove}
				aria-label={`Remove ${label}`}
			>
				<Icon name="close" size={iconSizes[size]} />
			</button>
		{/if}
	</span>
{/if}
