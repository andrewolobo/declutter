<script lang="ts">
	import Avatar from './Avatar.svelte';
	import Icon from '../ui/Icon.svelte';
	import { generateAvatarSet, generateSeedFromEmail } from '$lib/utils/avatar.utils';

	interface AvatarPickerProps {
		email: string;
		selected?: string;
		onselect?: (url: string) => void;
	}

	let { email, selected = $bindable(''), onselect }: AvatarPickerProps = $props();

	// Generate 15 unique avatars based on email
	const avatars = $derived(generateAvatarSet(generateSeedFromEmail(email)));

	function handleSelect(url: string) {
		selected = url;
		onselect?.(url);
	}
</script>

<div class="w-full">
	<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
		Choose Your Profile Picture
	</h3>
	<p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
		Select an avatar or skip to use your initials
	</p>

	<!-- Avatar Grid -->
	<div
		class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4"
	>
		{#each avatars as avatar (avatar.style)}
			<button
				type="button"
				onclick={() => handleSelect(avatar.url)}
				class="relative group focus:outline-none"
				aria-label={`Select ${avatar.style} avatar`}
			>
				<div
					class="relative rounded-lg overflow-hidden transition-all duration-200
					{selected === avatar.url
						? 'ring-4 ring-primary shadow-lg scale-105'
						: 'ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-primary/50 hover:scale-105'}"
				>
					<!-- Avatar Image -->
					<div class="aspect-square bg-slate-100 dark:bg-slate-800 p-2">
						<img
							src={avatar.url}
							alt={avatar.style}
							class="w-full h-full object-cover"
							loading="lazy"
						/>
					</div>

					<!-- Selection Indicator -->
					{#if selected === avatar.url}
						<div
							class="absolute inset-0 bg-primary/10 flex items-center justify-center"
						>
							<div class="bg-primary rounded-full p-1 shadow-lg">
								<Icon name="check" class="text-white" size={20} />
							</div>
						</div>
					{/if}
				</div>

				<!-- Hover effect -->
				<div
					class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
				></div>
			</button>
		{/each}
	</div>
</div>

<style>
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
</style>
