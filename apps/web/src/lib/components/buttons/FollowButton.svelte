<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface FollowButtonProps {
		following: boolean;
		userId: string;
		disabled?: boolean;
		class?: string;
		onToggle?: (following: boolean) => void;
	}

	let {
		following = $bindable(),
		userId,
		disabled = false,
		class: className = '',
		onToggle
	}: FollowButtonProps = $props();

	let loading = $state(false);
	let isHovering = $state(false);

	async function handleClick() {
		if (disabled || loading) return;

		loading = true;
		const newFollowing = !following;

		try {
			// Optimistic update
			following = newFollowing;
			onToggle?.(newFollowing);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));
		} catch (error) {
			// Revert on error
			following = !newFollowing;
			console.error('Failed to update follow status:', error);
		} finally {
			loading = false;
		}
	}

	function getButtonText() {
		if (loading) return 'Loading...';
		if (!following) return 'Follow';
		if (isHovering) return 'Unfollow';
		return 'Following';
	}

	function getButtonClasses() {
		const base =
			'inline-flex items-center gap-2 px-4 h-9 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

		if (following) {
			if (isHovering) {
				return `${base} bg-red-50 dark:bg-red-500/10 border-2 border-red-500 text-red-500`;
			}
			return `${base} bg-white dark:bg-white/10 border-2 border-gray-200 dark:border-white/20 text-slate-900 dark:text-white`;
		}

		return `${base} bg-primary text-background-dark shadow-[0_0_10px_rgba(19,236,236,0.2)] hover:shadow-[0_0_15px_rgba(19,236,236,0.4)]`;
	}
</script>

<button
	type="button"
	class="{getButtonClasses()} {className}"
	{disabled}
	onclick={handleClick}
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
	aria-label={following ? 'Unfollow user' : 'Follow user'}
>
	{#if loading}
		<svg
			class="animate-spin"
			width="16"
			height="16"
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
	{:else if following && isHovering}
		<Icon name="person_remove" size={18} />
	{:else if following}
		<Icon name="check" size={18} />
	{:else}
		<Icon name="person_add" size={18} />
	{/if}

	<span>{getButtonText()}</span>
</button>
