<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib/stores';
	import { getUnreadCount } from '$lib/services/message.service';
	
	let { children } = $props();

	// Polling for unread message count
	let unreadCountPollingInterval: ReturnType<typeof setInterval> | null = null;
	const UNREAD_COUNT_POLL_INTERVAL_MS = 30000; // Poll every 30 seconds

	function startUnreadCountPolling() {
		if (unreadCountPollingInterval) return;
		unreadCountPollingInterval = setInterval(async () => {
			try {
				await getUnreadCount();
			} catch (error) {
				console.error('Failed to poll unread count:', error);
			}
		}, UNREAD_COUNT_POLL_INTERVAL_MS);
	}

	function stopUnreadCountPolling() {
		if (unreadCountPollingInterval) {
			clearInterval(unreadCountPollingInterval);
			unreadCountPollingInterval = null;
		}
	}

	function handleVisibilityChange() {
		if (document.hidden) {
			stopUnreadCountPolling();
		} else {
			// Fetch immediately when tab becomes visible, then resume polling
			getUnreadCount().catch(err => console.error('Failed to fetch unread count:', err));
			startUnreadCountPolling();
		}
	}

	// Fetch unread message count when user is authenticated
	onMount(() => {
		let isUserAuthenticated = false;

		// Subscribe to auth state changes
		const unsubscribe = isAuthenticated.subscribe(async (authenticated) => {
			isUserAuthenticated = authenticated;
			if (authenticated) {
				try {
					await getUnreadCount();
					startUnreadCountPolling();
				} catch (error) {
					console.error('Failed to fetch unread count:', error);
				}
			} else {
				stopUnreadCountPolling();
			}
		});

		// Pause polling when tab is hidden, resume when visible
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			unsubscribe();
			stopUnreadCountPolling();
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});
</script>

<div class="app">
	{@render children()}
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
