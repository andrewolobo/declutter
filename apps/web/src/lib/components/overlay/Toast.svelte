<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface ToastAction {
		label: string;
		onClick: () => void;
	}

	interface ToastProps {
		message: string;
		variant?: 'success' | 'error' | 'warning' | 'info';
		duration?: number;
		action?: ToastAction;
		class?: string;
		onClose?: () => void;
	}

	let {
		message,
		variant = 'info',
		duration = 5000,
		action,
		class: className = '',
		onClose
	}: ToastProps = $props();

	let visible = $state(true);
	let timer: ReturnType<typeof setTimeout> | null = null;

	const variantStyles = {
		success: {
			bg: 'bg-green-50 dark:bg-green-500/20 border-green-200 dark:border-green-500/30',
			text: 'text-green-800 dark:text-green-300',
			icon: 'check_circle',
			iconColor: 'text-green-500'
		},
		error: {
			bg: 'bg-red-50 dark:bg-red-500/20 border-red-200 dark:border-red-500/30',
			text: 'text-red-800 dark:text-red-300',
			icon: 'error',
			iconColor: 'text-red-500'
		},
		warning: {
			bg: 'bg-yellow-50 dark:bg-yellow-500/20 border-yellow-200 dark:border-yellow-500/30',
			text: 'text-yellow-800 dark:text-yellow-300',
			icon: 'warning',
			iconColor: 'text-yellow-500'
		},
		info: {
			bg: 'bg-blue-50 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30',
			text: 'text-blue-800 dark:text-blue-300',
			icon: 'info',
			iconColor: 'text-blue-500'
		}
	};

	const style = $derived(variantStyles[variant]);

	function startTimer() {
		if (duration > 0) {
			timer = setTimeout(() => {
				handleClose();
			}, duration);
		}
	}

	function stopTimer() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}

	function handleClose() {
		visible = false;
		stopTimer();
		setTimeout(() => {
			onClose?.();
		}, 300); // Wait for animation to complete
	}

	function handleActionClick() {
		action?.onClick();
		handleClose();
	}

	$effect(() => {
		startTimer();
		return () => stopTimer();
	});
</script>

{#if visible}
	<div
		class="fixed top-4 right-4 z-[100] max-w-md w-full pointer-events-auto animate-[slideInRight_0.3s_ease-out] {className}"
		role="alert"
		aria-live="polite"
		onmouseenter={stopTimer}
		onmouseleave={startTimer}
	>
		<div
			class="flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm {style.bg}"
		>
			<!-- Icon -->
			<Icon name={style.icon} size={24} class={style.iconColor} />

			<!-- Message -->
			<div class="flex-1 min-w-0">
				<p class="text-sm font-medium {style.text}">
					{message}
				</p>
			</div>

			<!-- Action Button -->
			{#if action}
				<button
					type="button"
					onclick={handleActionClick}
					class="text-sm font-bold {style.text} hover:opacity-75 transition-opacity"
				>
					{action.label}
				</button>
			{/if}

			<!-- Close Button -->
			<button
				type="button"
				onclick={handleClose}
				class="size-6 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-shrink-0"
				aria-label="Close notification"
			>
				<Icon name="close" size={18} class={style.text} />
			</button>
		</div>
	</div>
{/if}

<style>
	@keyframes slideInRight {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>
