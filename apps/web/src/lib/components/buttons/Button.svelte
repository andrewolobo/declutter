<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface ButtonProps {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		disabled?: boolean;
		icon?: string;
		iconPosition?: 'left' | 'right';
		fullWidth?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		icon,
		iconPosition = 'left',
		fullWidth = false,
		type = 'button',
		class: className = '',
		onclick,
		children
	}: ButtonProps = $props();

	const variantClasses = {
		primary:
			'bg-primary text-background-dark hover:bg-primary/90 shadow-[0_0_10px_rgba(19,236,236,0.2)] hover:shadow-[0_0_15px_rgba(19,236,236,0.4)]',
		secondary:
			'bg-white dark:bg-white/10 text-slate-900 dark:text-white border-2 border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/20',
		ghost:
			'bg-transparent text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10',
		danger:
			'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]'
	};

	const sizeClasses = {
		sm: 'h-8 px-3 text-sm gap-1.5',
		md: 'h-10 px-4 text-base gap-2',
		lg: 'h-12 px-6 text-lg gap-2.5'
	};

	const iconSizes = {
		sm: 16,
		md: 20,
		lg: 24
	};

	const baseClasses =
		'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

	const buttonClasses = $derived(
		[
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			fullWidth ? 'w-full' : '',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<button {type} class={buttonClasses} disabled={disabled || loading} {onclick}>
	{#if loading}
		<svg
			class="animate-spin"
			width={iconSizes[size]}
			height={iconSizes[size]}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
		<span>Loading...</span>
	{:else}
		{#if icon && iconPosition === 'left'}
			<Icon name={icon} size={iconSizes[size]} />
		{/if}
		{@render children?.()}
		{#if icon && iconPosition === 'right'}
			<Icon name={icon} size={iconSizes[size]} />
		{/if}
	{/if}
</button>
