<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		title: string;
		value: number | string;
		icon?: string;
		trend?: number;
		trendLabel?: string;
		color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
		format?: 'number' | 'currency' | 'percentage';
		loading?: boolean;
	}

	let {
		title,
		value,
		icon,
		trend,
		trendLabel,
		color = 'primary',
		format = 'number',
		loading = false
	}: Props = $props();

	const formatValue = (val: number | string): string => {
		if (typeof val === 'string') return val;

		switch (format) {
			case 'currency':
				return new Intl.NumberFormat('en-UG', {
					style: 'currency',
					currency: 'UGX',
					minimumFractionDigits: 0
				}).format(val);
			case 'percentage':
				return `${val.toFixed(1)}%`;
			case 'number':
			default:
				if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
				if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
				return val.toLocaleString();
		}
	};

	const colorClasses = {
		primary: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20',
		success: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
		warning: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
		danger: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
		info: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
	};

	const trendColor = $derived(
		trend !== undefined
			? trend > 0
				? 'text-green-600 dark:text-green-400'
				: trend < 0
					? 'text-red-600 dark:text-red-400'
					: 'text-slate-500 dark:text-slate-400'
			: ''
	);

	const trendIcon = $derived(
		trend !== undefined
			? trend > 0
				? 'trending_up'
				: trend < 0
					? 'trending_down'
					: 'trending_flat'
			: ''
	);
</script>

<article
	class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
>
	<div class="flex items-start justify-between">
		<!-- Content -->
		<div class="flex-1">
			<!-- Title -->
			<h3 class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
				{title}
			</h3>

			<!-- Value -->
			{#if loading}
				<div class="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
			{:else}
				<p class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
					{formatValue(value)}
				</p>
			{/if}

			<!-- Trend -->
			{#if trend !== undefined && !loading}
				<div class="flex items-center gap-1 {trendColor}">
					<Icon name={trendIcon} size={20} />
					<span class="text-sm font-semibold">
						{Math.abs(trend).toFixed(1)}%
					</span>
					{#if trendLabel}
						<span class="text-sm text-slate-500 dark:text-slate-400">
							{trendLabel}
						</span>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Icon -->
		{#if icon}
			<div class="w-12 h-12 rounded-lg flex items-center justify-center {colorClasses[color]}">
				<Icon name={icon} size={24} />
			</div>
		{/if}
	</div>
</article>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
