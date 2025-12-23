<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface AvatarProps {
		src?: string;
		alt: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		status?: 'online' | 'offline' | 'away';
		badge?: string;
		editable?: boolean;
		class?: string;
		onclick?: () => void;
	}

	let {
		src,
		alt,
		size = 'md',
		status,
		badge,
		editable = false,
		class: className = '',
		onclick
	}: AvatarProps = $props();

	const sizeClasses = {
		xs: 'size-6 text-xs',
		sm: 'size-8 text-sm',
		md: 'size-10 text-base',
		lg: 'size-12 text-lg',
		xl: 'size-16 text-xl'
	};

	const statusColors = {
		online: 'bg-green-500',
		offline: 'bg-gray-400',
		away: 'bg-yellow-500'
	};

	const statusSizes = {
		xs: 'size-1.5 border',
		sm: 'size-2 border',
		md: 'size-2.5 border-2',
		lg: 'size-3 border-2',
		xl: 'size-4 border-2'
	};

	const badgeIconSizes = {
		xs: 10,
		sm: 12,
		md: 14,
		lg: 16,
		xl: 20
	};

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	const initials = $derived(getInitials(alt));
</script>

{#if onclick}
	<button
		type="button"
		class="relative inline-block {sizeClasses[size]} {className}"
		{onclick}
	>
		<!-- Avatar Image or Initials -->
		<div
			class="relative {sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-bold text-slate-900 dark:text-white ring-2 ring-white dark:ring-slate-800 cursor-pointer hover:opacity-80 transition-opacity"
		>
			{#if src}
				<img {src} {alt} class="size-full object-cover" />
			{:else}
				<span class="select-none">{initials}</span>
			{/if}

			<!-- Editable Overlay -->
			{#if editable}
				<div
					class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
				>
					<Icon name="photo_camera" size={badgeIconSizes[size]} class="text-white" />
				</div>
			{/if}
		</div>

		<!-- Status Indicator -->
		{#if status}
			<span
				class="absolute bottom-0 right-0 {statusSizes[size]} {statusColors[status]} rounded-full border-white dark:border-slate-800"
				aria-label={`Status: ${status}`}
			></span>
		{/if}

		<!-- Badge Icon -->
		{#if badge}
			<span
				class="absolute -top-0.5 -right-0.5 flex items-center justify-center size-5 bg-primary rounded-full ring-2 ring-white dark:ring-slate-800"
			>
				<Icon name={badge} size={badgeIconSizes[size]} class="text-background-dark" />
			</span>
		{/if}
	</button>
{:else}
	<div class="relative inline-block {sizeClasses[size]} {className}">
		<!-- Avatar Image or Initials -->
		<div
			class="relative {sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-bold text-slate-900 dark:text-white ring-2 ring-white dark:ring-slate-800"
		>
			{#if src}
				<img {src} {alt} class="size-full object-cover" />
			{:else}
				<span class="select-none">{initials}</span>
			{/if}

			<!-- Editable Overlay -->
			{#if editable}
				<div
					class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
				>
					<Icon name="photo_camera" size={badgeIconSizes[size]} class="text-white" />
				</div>
			{/if}
		</div>

		<!-- Status Indicator -->
		{#if status}
			<span
				class="absolute bottom-0 right-0 {statusSizes[size]} {statusColors[status]} rounded-full border-white dark:border-slate-800"
				aria-label={`Status: ${status}`}
			></span>
		{/if}

		<!-- Badge Icon -->
		{#if badge}
			<span
				class="absolute -top-0.5 -right-0.5 flex items-center justify-center size-5 bg-primary rounded-full ring-2 ring-white dark:ring-slate-800"
			>
				<Icon name={badge} size={badgeIconSizes[size]} class="text-background-dark" />
			</span>
		{/if}
	</div>
{/if}
