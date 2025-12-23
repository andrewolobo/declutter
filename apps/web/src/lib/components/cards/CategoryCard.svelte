<script lang="ts" module>
	export interface Category {
		id: string;
		name: string;
		icon?: string;
		image?: string;
		postCount: number;
		color?: string;
	}
</script>

<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface Props {
		category: Category;
		size?: 'sm' | 'md' | 'lg';
		onClick?: () => void;
	}

	let { category, size = 'md', onClick }: Props = $props();

	const sizeClasses = {
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};

	const iconSizeMap = {
		sm: 24,
		md: 32,
		lg: 40
	};

	const formatCount = (count: number): string => {
		if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
		if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
		return count.toString();
	};

	const bgColor = $derived(
		category.color || 'bg-gradient-to-br from-primary-500 to-primary-600'
	);
</script>

<div
	class="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:scale-105 transition-all cursor-pointer {sizeClasses[
		size
	]}"
	role="button"
	tabindex="0"
	onclick={onClick}
	onkeydown={(e) => e.key === 'Enter' && onClick?.()}
	aria-label={`${category.name} category with ${category.postCount} posts`}
>
	<!-- Image/Icon Background -->
	<div class="relative mb-3">
		{#if category.image}
			<div class="w-full aspect-video rounded-lg overflow-hidden">
				<img
					src={category.image}
					alt={category.name}
					class="w-full h-full object-cover"
				/>
			</div>
		{:else}
			<div class="w-full aspect-video rounded-lg {bgColor} flex items-center justify-center">
				{#if category.icon}
					<Icon
						name={category.icon}
						size={iconSizeMap[size]}
						class="text-white"
					/>
				{:else}
					<Icon
						name="category"
						size={iconSizeMap[size]}
						class="text-white"
					/>
				{/if}
			</div>
		{/if}

		<!-- Post Count Badge -->
		<div
			class="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-full"
		>
			<span class="text-xs font-semibold text-slate-900 dark:text-white">
				{formatCount(category.postCount)} posts
			</span>
		</div>
	</div>

	<!-- Category Name -->
	<h3
		class="text-lg font-bold text-slate-900 dark:text-white text-center truncate"
	>
		{category.name}
	</h3>
</div>
