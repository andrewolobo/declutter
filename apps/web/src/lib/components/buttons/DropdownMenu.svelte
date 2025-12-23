<script lang="ts" module>
	export interface MenuItem {
		label: string;
		icon?: string;
		action: () => void;
		danger?: boolean;
		divider?: boolean;
	}
</script>

<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface DropdownMenuProps {
		items: MenuItem[];
		trigger?: 'click' | 'hover';
		position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
		align?: 'start' | 'end';
		class?: string;
		children?: any;
	}

	let {
		items,
		trigger = 'click',
		position = 'bottom-right',
		align = 'end',
		class: className = '',
		children
	}: DropdownMenuProps = $props();

	let isOpen = $state(false);
	let selectedIndex = $state(-1);
	let menuRef = $state<HTMLDivElement>();

	function toggleMenu() {
		isOpen = !isOpen;
		if (isOpen) {
			selectedIndex = -1;
		}
	}

	function openMenu() {
		if (trigger === 'hover') {
			isOpen = true;
		}
	}

	function closeMenu() {
		isOpen = false;
		selectedIndex = -1;
	}

	function handleItemClick(item: MenuItem) {
		if (item.divider) return;
		item.action();
		closeMenu();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen) return;

		const menuItems = items.filter((item) => !item.divider);

		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				closeMenu();
				break;
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = (selectedIndex + 1) % menuItems.length;
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = selectedIndex <= 0 ? menuItems.length - 1 : selectedIndex - 1;
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < menuItems.length) {
					handleItemClick(menuItems[selectedIndex]);
				}
				break;
		}
	}

	function getPositionClasses() {
		const positions = {
			'bottom-left': 'top-full left-0 mt-2',
			'bottom-right': 'top-full right-0 mt-2',
			'top-left': 'bottom-full left-0 mb-2',
			'top-right': 'bottom-full right-0 mb-2'
		};
		return positions[position];
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative inline-block {className}">
	<!-- Trigger Button -->
	<div
		role="button"
		tabindex="0"
		onclick={trigger === 'click' ? toggleMenu : undefined}
		onmouseenter={trigger === 'hover' ? openMenu : undefined}
		onmouseleave={trigger === 'hover' ? closeMenu : undefined}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggleMenu();
			}
		}}
	>
		{@render children?.()}
	</div>

	<!-- Dropdown Menu -->
	{#if isOpen}
		<button
			onclick={closeMenu}
			class="fixed inset-0 z-40"
			aria-label="Close menu"
			tabindex="-1"
		></button>
		<div
			bind:this={menuRef}
			role="menu"
			class="absolute {getPositionClasses()} z-50 min-w-[200px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
		>
			<div class="py-2">
				{#each items as item, index}
					{#if item.divider}
						<div class="h-px bg-gray-200 dark:bg-white/10 my-2"></div>
					{:else}
						{@const menuIndex = items.filter((i, idx) => !i.divider && idx < index).length}
						<button
							type="button"
							role="menuitem"
							class="w-full flex items-center gap-3 px-4 py-2.5 transition-colors {selectedIndex ===
							menuIndex
								? 'bg-gray-100 dark:bg-white/10'
								: ''} {item.danger
								? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
								: 'text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'}"
							onclick={() => handleItemClick(item)}
						>
							{#if item.icon}
								<Icon
									name={item.icon}
									size={20}
									class={item.danger ? 'text-red-500' : 'text-slate-600 dark:text-gray-400'}
								/>
							{/if}
							<span class="text-sm font-medium flex-1 text-left">
								{item.label}
							</span>
						</button>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>
