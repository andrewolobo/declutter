<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import MobileBottomNav from '$lib/components/layout/MobileBottomNav.svelte';
	import PostCard from '$lib/components/cards/PostCard.svelte';
	import type { PostResponseDTO } from '$types/post.types';
	import { postStore } from '$lib/stores/post.store';
	import { getFeed, likePost, unlikePost } from '$lib/services/post.service';

	// Reactive store values
	const feedPosts = $derived($postStore.feedPosts);
	const isLoading = $derived($postStore.feedLoading);
	const hasMore = $derived($postStore.feedHasMore);
	const error = $derived($postStore.feedError);

	// Infinite scroll state
	let currentPage = $state(1);
	let loadMoreTrigger = $state<HTMLElement | undefined>();
	let observer: IntersectionObserver;

	// Load more posts function
	async function loadMore() {
		if (isLoading || !hasMore) return;
		currentPage += 1;
		await getFeed({ page: currentPage, limit: 20 });
	}

	// Handle like/unlike for a post
	async function handleLike(post: PostResponseDTO) {
		try {
			if (post.isLiked) {
				await unlikePost(post.id);
			} else {
				await likePost(post.id);
			}
		} catch (error) {
			console.error('Failed to toggle like:', error);
		}
	}

	// Load initial feed data and setup infinite scroll
	onMount(() => {
		// Reset feed state and load first page
		postStore.resetFeed();
		currentPage = 1;
		getFeed({ page: 1, limit: 20 });

		// Setup infinite scroll observer
		observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting && !isLoading && hasMore) {
					loadMore();
				}
			},
			{
				rootMargin: '100px', // Trigger 100px before element
				threshold: 0.1
			}
		);

		if (loadMoreTrigger) {
			observer.observe(loadMoreTrigger);
		}

		// Cleanup
		return () => {
			observer?.disconnect();
		};
	});

	let activeTab = 'home';
</script>

<svelte:head>
	<title>Marketplace - Tunda Plug</title>
</svelte:head>

<div
	class="relative flex h-screen w-full flex-col md:flex-row overflow-hidden bg-background-light dark:bg-background-dark"
>
	<!-- Side Navigation (Desktop) -->
	<aside class="hidden md:block">
		<Sidebar activeRoute="/browse" collapsed={false} />
	</aside>

	<div class="flex-1 flex flex-col overflow-hidden">
		<!-- Top App Bar -->
		<header
			class="fixed top-0 z-10 w-full md:relative bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm"
		>
			<div class="flex items-center p-4 max-w-2xl mx-auto">
				<div class="flex size-12 shrink-0 items-center md:hidden">
					<!-- Placeholder for logo if needed -->
				</div>
				<h1 class="flex-1 text-center text-lg font-bold text-slate-900 dark:text-white">Home</h1>
				<div class="flex w-12 items-center justify-end gap-2 md:hidden">
					<button
						class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
					>
						<span class="material-symbols-outlined text-2xl">search</span>
					</button>
				</div>
			</div>
		</header>

		<!-- Main Content Feed -->
		<main class="flex-1 overflow-y-auto pb-24 md:pb-0 pt-20 md:pt-0">
			<div class="flex flex-col gap-[5px] max-w-2xl mx-auto">
				{#if isLoading && feedPosts.length === 0}
					<!-- Loading skeleton for initial load -->
					<div class="space-y-[5px] p-4">
						{#each Array(3) as _}
							<div class="animate-pulse bg-base-200 rounded-xl h-[500px]"></div>
						{/each}
					</div>
				{:else if error}
					<!-- Error state -->
					<div class="flex flex-col items-center justify-center py-12 px-4">
						<div class="text-error text-xl mb-4">Failed to load posts</div>
						<p class="text-base-content/60 mb-4 text-center">{error}</p>
						<button
							class="btn btn-primary"
							onclick={() => {
								postStore.resetFeed();
								getFeed({ page: 1, limit: 20 });
							}}
						>
							Try Again
						</button>
					</div>
				{:else if feedPosts.length === 0}
					<!-- Empty state -->
					<div class="flex flex-col items-center justify-center py-12 px-4">
						<div class="text-2xl mb-4">No posts found</div>
						<p class="text-base-content/60">Check back later for new listings</p>
					</div>
				{:else}
					<!-- Feed posts -->
					{#each feedPosts as post (post.id)}
						<PostCard {post} variant="feed" showUser={true} onLike={() => handleLike(post)} />
					{/each}

					<!-- Infinite scroll trigger -->
					{#if hasMore}
						<div bind:this={loadMoreTrigger} class="flex justify-center items-center py-8">
							{#if isLoading}
								<div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
									<div
										class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"
									></div>
									<span class="text-sm font-medium">Loading more posts...</span>
								</div>
							{/if}
						</div>
					{/if}
				{/if}
			</div>
		</main>

		<!-- Bottom Navigation Bar (Mobile Only) -->
		<MobileBottomNav activeRoute="/browse" />
	</div>
</div>
