<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface IconButtonProps {
		icon: string;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'primary' | 'danger';
		ariaLabel: string;
		badge?: number | boolean;
		disabled?: boolean;
		class?: string;
		onclick?: () => void;
	}

	let {
		icon,
		size = 'md',
		variant = 'default',
		ariaLabel,
		badge,
		disabled = false,
		class: className = '',
		onclick
	}: IconButtonProps = $props();

	const variantClasses = {
		default:
			'text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10',
		primary:
			'text-primary hover:bg-primary/10',
		danger:
			'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
	};

	const sizeClasses = {
		sm: 'size-8',
		md: 'size-10',
		lg: 'size-12'
	};

	const iconSizes = {
		sm: 18,
		md: 24,
		lg: 28
	};

	const badgeSizes = {
		sm: 'min-w-[14px] h-[14px] text-[9px]',
		md: 'min-w-[16px] h-[16px] text-[10px]',
		lg: 'min-w-[18px] h-[18px] text-[11px]'
	};

	const baseClasses =
		'relative inline-flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

	const buttonClasses = $derived(
		[
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<button
	type="button"
	class={buttonClasses}
	aria-label={ariaLabel}
	{disabled}
	{onclick}
>
	<Icon name={icon} size={iconSizes[size]} />
	
	{#if badge}
		<span
			class="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-500 text-white font-bold px-1 {badgeSizes[size]}"
		>
			{typeof badge === 'number' ? (badge > 99 ? '99+' : badge) : ''}
		</span>
	{/if}
</button>
