<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	export let value: number = 0;
	export let currency: string = 'UGX';
	export let min: number = 0;
	export let max: number | undefined = undefined;
	export let label: string | undefined = undefined;
	export let error: string | undefined = undefined;
	export let placeholder: string = '0';

	const dispatch = createEventDispatcher();

	let inputElement: HTMLInputElement;
	let displayValue = '';
	let focused = false;

	const currencySymbols: Record<string, string> = {
		UGX: 'UGX',
		USD: '$',
		EUR: '€',
		GBP: '£'
	};

	function formatNumber(num: number): string {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	function parseNumber(str: string): number {
		return parseInt(str.replace(/,/g, ''), 10) || 0;
	}

	function updateDisplayValue() {
		if (focused) {
			displayValue = value ? value.toString() : '';
		} else {
			displayValue = value ? formatNumber(value) : '';
		}
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const rawValue = target.value.replace(/[^0-9]/g, '');
		let numValue = parseInt(rawValue, 10) || 0;

		// Apply min/max constraints
		if (numValue < min) numValue = min;
		if (max !== undefined && numValue > max) numValue = max;

		value = numValue;
		displayValue = rawValue;
		dispatch('change', value);
	}

	function handleFocus() {
		focused = true;
		updateDisplayValue();
	}

	function handleBlur() {
		focused = false;
		updateDisplayValue();
	}

	function increment() {
		const step = 1000;
		let newValue = value + step;
		if (max !== undefined && newValue > max) newValue = max;
		value = newValue;
		dispatch('change', value);
		updateDisplayValue();
	}

	function decrement() {
		const step = 1000;
		let newValue = value - step;
		if (newValue < min) newValue = min;
		value = newValue;
		dispatch('change', value);
		updateDisplayValue();
	}

	$: value, !focused && updateDisplayValue();
	$: hasError = !!error;
	$: currencySymbol = currencySymbols[currency] || currency;
</script>

<div class="price-input-wrapper">
	{#if label}
		<label for={label}>
			{label}
		</label>
	{/if}

	<div class="price-input-container" class:focused class:error={hasError}>
		<span class="currency-symbol">{currencySymbol}</span>

		<input
			bind:this={inputElement}
			type="text"
			inputmode="numeric"
			{placeholder}
			value={displayValue}
			id={label}
			on:input={handleInput}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:keydown
		/>

		<div class="stepper-buttons">
			<button type="button" class="stepper-button" on:click={increment} tabindex="-1">
				<Icon name="chevron-up" size={12} />
			</button>
			<button type="button" class="stepper-button" on:click={decrement} tabindex="-1">
				<Icon name="chevron-down" size={12} />
			</button>
		</div>
	</div>

	{#if error}
		<span class="error-message">{error}</span>
	{:else if max}
		<span class="hint-text">Maximum: {currencySymbol} {formatNumber(max)}</span>
	{/if}
</div>

<style>
	.price-input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.price-input-container {
		position: relative;
		display: flex;
		align-items: center;
		background-color: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		transition: all 0.2s ease;
		overflow: hidden;
	}

	.price-input-container:hover {
		border-color: var(--border-hover);
	}

	.price-input-container.focused {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px var(--primary-color-alpha);
	}

	.price-input-container.error {
		border-color: var(--error-color);
	}

	.price-input-container.error.focused {
		box-shadow: 0 0 0 3px var(--error-color-alpha);
	}

	.currency-symbol {
		padding-left: 1rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	input {
		flex: 1;
		padding: 0.75rem 0.5rem 0.75rem 0.5rem;
		font-size: 0.9375rem;
		color: var(--text-primary);
		background: transparent;
		border: none;
		outline: none;
	}

	input::placeholder {
		color: var(--text-tertiary);
	}

	.stepper-buttons {
		display: flex;
		flex-direction: column;
		border-left: 1px solid var(--border-color);
	}

	.stepper-button {
		padding: 0.25rem 0.5rem;
		background: transparent;
		border: none;
		color: var(--text-tertiary);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stepper-button:first-child {
		border-bottom: 1px solid var(--border-color);
	}

	.stepper-button:hover {
		background-color: var(--hover-bg);
		color: var(--primary-color);
	}

	.stepper-button:active {
		background-color: var(--primary-color-alpha);
	}

	.error-message {
		font-size: 0.8125rem;
		color: var(--error-color);
		margin-top: -0.25rem;
	}

	.hint-text {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		margin-top: -0.25rem;
	}

	/* Dark mode adjustments */
	:global(.dark) .price-input-container {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .price-input-container:hover {
		border-color: var(--dark-border-hover);
	}

	:global(.dark) input {
		color: var(--dark-text-primary);
	}

	:global(.dark) input::placeholder {
		color: var(--dark-text-tertiary);
	}

	:global(.dark) .stepper-buttons {
		border-left-color: var(--dark-border-color);
	}

	:global(.dark) .stepper-button:first-child {
		border-bottom-color: var(--dark-border-color);
	}

	:global(.dark) .stepper-button:hover {
		background-color: var(--dark-hover-bg);
	}
</style>
