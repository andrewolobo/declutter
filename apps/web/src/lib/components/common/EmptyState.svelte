<script lang="ts">
	interface Props {
		icon?: string;
		title: string;
		description?: string;
		actionText?: string;
		onAction?: () => void;
	}

	let { icon = 'inbox', title, description, actionText, onAction }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center p-8 text-center">
	<span class="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
		{icon}
	</span>
	<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
	{#if description}
		<p class="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-4">{description}</p>
	{/if}
	{#if actionText && onAction}
		<button
			onclick={onAction}
			class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
		>
			{actionText}
		</button>
	{/if}
</div>
