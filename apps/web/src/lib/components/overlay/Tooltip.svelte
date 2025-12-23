<script lang="ts">
	interface TooltipProps {
		content: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		delay?: number;
		trigger?: 'hover' | 'click' | 'focus';
		maxWidth?: string;
		class?: string;
		children?: any;
	}

	let {
		content,
		position = 'top',
		delay = 200,
		trigger = 'hover',
		maxWidth = '250px',
		class: className = '',
		children
	}: TooltipProps = $props();

	let visible = $state(false);
	let tooltipRef = $state<HTMLDivElement>();
	let triggerRef = $state<HTMLDivElement>();
	let timer: ReturnType<typeof setTimeout> | null = null;

	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};

	const arrowClasses = {
		top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-700',
		bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-700',
		left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-700',
		right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-700'
	};

	function show() {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			visible = true;
		}, delay);
	}

	function hide() {
		if (timer) clearTimeout(timer);
		visible = false;
	}

	function handleMouseEnter() {
		if (trigger === 'hover') show();
	}

	function handleMouseLeave() {
		if (trigger === 'hover') hide();
	}

	function handleClick() {
		if (trigger === 'click') {
			visible = !visible;
		}
	}

	function handleFocus() {
		if (trigger === 'focus') show();
	}

	function handleBlur() {
		if (trigger === 'focus') hide();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && visible) {
			hide();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative inline-block {className}">
	<div
		bind:this={triggerRef}
		role="button"
		tabindex="0"
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		onclick={handleClick}
		onkeydown={handleClick}
		onfocus={handleFocus}
		onblur={handleBlur}
	>
		{@render children?.()}
	</div>

	{#if visible}
		<div
			bind:this={tooltipRef}
			class="absolute z-50 {positionClasses[position]} pointer-events-none"
			role="tooltip"
		>
			<div
				class="bg-slate-900 dark:bg-slate-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg animate-[fadeIn_0.15s_ease-out]"
				style="max-width: {maxWidth}"
			>
				{content}

				<!-- Arrow -->
				<div
					class="absolute {arrowClasses[position]} w-0 h-0 border-4 border-transparent"
				></div>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
