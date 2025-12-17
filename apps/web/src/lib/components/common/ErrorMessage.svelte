<script lang="ts">
	interface Props {
		title?: string;
		message: string;
		type?: 'error' | 'warning' | 'info';
		onRetry?: () => void;
		onDismiss?: () => void;
	}

	let { title, message, type = 'error', onRetry, onDismiss }: Props = $props();

	const typeStyles = {
		error: 'bg-error-50 border-error-200 text-error-800 dark:bg-error-900/20 dark:border-error-800 dark:text-error-200',
		warning: 'bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-900/20 dark:border-warning-800 dark:text-warning-200',
		info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
	};

	const iconMap = {
		error: 'error',
		warning: 'warning',
		info: 'info'
	};
</script>

<div class="border rounded-lg p-4 {typeStyles[type]}" role="alert">
	<div class="flex items-start gap-3">
		<span class="material-symbols-outlined text-2xl flex-shrink-0">
			{iconMap[type]}
		</span>
		<div class="flex-1 min-w-0">
			{#if title}
				<h3 class="font-semibold mb-1">{title}</h3>
			{/if}
			<p class="text-sm">{message}</p>
			{#if onRetry || onDismiss}
				<div class="flex gap-2 mt-3">
					{#if onRetry}
						<button
							onclick={onRetry}
							class="text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
						>
							Try again
						</button>
					{/if}
					{#if onDismiss}
						<button
							onclick={onDismiss}
							class="text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
						>
							Dismiss
						</button>
					{/if}
				</div>
			{/if}
		</div>
		{#if onDismiss}
			<button
				onclick={onDismiss}
				class="flex-shrink-0 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
				aria-label="Dismiss"
			>
				<span class="material-symbols-outlined text-xl">close</span>
			</button>
		{/if}
	</div>
</div>
