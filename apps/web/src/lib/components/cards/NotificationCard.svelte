<script lang="ts" module>
	export interface Notification {
		id: string;
		type: 'like' | 'comment' | 'message' | 'follow' | 'post' | 'admin';
		user: {
			id: string;
			name: string;
			avatar?: string;
		};
		message: string;
		timestamp: Date;
		isRead: boolean;
		link?: string;
		actionLabel?: string;
	}
</script>

<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import Avatar from '$lib/components/media/Avatar.svelte';
	import Button from '$lib/components/buttons/Button.svelte';

	interface Props {
		notification: Notification;
		onMarkRead?: () => void;
		onDismiss?: () => void;
		onAction?: () => void;
	}

	let { notification, onMarkRead, onDismiss, onAction }: Props = $props();

	const iconMap: Record<Notification['type'], string> = {
		like: 'favorite',
		comment: 'chat_bubble',
		message: 'mail',
		follow: 'person_add',
		post: 'shopping_bag',
		admin: 'admin_panel_settings'
	};

	const colorMap: Record<Notification['type'], string> = {
		like: 'text-red-500 bg-red-50 dark:bg-red-900/20',
		comment: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
		message: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20',
		follow: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
		post: 'text-green-500 bg-green-50 dark:bg-green-900/20',
		admin: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
	};

	const formatTimestamp = (date: Date): string => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return date.toLocaleDateString();
	};

	const handleClick = () => {
		if (!notification.isRead) {
			onMarkRead?.();
		}
		if (notification.link) {
			window.location.href = notification.link;
		}
	};

	const cardClasses = $derived(
		`flex items-start gap-3 p-4 rounded-xl transition-all ${
			notification.isRead
				? 'bg-white dark:bg-slate-800'
				: 'bg-primary-50 dark:bg-primary-900/10'
		} border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
			notification.link ? 'cursor-pointer' : ''
		}`
	);
</script>

<div
	class={cardClasses}
	role="button"
	tabindex="0"
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
	aria-label={notification.message}
>
	<!-- Icon Badge -->
	<div
		class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center {colorMap[
			notification.type
		]}"
	>
		<Icon name={iconMap[notification.type]} size={20} fill={1} />
	</div>

	<!-- Avatar -->
	<Avatar src={notification.user.avatar} alt={notification.user.name} size="sm" />

	<!-- Content -->
	<div class="flex-1 min-w-0">
		<!-- Message -->
		<p class="text-sm text-slate-900 dark:text-white mb-1">
			<span class="font-semibold">{notification.user.name}</span>
			<span class="text-slate-600 dark:text-slate-300"> {notification.message}</span>
		</p>

		<!-- Timestamp -->
		<span class="text-xs text-slate-500 dark:text-slate-400">
			{formatTimestamp(notification.timestamp)}
		</span>

		<!-- Action Button -->
		{#if notification.actionLabel && onAction}
			<div class="mt-2">
				<Button
					variant="primary"
					size="sm"
					onclick={(e) => {
						e.stopPropagation();
						onAction?.();
					}}
				>
					{notification.actionLabel}
				</Button>
			</div>
		{/if}
	</div>

	<!-- Dismiss Button -->
	<button
		class="flex-shrink-0 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
		onclick={(e) => {
			e.stopPropagation();
			onDismiss?.();
		}}
		aria-label="Dismiss notification"
	>
		<Icon name="close" size={18} />
	</button>

	<!-- Unread Indicator -->
	{#if !notification.isRead}
		<div
			class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r"
			aria-label="Unread notification"
		></div>
	{/if}
</div>

<style>
	div[role="button"] {
		position: relative;
	}
</style>
