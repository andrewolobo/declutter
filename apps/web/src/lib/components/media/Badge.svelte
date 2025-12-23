<script lang="ts">
	interface BadgeProps {
		variant?: 'status' | 'count' | 'label';
		color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
		size?: 'sm' | 'md' | 'lg';
		dot?: boolean;
		pulse?: boolean;
		class?: string;
		children?: any;
	}

	let {
		variant = 'label',
		color = 'primary',
		size = 'md',
		dot = false,
		pulse = false,
		class: className = '',
		children
	}: BadgeProps = $props();

	const colorClasses = {
		primary: 'bg-primary/20 text-primary dark:bg-primary/30',
		success: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
		warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
		danger: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
		info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
	};

	const dotColorClasses = {
		primary: 'bg-primary',
		success: 'bg-green-500',
		warning: 'bg-yellow-500',
		danger: 'bg-red-500',
		info: 'bg-blue-500'
	};

	const sizeClasses = {
		sm: 'text-xs px-2 py-0.5 gap-1',
		md: 'text-sm px-2.5 py-1 gap-1.5',
		lg: 'text-base px-3 py-1.5 gap-2'
	};

	const dotSizes = {
		sm: 'size-1.5',
		md: 'size-2',
		lg: 'size-2.5'
	};

	const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full';

	const badgeClasses = $derived(
		[baseClasses, colorClasses[color], sizeClasses[size], className].filter(Boolean).join(' ')
	);
</script>

{#if variant === 'status' && dot}
	<!-- Status dot only -->
	<span
		class="relative inline-flex {dotSizes[size]} rounded-full {dotColorClasses[color]} {className}"
	>
		{#if pulse}
			<span
				class="absolute inline-flex size-full rounded-full {dotColorClasses[color]} opacity-75 animate-ping"
			></span>
		{/if}
	</span>
{:else if variant === 'count'}
	<!-- Count badge (typically small, circular) -->
	<span
		class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full {colorClasses[color]} {className}"
	>
		{@render children?.()}
	</span>
{:else}
	<!-- Label badge (pill shape) -->
	<span class={badgeClasses}>
		{#if dot}
			<span class="relative inline-flex {dotSizes[size]} rounded-full {dotColorClasses[color]}">
				{#if pulse}
					<span
						class="absolute inline-flex size-full rounded-full {dotColorClasses[color]} opacity-75 animate-ping"
					></span>
				{/if}
			</span>
		{/if}
		{@render children?.()}
	</span>
{/if}
