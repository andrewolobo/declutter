<script context="module" lang="ts">
	export interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	export let label: string | undefined = undefined;
	export let options: SelectOption[] = [];
	export let value: string | string[] = '';
	export let placeholder: string = 'Select an option';
	export let error: string | undefined = undefined;
	export let disabled: boolean = false;
	export let searchable: boolean = false;
	export let multiple: boolean = false;

	const dispatch = createEventDispatcher();

	let isOpen = false;
	let searchQuery = '';
	let selectElement: HTMLDivElement;

	function toggleDropdown() {
		if (!disabled) {
			isOpen = !isOpen;
			if (!isOpen) {
				searchQuery = '';
			}
		}
	}

	function handleSelect(option: SelectOption) {
		if (option.disabled) return;

		if (multiple) {
			const values = Array.isArray(value) ? value : [];
			if (values.includes(option.value)) {
				value = values.filter(v => v !== option.value);
			} else {
				value = [...values, option.value];
			}
		} else {
			value = option.value;
			isOpen = false;
		}

		dispatch('select', value);
	}

	function handleClickOutside(event: MouseEvent) {
		if (selectElement && !selectElement.contains(event.target as Node)) {
			isOpen = false;
			searchQuery = '';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;

		if (event.key === 'Escape') {
			isOpen = false;
			searchQuery = '';
		}
	}

	$: filteredOptions = searchable && searchQuery
		? options.filter(option =>
				option.label.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: options;

	$: selectedLabel = multiple
		? Array.isArray(value) && value.length > 0
			? `${value.length} selected`
			: placeholder
		: options.find(opt => opt.value === value)?.label || placeholder;

	$: hasError = !!error;
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div class="select-wrapper">
	{#if label}
		<label for="select-{label}" class:disabled>
			{label}
		</label>
	{/if}

	<div
		bind:this={selectElement}
		class="select-container"
		class:open={isOpen}
		class:error={hasError}
		class:disabled
	>
		<button
			type="button"
			id="select-{label}"
			class="select-trigger"
			class:placeholder={!value || (Array.isArray(value) && value.length === 0)}
			on:click={toggleDropdown}
			{disabled}
		>
			<span class="select-value">{selectedLabel}</span>
			<Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} />
		</button>

		{#if isOpen}
			<div class="select-dropdown">
				{#if searchable}
					<div class="search-box">
						<Icon name="search" size={16} />
						<input
							type="text"
							placeholder="Search..."
							bind:value={searchQuery}
							on:click|stopPropagation
						/>
					</div>
				{/if}

				<div class="select-options">
					{#if filteredOptions.length === 0}
						<div class="empty-state">No options found</div>
					{:else}
						{#each filteredOptions as option}
							{@const isSelected = multiple
								? Array.isArray(value) && value.includes(option.value)
								: value === option.value}
							<button
								type="button"
								class="select-option"
								class:selected={isSelected}
								class:disabled={option.disabled}
								on:click={() => handleSelect(option)}
								disabled={option.disabled}
							>
								{#if multiple}
									<div class="checkbox" class:checked={isSelected}>
										{#if isSelected}
											<Icon name="check" size={14} />
										{/if}
									</div>
								{/if}
								<span>{option.label}</span>
								{#if isSelected && !multiple}
									<Icon name="check" size={16} />
								{/if}
							</button>
						{/each}
					{/if}
				</div>
			</div>
		{/if}
	</div>

	{#if error}
		<span class="error-message">{error}</span>
	{/if}
</div>

<style>
	.select-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		position: relative;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	label.disabled {
		color: var(--text-disabled);
	}

	.select-container {
		position: relative;
	}

	.select-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		color: var(--text-primary);
		background-color: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		outline: none;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.select-trigger:hover:not(:disabled) {
		border-color: var(--border-hover);
	}

	.select-container.open .select-trigger {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px var(--primary-color-alpha);
	}

	.select-trigger:disabled {
		background-color: var(--disabled-bg);
		color: var(--text-disabled);
		cursor: not-allowed;
		opacity: 0.6;
	}

	.select-trigger.placeholder {
		color: var(--text-tertiary);
	}

	.select-container.error .select-trigger {
		border-color: var(--error-color);
	}

	.select-container.error.open .select-trigger {
		box-shadow: 0 0 0 3px var(--error-color-alpha);
	}

	.select-value {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.select-dropdown {
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
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		border-bottom: 1px solid var(--border-color);
		color: var(--text-tertiary);
	}

	.search-box input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 0.875rem;
		color: var(--text-primary);
		background: transparent;
	}

	.select-options {
		overflow-y: auto;
		padding: 0.25rem;
	}

	.select-option {
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

	.select-option:hover:not(:disabled) {
		background-color: var(--hover-bg);
	}

	.select-option.selected {
		background-color: var(--primary-color-alpha);
		color: var(--primary-color);
	}

	.select-option.disabled {
		color: var(--text-disabled);
		cursor: not-allowed;
		opacity: 0.5;
	}

	.select-option span {
		flex: 1;
	}

	.checkbox {
		width: 18px;
		height: 18px;
		border: 2px solid var(--border-color);
		border-radius: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.checkbox.checked {
		background-color: var(--primary-color);
		border-color: var(--primary-color);
		color: white;
	}

	.empty-state {
		padding: 1rem;
		text-align: center;
		color: var(--text-tertiary);
		font-size: 0.875rem;
	}

	.error-message {
		font-size: 0.8125rem;
		color: var(--error-color);
		margin-top: -0.25rem;
	}

	/* Dark mode adjustments */
	:global(.dark) .select-trigger {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
		color: var(--dark-text-primary);
	}

	:global(.dark) .select-dropdown {
		background-color: var(--dark-dropdown-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .search-box {
		border-color: var(--dark-border-color);
	}

	:global(.dark) .select-option:hover:not(:disabled) {
		background-color: var(--dark-hover-bg);
	}
</style>
