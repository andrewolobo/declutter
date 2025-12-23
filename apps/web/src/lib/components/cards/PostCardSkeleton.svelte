<script lang="ts">
	interface Props {
		variant?: 'feed' | 'grid' | 'list';
		count?: number;
	}

	let { variant = 'feed', count = 1 }: Props = $props();

	const cardClasses = $derived(
		variant === 'feed'
			? 'flex flex-col'
			: variant === 'grid'
				? 'flex flex-col'
				: 'flex flex-row gap-4'
	);

	const imageContainerClasses = $derived(
		variant === 'feed'
			? 'w-full aspect-[4/3]'
			: variant === 'grid'
				? 'w-full aspect-square'
				: 'w-32 h-32 flex-shrink-0'
	);
</script>

{#each Array(count) as _, i (i)}
	<article
		class="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 {cardClasses}"
		aria-busy="true"
		aria-label="Loading post"
	>
		<!-- Image Skeleton -->
		<div class="{imageContainerClasses} bg-slate-200 dark:bg-slate-700 animate-pulse"></div>

		<!-- Content Skeleton -->
		<div class="p-4 flex-1 flex flex-col">
			<!-- User Info Skeleton -->
			<div class="flex items-center gap-2 mb-3">
				<div
					class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
				></div>
				<div class="flex flex-col gap-2 flex-1">
					<div
						class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/3"
					></div>
					<div
						class="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/4"
					></div>
				</div>
			</div>

			<!-- Title & Status Skeleton -->
			<div class="flex items-start justify-between gap-2 mb-2">
				<div class="flex-1 space-y-2">
					<div
						class="h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4"
					></div>
					<div
						class="h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/2"
					></div>
				</div>
				<div
					class="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"
				></div>
			</div>

			<!-- Description Skeleton -->
			{#if variant === 'feed'}
				<div class="space-y-2 mb-3">
					<div
						class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-full"
					></div>
					<div
						class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-5/6"
					></div>
				</div>
			{/if}

			<!-- Location & Price Skeleton -->
			<div class="flex items-center justify-between mb-3 mt-auto">
				<div
					class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/4"
				></div>
				<div
					class="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/5"
				></div>
			</div>

			<!-- Actions Skeleton -->
			<div
				class="flex items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-700"
			>
				<div class="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
				<div class="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-20"></div>
				<div class="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16 ml-auto"></div>
			</div>
		</div>
	</article>
{/each}

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
