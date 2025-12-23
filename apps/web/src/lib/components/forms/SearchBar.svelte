<script context="module" lang="ts">
	export interface SearchFilter {
		id: string;
		label: string;
		active: boolean;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { BaseInputProps } from './types';

	export let label: string | undefined = undefined;
	export let error: string | undefined = undefined;
	export let placeholder: string = 'Search...';
	export let value: string = '';
	export let category: string = '';
	export let filters: SearchFilter[] = [];
	export let suggestions: string[] = [];
	export let loading: boolean = false;
	export let required: boolean = false;
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();

	let focused = false;
	let showSuggestions = false;
	let selectedSuggestionIndex = -1;
	let inputElement: HTMLInputElement;
	let searchBarElement: HTMLDivElement;

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		showSuggestions = value.length > 0 && suggestions.length > 0;
		selectedSuggestionIndex = -1;
		dispatch('input', value);
	}

	function handleSearch() {
		if (value.trim()) {
			dispatch('search', value);
			showSuggestions = false;
		}
	}

	function handleClear() {
		value = '';
		showSuggestions = false;
		selectedSuggestionIndex = -1;
		inputElement?.focus();
		dispatch('clear');
	}

	function handleFocus() {
		focused = true;
		if (value && suggestions.length > 0) {
			showSuggestions = true;
		}
	}

	function handleBlur() {
		focused = false;
		// Delay to allow clicking on suggestions
		setTimeout(() => {
			showSuggestions = false;
		}, 200);
	}

	function selectSuggestion(suggestion: string) {
		value = suggestion;
		showSuggestions = false;
		dispatch('search', value);
	}

	function toggleFilter(filterId: string) {
		filters = filters.map((f) => (f.id === filterId ? { ...f, active: !f.active } : f));
		dispatch('filterChange', filters);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!showSuggestions) {
			if (event.key === 'Enter') {
				event.preventDefault();
				handleSearch();
			}
			return;
		}

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedSuggestionIndex = Math.min(
					selectedSuggestionIndex + 1,
					suggestions.length - 1
				);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
				break;
			case 'Enter':
				event.preventDefault();
				if (selectedSuggestionIndex >= 0) {
					selectSuggestion(suggestions[selectedSuggestionIndex]);
				} else {
					handleSearch();
				}
				break;
			case 'Escape':
				event.preventDefault();
				showSuggestions = false;
				selectedSuggestionIndex = -1;
				break;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (searchBarElement && !searchBarElement.contains(event.target as Node)) {
			showSuggestions = false;
		}
	}

	$: hasValue = value.length > 0;
	$: activeFilters = filters.filter((f) => f.active);
</script>

<svelte:window on:click={handleClickOutside} />

<div bind:this={searchBarElement} class="search-bar-wrapper">
	<div class="search-bar" class:focused>
		<div class="search-icon">
			<Icon name="search" size={20} />
		</div>

		<input
			bind:this={inputElement}
			type="text"
			{placeholder}
			{value}
			on:input={handleInput}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:keydown={handleKeydown}
			class="search-input"
		/>

		{#if loading}
			<div class="loading-spinner">
				<Icon name="loader" size={20} />
			</div>
		{:else if hasValue}
			<button type="button" class="clear-button" on:click={handleClear}>
				<Icon name="x" size={20} />
			</button>
		{/if}

		{#if filters.length > 0}
			<button type="button" class="filter-button" title="Filters">
				<Icon name="filter" size={20} />
				{#if activeFilters.length > 0}
					<span class="filter-badge">{activeFilters.length}</span>
				{/if}
			</button>
		{/if}
	</div>

	{#if filters.length > 0 && activeFilters.length > 0}
		<div class="filter-chips">
			{#each activeFilters as filter}
				<button
					type="button"
					class="filter-chip"
					on:click={() => toggleFilter(filter.id)}
				>
					<span>{filter.label}</span>
					<Icon name="x" size={14} />
				</button>
			{/each}
		</div>
	{/if}

	{#if showSuggestions && suggestions.length > 0}
		<div class="suggestions-dropdown">
			{#each suggestions as suggestion, index}
				<button
					type="button"
					class="suggestion-item"
					class:selected={index === selectedSuggestionIndex}
					on:click={() => selectSuggestion(suggestion)}
				>
					<Icon name="search" size={16} />
					<span>{suggestion}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.search-bar-wrapper {
		position: relative;
		width: 100%;
	}

	.search-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background-color: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.search-bar:hover {
		border-color: var(--border-hover);
	}

	.search-bar.focused {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px var(--primary-color-alpha);
	}

	.search-icon {
		color: var(--text-tertiary);
		display: flex;
		align-items: center;
	}

	.search-input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 0.9375rem;
		color: var(--text-primary);
		background: transparent;
	}

	.search-input::placeholder {
		color: var(--text-tertiary);
	}

	.loading-spinner {
		color: var(--primary-color);
		display: flex;
		align-items: center;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.clear-button,
	.filter-button {
		padding: 0.25rem;
		background: transparent;
		border: none;
		color: var(--text-tertiary);
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.clear-button:hover,
	.filter-button:hover {
		background-color: var(--hover-bg);
		color: var(--text-primary);
	}

	.filter-badge {
		position: absolute;
		top: -4px;
		right: -4px;
		min-width: 16px;
		height: 16px;
		padding: 0 4px;
		font-size: 0.625rem;
		font-weight: 600;
		color: white;
		background-color: var(--primary-color);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.filter-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.filter-chip {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.625rem;
		font-size: 0.8125rem;
		color: var(--primary-color);
		background-color: var(--primary-color-alpha);
		border: 1px solid var(--primary-color);
		border-radius: 1rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-chip:hover {
		background-color: var(--primary-color);
		color: white;
	}

	.suggestions-dropdown {
		position: absolute;
		top: calc(100% + 0.25rem);
		left: 0;
		right: 0;
		background-color: var(--dropdown-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		max-height: 300px;
		overflow-y: auto;
		padding: 0.25rem;
	}

	.suggestion-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 0.75rem;
		font-size: 0.9375rem;
		color: var(--text-primary);
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
	}

	.suggestion-item:hover,
	.suggestion-item.selected {
		background-color: var(--hover-bg);
	}

	.suggestion-item span {
		flex: 1;
	}

	/* Dark mode adjustments */
	:global(.dark) .search-bar {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .search-bar:hover {
		border-color: var(--dark-border-hover);
	}

	:global(.dark) .search-input {
		color: var(--dark-text-primary);
	}

	:global(.dark) .search-input::placeholder {
		color: var(--dark-text-tertiary);
	}

	:global(.dark) .clear-button:hover,
	:global(.dark) .filter-button:hover {
		background-color: var(--dark-hover-bg);
	}

	:global(.dark) .suggestions-dropdown {
		background-color: var(--dark-dropdown-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .suggestion-item:hover,
	:global(.dark) .suggestion-item.selected {
		background-color: var(--dark-hover-bg);
	}
</style>
