<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface LikeButtonProps {
		liked: boolean;
		count: number;
		disabled?: boolean;
		class?: string;
		onToggle?: (liked: boolean) => void;
	}

	let {
		liked = $bindable(),
		count = $bindable(),
		disabled = false,
		class: className = '',
		onToggle
	}: LikeButtonProps = $props();

	let isAnimating = $state(false);

	function handleClick() {
		if (disabled) return;

		const newLiked = !liked;
		liked = newLiked;
		count = newLiked ? count + 1 : count - 1;

		// Trigger animation
		isAnimating = true;
		setTimeout(() => {
			isAnimating = false;
		}, 300);

		onToggle?.(newLiked);
	}
</script>

<button
	type="button"
	class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 {className}"
	{disabled}
	onclick={handleClick}
	aria-label={liked ? 'Unlike' : 'Like'}
>
	<span
		class="relative transition-all duration-200 {isAnimating ? 'scale-125' : 'scale-100'}"
	>
		<Icon
			name={liked ? 'favorite' : 'favorite_border'}
			size={20}
			fill={liked ? 1 : 0}
			class="transition-colors duration-200 {liked ? 'text-red-500' : 'text-slate-600 dark:text-gray-400'}"
		/>
	</span>
	
	{#if count > 0}
		<span class="text-sm font-semibold text-slate-700 dark:text-gray-300">
			{count}
		</span>
	{/if}
</button>
