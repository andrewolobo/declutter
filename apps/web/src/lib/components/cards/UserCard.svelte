<script lang="ts" module>
	export interface User {
		id: string;
		name: string;
		avatar?: string;
		bio?: string;
		verified?: boolean;
		isOnline?: boolean;
		stats?: {
			posts: number;
			followers: number;
			following?: number;
		};
	}
</script>

<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import Avatar from '$lib/components/media/Avatar.svelte';
	import Badge from '$lib/components/media/Badge.svelte';
	import FollowButton from '$lib/components/buttons/FollowButton.svelte';

	interface Props {
		user: User;
		showStats?: boolean;
		showBio?: boolean;
		showFollowButton?: boolean;
		following?: boolean;
		onClick?: () => void;
		onFollow?: (following: boolean) => void;
	}

	let {
		user,
		showStats = true,
		showBio = true,
		showFollowButton = true,
		following: isFollowing = $bindable(false),
		onClick,
		onFollow
	}: Props = $props();

	const handleFollow = (newFollowing: boolean) => {
		isFollowing = newFollowing;
		onFollow?.(newFollowing);
	};

	const formatCount = (count: number): string => {
		if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
		if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
		return count.toString();
	};
</script>

<div
	class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
	role="button"
	tabindex="0"
	onclick={onClick}
	onkeydown={(e) => e.key === 'Enter' && onClick?.()}
>
	<div class="flex items-start gap-4">
		<!-- Avatar -->
		<Avatar
			src={user.avatar}
			alt={user.name}
			size="lg"
			status={user.isOnline ? 'online' : undefined}
			badge={user.verified ? 'verified_user' : undefined}
		/>

		<!-- Content -->
		<div class="flex-1 min-w-0">
			<!-- Name & Verified Badge -->
			<div class="flex items-center gap-2 mb-1">
				<h3 class="text-lg font-bold text-slate-900 dark:text-white truncate">
					{user.name}
				</h3>
				{#if user.verified}
					<Icon
						name="verified"
						size={20}
						fill={1}
						class="text-primary-500 flex-shrink-0"
						aria-label="Verified user"
					/>
				{/if}
			</div>

			<!-- Bio -->
			{#if showBio && user.bio}
				<p class="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
					{user.bio}
				</p>
			{/if}

			<!-- Stats -->
			{#if showStats && user.stats}
				<div class="flex items-center gap-4 mb-3">
					<div class="flex flex-col">
						<span class="text-lg font-bold text-slate-900 dark:text-white">
							{formatCount(user.stats.posts)}
						</span>
						<span class="text-xs text-slate-500 dark:text-slate-400">Posts</span>
					</div>
					<div class="flex flex-col">
						<span class="text-lg font-bold text-slate-900 dark:text-white">
							{formatCount(user.stats.followers)}
						</span>
						<span class="text-xs text-slate-500 dark:text-slate-400">Followers</span>
					</div>
					{#if user.stats.following !== undefined}
						<div class="flex flex-col">
							<span class="text-lg font-bold text-slate-900 dark:text-white">
								{formatCount(user.stats.following)}
							</span>
							<span class="text-xs text-slate-500 dark:text-slate-400">Following</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Follow Button -->
			{#if showFollowButton}
				<FollowButton
					following={isFollowing}
					onToggle={handleFollow}
					onclick={(e) => e.stopPropagation()}
				/>
			{/if}
		</div>
	</div>
</div>
