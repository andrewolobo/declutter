<script lang="ts">
	import { onMount } from 'svelte';
	import ErrorMessage from './ErrorMessage.svelte';

	interface Props {
		children?: import('svelte').Snippet;
		fallback?: import('svelte').Snippet<[Error]>;
	}

	let { children, fallback }: Props = $props();

	let error = $state<Error | null>(null);

	onMount(() => {
		const handleError = (event: ErrorEvent) => {
			error = event.error;
			event.preventDefault();
		};

		window.addEventListener('error', handleError);

		return () => {
			window.removeEventListener('error', handleError);
		};
	});

	const reset = () => {
		error = null;
	};
</script>

{#if error}
	{#if fallback}
		{@render fallback(error)}
	{:else}
		<div class="min-h-screen flex items-center justify-center p-4">
			<div class="max-w-md w-full">
				<ErrorMessage
					title="Something went wrong"
					message={error.message || 'An unexpected error occurred'}
					type="error"
					onRetry={reset}
				/>
			</div>
		</div>
	{/if}
{:else if children}
	{@render children()}
{/if}
