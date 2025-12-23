<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/buttons/Button.svelte';

	interface ConfirmDialogProps {
		open: boolean;
		title: string;
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
		danger?: boolean;
		loading?: boolean;
		class?: string;
		onConfirm: () => void | Promise<void>;
		onCancel: () => void;
	}

	let {
		open = $bindable(),
		title,
		message,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		danger = false,
		loading = false,
		class: className = '',
		onConfirm,
		onCancel
	}: ConfirmDialogProps = $props();

	let isProcessing = $state(false);

	async function handleConfirm() {
		isProcessing = true;
		try {
			await onConfirm();
			open = false;
		} catch (error) {
			console.error('Confirm action failed:', error);
		} finally {
			isProcessing = false;
		}
	}

	function handleCancel() {
		open = false;
		onCancel();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!open) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			handleCancel();
		} else if (event.key === 'Enter' && !isProcessing) {
			event.preventDefault();
			handleConfirm();
		}
	}

	// Prevent body scroll when dialog is open
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
			onclick={handleCancel}
			class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
			aria-label="Close dialog"
			tabindex="-1"
		></button>

		<!-- Dialog Content -->
		<div
			class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 {className}"
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="confirm-dialog-title"
			aria-describedby="confirm-dialog-message"
		>
			<!-- Icon & Content -->
			<div class="p-6">
				<div class="flex items-start gap-4">
					<!-- Icon -->
					<div
						class="flex-shrink-0 size-12 rounded-full flex items-center justify-center {danger
							? 'bg-red-100 dark:bg-red-500/20'
							: 'bg-primary/20'}"
					>
						<Icon
							name={danger ? 'warning' : 'help'}
							size={28}
							class={danger ? 'text-red-500' : 'text-primary'}
						/>
					</div>

					<!-- Text Content -->
					<div class="flex-1 min-w-0">
						<h3
							id="confirm-dialog-title"
							class="text-lg font-bold text-slate-900 dark:text-white mb-2"
						>
							{title}
						</h3>
						<p id="confirm-dialog-message" class="text-sm text-slate-600 dark:text-gray-400">
							{message}
						</p>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div
				class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-white/10"
			>
				<Button variant="ghost" onclick={handleCancel} disabled={isProcessing || loading}>
					{cancelLabel}
				</Button>

				<Button
					variant={danger ? 'danger' : 'primary'}
					onclick={handleConfirm}
					loading={isProcessing || loading}
					disabled={isProcessing || loading}
				>
					{confirmLabel}
				</Button>
			</div>
		</div>
	</div>
{/if}
