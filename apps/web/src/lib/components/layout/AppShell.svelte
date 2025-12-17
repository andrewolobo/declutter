<script lang="ts">
	/**
	 * AppShell Component
	 * Main application wrapper with header, sidebar, and content area
	 * Provides responsive layout structure for authenticated pages
	 */
	
	import type { AuthUserDTO } from '$lib/types/auth.types';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';
	import MobileBottomNav from './MobileBottomNav.svelte';
	
	interface Props {
		/** Current authenticated user */
		user?: AuthUserDTO;
		/** Show/hide sidebar */
		showSidebar?: boolean;
		/** Full width layout (no max-width constraint) */
		fullWidth?: boolean;
		/** Current active route */
		activeRoute?: string;
		/** Unread message count for badge */
		unreadMessages?: number;
		/** Children content */
		children?: any;
	}
	
	let {
		user,
		showSidebar = true,
		fullWidth = false,
		activeRoute = '/',
		unreadMessages = 0,
		children
	}: Props = $props();
	
	// Mobile sidebar state
	let mobileSidebarOpen = $state(false);
	
	function toggleMobileSidebar() {
		mobileSidebarOpen = !mobileSidebarOpen;
	}
	
	function closeMobileSidebar() {
		mobileSidebarOpen = false;
	}
</script>

<div class="min-h-screen bg-background-light dark:bg-background-dark">
	<!-- Header -->
	<Header 
		{user} 
		onMenuToggle={toggleMobileSidebar}
	/>
	
	<div class="flex h-[calc(100vh-64px)] overflow-hidden">
		<!-- Desktop Sidebar -->
		{#if showSidebar}
			<aside class="hidden md:block">
				<Sidebar 
					{activeRoute}
					collapsed={false}
				/>
			</aside>
		{/if}
		
		<!-- Mobile Sidebar Overlay -->
		{#if mobileSidebarOpen}
			<div 
				class="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
				onclick={closeMobileSidebar}
				onkeydown={(e) => e.key === 'Escape' && closeMobileSidebar()}
				role="button"
				tabindex="-1"
				aria-label="Close sidebar"
			></div>
			
			<aside 
				class="fixed left-0 top-16 bottom-0 z-50 w-64 bg-white dark:bg-background-dark md:hidden transform transition-transform duration-300"
				style="transform: translateX(0);"
			>
				<Sidebar 
					{activeRoute}
					collapsed={false}
					onNavigate={closeMobileSidebar}
				/>
			</aside>
		{/if}
		
		<!-- Main Content -->
		<main 
			class="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark"
			class:max-w-none={fullWidth}
		>
			<div class="pb-20 md:pb-0">
				{@render children?.()}
			</div>
		</main>
	</div>
	
	<!-- Mobile Bottom Navigation -->
	<div class="md:hidden">
		<MobileBottomNav 
			{activeRoute}
			{unreadMessages}
		/>
	</div>
</div>

<style>
	/* Ensure proper scrolling behavior */
	main {
		-webkit-overflow-scrolling: touch;
	}
</style>
