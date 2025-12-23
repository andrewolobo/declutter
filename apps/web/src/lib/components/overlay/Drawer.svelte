<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface DrawerProps {
		open: boolean;
		position?: 'left' | 'right' | 'bottom';
		size?: string;
		closeOnClickOutside?: boolean;
		class?: string;
		onClose: () => void;
		children?: any;
	}

	let {
		open = $bindable(),
		position = 'right',
		size,
		closeOnClickOutside = true,
		class: className = '',
		onClose,
		children
	}: DrawerProps = $props();

	const defaultSizes = {
		left: '320px',
		right: '320px',
		bottom: '70vh'
	};

	const drawerSize = $derived(size || defaultSizes[position]);

	const positionClasses = {
		left: 'left-0 top-0 h-full',
		right: 'right-0 top-0 h-full',
		bottom: 'bottom-0 left-0 w-full'
	};

	const transformClasses = {
		left: open ? 'translate-x-0' : '-translate-x-full',
		right: open ? 'translate-x-0' : 'translate-x-full',
		bottom: open ? 'translate-y-0' : 'translate-y-full'
	};

	const sizeStyles = $derived(
		position === 'bottom' ? `height: ${drawerSize}` : `width: ${drawerSize}`
	);

	function handleBackdropClick() {
		if (closeOnClickOutside) {
			handleClose();
		}
	}

	function handleClose() {
		open = false;
		onClose();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			handleClose();
		}
	}

	// Prevent body scroll when drawer is open
	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<button
		onclick={handleBackdropClick}
		class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
		aria-label="Close drawer"
		tabindex="-1"
	></button>

	<!-- Drawer -->
	<div
		class="fixed {positionClasses[position]} bg-white dark:bg-slate-900 shadow-2xl z-50 transition-transform duration-300 ease-out overflow-y-auto {transformClasses[position]} {className}"
		style={sizeStyles}
		role="dialog"
		aria-modal="true"
	>
		<!-- Close Button -->
		<div class="sticky top-0 flex justify-end p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10 border-b border-gray-200 dark:border-white/10">
			<button
				type="button"
				onclick={handleClose}
				class="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
				aria-label="Close"
			>
				<Icon name="close" size={24} class="text-slate-900 dark:text-white" />
			</button>
		</div>

		<!-- Content -->
		<div class="p-6">
			{@render children?.()}
		</div>
	</div>
{/if}
