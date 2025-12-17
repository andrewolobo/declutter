<script lang="ts">
	import LoadingSpinner from './LoadingSpinner.svelte';

	interface Props {
		text?: string;
		fullscreen?: boolean;
	}

	let { text = 'Loading...', fullscreen = false }: Props = $props();
</script>

{#if fullscreen}
	<div
		class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
		role="alert"
		aria-busy="true"
	>
		<div class="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-modal">
			<LoadingSpinner size="lg" {text} />
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center p-8" role="alert" aria-busy="true">
		<LoadingSpinner size="md" {text} />
	</div>
{/if}
