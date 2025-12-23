<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface ShareButtonProps {
		url: string;
		title: string;
		description?: string;
		image?: string;
		class?: string;
	}

	let {
		url,
		title,
		description = '',
		image,
		class: className = ''
	}: ShareButtonProps = $props();

	let showMenu = $state(false);
	let copied = $state(false);

	const shareOptions = [
		{
			name: 'WhatsApp',
			icon: 'chat',
			color: 'text-green-500',
			action: () => shareToWhatsApp()
		},
		{
			name: 'Facebook',
			icon: 'facebook',
			color: 'text-blue-600',
			action: () => shareToFacebook()
		},
		{
			name: 'Twitter',
			icon: 'close',
			color: 'text-blue-400',
			action: () => shareToTwitter()
		},
		{
			name: 'Copy Link',
			icon: 'content_copy',
			color: 'text-slate-600 dark:text-gray-400',
			action: () => copyLink()
		}
	];

	function toggleMenu() {
		showMenu = !showMenu;
	}

	function closeMenu() {
		showMenu = false;
	}

	async function shareNative() {
		if (navigator.share) {
			try {
				await navigator.share({
					title,
					text: description,
					url
				});
				closeMenu();
			} catch (err) {
				// User cancelled or error occurred
				console.error('Error sharing:', err);
			}
		} else {
			toggleMenu();
		}
	}

	function shareToWhatsApp() {
		const text = `${title}${description ? ' - ' + description : ''}`;
		window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
		closeMenu();
	}

	function shareToFacebook() {
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
		closeMenu();
	}

	function shareToTwitter() {
		const text = `${title}${description ? ' - ' + description : ''}`;
		window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
		closeMenu();
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => {
				copied = false;
				closeMenu();
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<div class="relative inline-block {className}">
	<button
		type="button"
		class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95"
		onclick={shareNative}
		aria-label="Share"
	>
		<Icon name="share" size={20} class="text-slate-600 dark:text-gray-400" />
		<span class="text-sm font-semibold text-slate-700 dark:text-gray-300">Share</span>
	</button>

	{#if showMenu}
		<button
			onclick={closeMenu}
			class="fixed inset-0 z-40"
			aria-label="Close share menu"
		></button>
		<div
			class="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden z-50 min-w-[200px]"
		>
			<div class="p-2">
				<div class="text-xs font-bold text-slate-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
					Share via
				</div>
				{#each shareOptions as option}
					<button
						type="button"
						class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
						onclick={option.action}
					>
						<Icon name={option.icon} size={20} class={option.color} />
						<span class="text-sm font-medium text-slate-900 dark:text-white">
							{option.name === 'Copy Link' && copied ? 'Copied!' : option.name}
						</span>
						{#if option.name === 'Copy Link' && copied}
							<Icon name="check" size={16} class="ml-auto text-green-500" />
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
