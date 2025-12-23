<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface ModalProps {
		open: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		closeOnClickOutside?: boolean;
		closeButton?: boolean;
		class?: string;
		onClose: () => void;
		children?: any;
		header?: any;
		footer?: any;
	}

	let {
		open = $bindable(),
		title,
		size = 'md',
		closeOnClickOutside = true,
		closeButton = true,
		class: className = '',
		onClose,
		children,
		header,
		footer
	}: ModalProps = $props();

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
		full: 'max-w-full mx-4'
	};

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

	// Focus trap
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
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<!-- Backdrop -->
		<button
			onclick={handleBackdropClick}
			class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
			aria-label="Close modal"
			tabindex="-1"
		></button>

		<!-- Modal Content -->
		<div
			class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full {sizeClasses[size]} max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100 opacity-100 {className}"
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
		>
			<!-- Header -->
			{#if header || title || closeButton}
				<div
					class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10"
				>
					<div class="flex-1">
						{#if header}
							{@render header()}
						{:else if title}
							<h2 id="modal-title" class="text-xl font-bold text-slate-900 dark:text-white">
								{title}
							</h2>
						{/if}
					</div>

					{#if closeButton}
						<button
							type="button"
							onclick={handleClose}
							class="ml-4 size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
							aria-label="Close"
						>
							<Icon name="close" size={24} class="text-slate-900 dark:text-white" />
						</button>
					{/if}
				</div>
			{/if}

			<!-- Body -->
			<div class="flex-1 overflow-y-auto px-6 py-4">
				{@render children?.()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div
					class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-white/10"
				>
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
