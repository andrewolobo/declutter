<script lang="ts">
	import type { PostResponseDTO } from '$types/post.types';
	import { PostStatus } from '$types/post.types';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Avatar from '$lib/components/media/Avatar.svelte';
	import Badge from '$lib/components/media/Badge.svelte';
	import ImageCarousel from '$lib/components/media/ImageCarousel.svelte';
	import LikeButton from '$lib/components/buttons/LikeButton.svelte';
	import DropdownMenu, { type MenuItem } from '$lib/components/buttons/DropdownMenu.svelte';

	interface Props {
		post: PostResponseDTO;
		variant?: 'feed' | 'grid' | 'list';
		showUser?: boolean;
		onLike?: () => void;
		onClick?: () => void;
		onEdit?: () => void;
		onDelete?: () => void;
	}

	let {
		post,
		variant = 'feed',
		showUser = true,
		onLike,
		onClick,
		onEdit,
		onDelete
	}: Props = $props();

	// Map API fields to display format
	const userName = $derived(post.user.fullName);
	const userAvatar = $derived(post.user.profilePictureUrl);
	const imageUrls = $derived(post.images.map((img) => img.imageUrl));
	
	// Derive like state from post (reactive to store updates)
	const liked = $derived(post.isLiked ?? false);
	const likesCount = $derived(post.likeCount);

	const handleLike = () => {
		onLike?.();
	};

	const menuItems = $derived.by(() => {
		const items: MenuItem[] = [];
		if (onEdit) items.push({ icon: 'edit', label: 'Edit Post', onClick: onEdit });
		if (onDelete)
			items.push({ icon: 'delete', label: 'Delete Post', onClick: onDelete, danger: true });
		if (!onEdit && !onDelete) {
			items.push(
				{ icon: 'flag', label: 'Report Post', onClick: () => {} },
				{ icon: 'block', label: 'Block User', onClick: () => {}, danger: true }
			);
		}
		return items;
	});

	const statusColor = $derived(
		post.status === PostStatus.ACTIVE
			? 'success'
			: post.status === PostStatus.EXPIRED
				? 'danger'
				: 'warning'
	);

	const formatDate = (date: Date | string) => {
		const now = new Date();
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		const diff = now.getTime() - dateObj.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return dateObj.toLocaleDateString();
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-UG', {
			style: 'currency',
			currency: 'UGX',
			minimumFractionDigits: 0
		}).format(price);
	};

	const cardClasses = $derived(
		variant === 'feed'
			? 'flex flex-col'
			: variant === 'grid'
				? 'flex flex-col'
				: 'flex flex-row gap-4'
	);

	const imageContainerClasses = $derived(
		variant === 'feed'
			? 'w-full aspect-[4/3]'
			: variant === 'grid'
				? 'w-full aspect-square'
				: 'w-32 h-32 flex-shrink-0'
	);
</script>

<div
	class="bg-[rgb(16_34_34/0.8)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700 {cardClasses}"
	role="button"
	tabindex="0"
	onclick={onClick}
	onkeydown={(e) => e.key === 'Enter' && onClick?.()}
>
	<!-- Image Section -->
	<div class={imageContainerClasses}>
		{#if imageUrls.length > 0}
			<ImageCarousel images={imageUrls} showThumbnails={false} autoPlay={false} />
		{:else}
			<div
				class="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center"
			>
				<Icon name="image" size={48} class="text-slate-400 dark:text-slate-500" />
			</div>
		{/if}
	</div>

	<!-- Content Section -->
	<div class="p-4 flex-1 flex flex-col">
		<!-- Header: User Info & Menu -->
		{#if showUser}
			<div class="flex items-center justify-between mb-3">
				<div class="flex items-center gap-2">
					<Avatar
						src={userAvatar}
						alt={userName}
						size="sm"
						onclick={() => {
							/* Navigate to user profile */
						}}
					/>
					<div class="flex flex-col">
						<span class="text-sm font-semibold text-slate-900 dark:text-white">
							{userName}
						</span>
						<span class="text-xs text-slate-500 dark:text-slate-400">
							{formatDate(post.createdAt)}
						</span>
					</div>
				</div>
				<DropdownMenu items={menuItems} align="end">
					{#snippet trigger()}
						<button
							class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
							aria-label="More options"
						>
							<Icon name="more_vert" size={20} />
						</button>
					{/snippet}
				</DropdownMenu>
			</div>
		{/if}

		<!-- Title & Status -->
		<div class="flex items-start justify-between gap-2 mb-2">
			<h3
				class="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 flex-1"
			>
				{post.title}
			</h3>
			<Badge variant="status" color={statusColor} label={post.status} />
		</div>

		<!-- Description -->
		{#if variant === 'feed'}
			<p class="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
				{post.description}
			</p>
		{/if}

		<!-- Location & Price -->
		<div class="flex items-center justify-between mb-3 mt-auto">
			<div class="flex items-center gap-1 text-slate-500 dark:text-slate-400">
				<Icon name="location_on" size={16} />
				<span class="text-sm">{post.location}</span>
			</div>
			<span class="text-xl font-bold text-primary-600 dark:text-primary-400">
				{formatPrice(post.price)}
			</span>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
			<LikeButton {liked} count={likesCount} onToggle={handleLike} />
			<button
				class="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
				onclick={(e) => {
					e.stopPropagation();
					// Handle message action
				}}
			>
				<Icon name="chat_bubble_outline" size={20} />
				<span class="text-sm font-medium">Message</span>
			</button>
			<button
				class="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ml-auto"
				onclick={(e) => {
					e.stopPropagation();
					// Handle share action
				}}
			>
				<Icon name="share" size={20} />
				<span class="text-sm font-medium">Share</span>
			</button>
		</div>
	</div>
</div>
