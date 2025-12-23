<script lang="ts" module>
	export interface Conversation {
		id: string;
		user: {
			id: string;
			name: string;
			avatar?: string;
			isOnline?: boolean;
		};
		lastMessage: {
			content: string;
			timestamp: Date;
			isRead: boolean;
			senderId: string;
		};
		unreadCount: number;
	}
</script>

<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import Avatar from '$lib/components/media/Avatar.svelte';
	import Badge from '$lib/components/media/Badge.svelte';

	interface Props {
		conversation: Conversation;
		active?: boolean;
		onClick?: () => void;
	}

	let { conversation, active = false, onClick }: Props = $props();

	const formatTimestamp = (date: Date): string => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes}m`;
		if (hours < 24) return `${hours}h`;
		if (days < 7) return `${days}d`;
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	};

	const truncateMessage = (message: string, maxLength: number = 50): string => {
		if (message.length <= maxLength) return message;
		return message.substring(0, maxLength) + '...';
	};

	const cardClasses = $derived(
		`flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer ${
			active
				? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
				: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
		}`
	);
</script>

<div
	class={cardClasses}
	role="button"
	tabindex="0"
	onclick={onClick}
	onkeydown={(e) => e.key === 'Enter' && onClick?.()}
	aria-label={`Conversation with ${conversation.user.name}`}
>
	<!-- Avatar with Online Status -->
	<div class="relative flex-shrink-0">
		<Avatar
			src={conversation.user.avatar}
			alt={conversation.user.name}
			size="md"
			status={conversation.user.isOnline ? 'online' : undefined}
		/>
	</div>

	<!-- Content -->
	<div class="flex-1 min-w-0">
		<!-- Name & Timestamp -->
		<div class="flex items-center justify-between mb-1">
			<h3
				class="text-base font-semibold text-slate-900 dark:text-white truncate"
			>
				{conversation.user.name}
			</h3>
			<span
				class="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2"
			>
				{formatTimestamp(conversation.lastMessage.timestamp)}
			</span>
		</div>

		<!-- Last Message -->
		<div class="flex items-center justify-between gap-2">
			<p
				class={`text-sm truncate ${
					conversation.lastMessage.isRead
						? 'text-slate-600 dark:text-slate-300'
						: 'text-slate-900 dark:text-white font-semibold'
				}`}
			>
				{truncateMessage(conversation.lastMessage.content)}
			</p>

			<!-- Unread Badge -->
			{#if conversation.unreadCount > 0}
				<Badge
					variant="count"
					color="primary"
					count={conversation.unreadCount}
				/>
			{/if}
		</div>
	</div>

	<!-- Read/Unread Indicator -->
	{#if !conversation.lastMessage.isRead}
		<div
			class="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0"
			aria-label="Unread message"
		></div>
	{/if}
</div>
