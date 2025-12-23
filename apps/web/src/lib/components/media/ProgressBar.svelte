<script lang="ts">
	interface ProgressBarProps {
		value: number;
		max?: number;
		label?: string;
		showPercentage?: boolean;
		color?: string;
		striped?: boolean;
		animated?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		value,
		max = 100,
		label,
		showPercentage = false,
		color,
		striped = false,
		animated = false,
		size = 'md',
		class: className = ''
	}: ProgressBarProps = $props();

	const percentage = $derived(Math.min(Math.max((value / max) * 100, 0), 100));

	const sizeClasses = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3'
	};

	const defaultColor = 'bg-primary';
	const progressColor = $derived(color || defaultColor);

	const stripedPattern = $derived(
		striped
			? 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:1rem_100%]'
			: ''
	);

	const animationClass = $derived(
		animated && striped ? 'animate-[progress_1s_linear_infinite]' : ''
	);
</script>

<div class="w-full {className}">
	{#if label || showPercentage}
		<div class="flex justify-between items-center mb-2">
			{#if label}
				<span class="text-sm font-medium text-slate-700 dark:text-gray-300">{label}</span>
			{/if}
			{#if showPercentage}
				<span class="text-sm font-semibold text-slate-900 dark:text-white">
					{percentage.toFixed(0)}%
				</span>
			{/if}
		</div>
	{/if}

	<div
		class="w-full {sizeClasses[size]} bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden"
	>
		<div
			class="{sizeClasses[size]} {progressColor} rounded-full transition-all duration-300 ease-out {stripedPattern} {animationClass}"
			style="width: {percentage}%"
			role="progressbar"
			aria-valuenow={value}
			aria-valuemin="0"
			aria-valuemax={max}
			aria-label={label || 'Progress'}
		></div>
	</div>
</div>

<style>
	@keyframes progress {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 1rem 0;
		}
	}
</style>
