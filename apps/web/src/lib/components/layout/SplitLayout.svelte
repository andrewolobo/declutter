<script lang="ts">
	/**
	 * SplitLayout Component
	 * Two-column layout for list-detail views (e.g., Messages page)
	 * Supports responsive behavior and collapsible columns
	 */
	
	interface Props {
		/** Left column width (e.g., '400px' or '30%') */
		leftWidth?: string;
		/** Right column width (e.g., '70%' or 'auto') */
		rightWidth?: string;
		/** Allow collapsing to single column on mobile */
		collapsible?: boolean;
		/** Breakpoint for collapse (default: 768px) */
		collapseBreakpoint?: number;
		/** Left column content */
		left?: any;
		/** Right column content */
		right?: any;
	}
	
	let {
		leftWidth = '400px',
		rightWidth = 'auto',
		collapsible = true,
		collapseBreakpoint = 768,
		left,
		right
	}: Props = $props();
	
	// Mobile view state
	let showRight = $state(false);
	
	function selectItem() {
		showRight = true;
	}
	
	function backToList() {
		showRight = false;
	}
</script>

<div class="h-full flex overflow-hidden">
	<!-- Left Column (List) -->
	<div 
		class="border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
		class:hidden={collapsible && showRight}
		class:md:block={collapsible}
		style="width: {leftWidth}; flex-shrink: 0;"
	>
		{@render left?.({ selectItem })}
	</div>
	
	<!-- Right Column (Detail) -->
	<div 
		class="flex-1 overflow-y-auto"
		class:hidden={collapsible && !showRight}
		class:md:block={collapsible}
		style="width: {rightWidth};"
	>
		{@render right?.({ backToList })}
	</div>
</div>

<style>
	/* Custom scrollbar for columns */
	div::-webkit-scrollbar {
		width: 6px;
	}
	
	div::-webkit-scrollbar-track {
		background: transparent;
	}
	
	div::-webkit-scrollbar-thumb {
		background: rgba(156, 163, 175, 0.3);
		border-radius: 3px;
	}
	
	div::-webkit-scrollbar-thumb:hover {
		background: rgba(156, 163, 175, 0.5);
	}
</style>
