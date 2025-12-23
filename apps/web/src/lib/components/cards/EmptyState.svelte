<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/buttons/Button.svelte';

	interface Props {
		icon?: string;
		title: string;
		description?: string;
		actionLabel?: string;
		onAction?: () => void;
	}

	let { icon = 'inbox', title, description, actionLabel, onAction }: Props = $props();
</script>

<div
	class="flex flex-col items-center justify-center text-center py-16 px-4"
	role="status"
	aria-label="Empty state"
>
	<!-- Icon -->
	<div
		class="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6"
	>
		<Icon
			name={icon}
			size={48}
			class="text-slate-400 dark:text-slate-500"
		/>
	</div>

	<!-- Title -->
	<h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
		{title}
	</h3>

	<!-- Description -->
	{#if description}
		<p class="text-base text-slate-600 dark:text-slate-400 mb-6 max-w-md">
			{description}
		</p>
	{/if}

	<!-- Action Button -->
	{#if actionLabel && onAction}
		<Button variant="primary" size="lg" onclick={onAction}>
			{actionLabel}
		</Button>
	{/if}
</div>
