<script lang="ts">
	/**
	 * PageHeader Component (formerly SplitLayout - updated based on actual needs)
	 * Page title with optional breadcrumbs and actions
	 * Provides consistent page header styling
	 */
	
	import Icon from '$lib/components/ui/Icon.svelte';
	
	interface Props {
		/** Page title */
		title: string;
		/** Optional subtitle/description */
		subtitle?: string;
		/** Breadcrumb items */
		breadcrumbs?: Array<{ label: string; href?: string }>;
		/** Show back button */
		showBack?: boolean;
		/** Back button callback */
		onBack?: () => void;
		/** Action buttons */
		children?: any;
	}
	
	let {
		title,
		subtitle,
		breadcrumbs = [],
		showBack = false,
		onBack,
		children
	}: Props = $props();
	
	function handleBack() {
		if (onBack) {
			onBack();
		} else {
			window.history.back();
		}
	}
</script>

<div class="mb-6">
	<!-- Breadcrumbs -->
	{#if breadcrumbs.length > 0}
		<nav class="flex items-center gap-2 text-sm mb-2" aria-label="Breadcrumb">
			{#each breadcrumbs as crumb, i}
				{#if i > 0}
					<Icon name="chevron_right" size={16} class="text-gray-400" />
				{/if}
				
				{#if crumb.href}
					<a 
						href={crumb.href}
						class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
					>
						{crumb.label}
					</a>
				{:else}
					<span class="text-gray-900 dark:text-white font-medium">
						{crumb.label}
					</span>
				{/if}
			{/each}
		</nav>
	{/if}
	
	<!-- Header Content -->
	<div class="flex items-start justify-between gap-4">
		<div class="flex items-start gap-3 flex-1 min-w-0">
			<!-- Back Button -->
			{#if showBack}
				<button
					onclick={handleBack}
					class="p-2 -ml-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					aria-label="Go back"
				>
					<Icon name="arrow_back" size={24} />
				</button>
			{/if}
			
			<!-- Title & Subtitle -->
			<div class="flex-1 min-w-0">
				<h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
					{title}
				</h1>
				{#if subtitle}
					<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
						{subtitle}
					</p>
				{/if}
			</div>
		</div>
		
		<!-- Action Buttons -->
		{#if children}
			<div class="flex items-center gap-2">
				{@render children?.()}
			</div>
		{/if}
	</div>
</div>
