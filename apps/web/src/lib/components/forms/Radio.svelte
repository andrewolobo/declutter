<script context="module" lang="ts">
	export interface RadioOption {
		value: string;
		label: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { BaseFormProps } from './types';

	export let name: string;
	export let options: RadioOption[] = [];
	export let value: string = '';
	export let label: string | undefined = undefined;
	export let error: string | undefined = undefined;
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let layout: 'vertical' | 'horizontal' = 'vertical';

	const dispatch = createEventDispatcher();

	function handleChange(optionValue: string, optionDisabled?: boolean) {
		if (!disabled && !optionDisabled) {
			value = optionValue;
			dispatch('change', value);
		}
	}

	function handleKeydown(event: KeyboardEvent, optionValue: string, optionDisabled?: boolean) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleChange(optionValue, optionDisabled);
		}
	}
</script>

<div class="radio-wrapper">
	{#if label}
		<label for="radio-group-{name}" class="group-label" class:disabled>
			{label}
		</label>
	{/if}

	<div id="radio-group-{name}" class="radio-group" class:horizontal={layout === 'horizontal'}>
		{#each options as option}
			{@const isChecked = value === option.value}
			{@const isDisabled = disabled || option.disabled}
			<label class="radio-label" class:disabled={isDisabled}>
				<div
					class="radio"
					class:checked={isChecked}
					class:disabled={isDisabled}
					role="radio"
					tabindex={isDisabled ? -1 : 0}
					aria-checked={isChecked}
					aria-disabled={isDisabled}
					on:click={() => handleChange(option.value, option.disabled)}
					on:keydown={(e) => handleKeydown(e, option.value, option.disabled)}
				>
					{#if isChecked}
						<div class="radio-dot"></div>
					{/if}
				</div>

				<input
					type="radio"
					{name}
					value={option.value}
					checked={isChecked}
					disabled={isDisabled}
					on:change={() => handleChange(option.value, option.disabled)}
					class="hidden-input"
					aria-hidden="true"
					tabindex="-1"
				/>

				<span class="label-text">{option.label}</span>
			</label>
		{/each}
	</div>
</div>

<style>
	.radio-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.group-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.group-label.disabled {
		color: var(--text-disabled);
	}

	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.radio-group.horizontal {
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.radio-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		user-select: none;
	}

	.radio-label.disabled {
		cursor: not-allowed;
	}

	.radio {
		position: relative;
		width: 20px;
		height: 20px;
		min-width: 20px;
		border: 2px solid var(--border-color);
		border-radius: 50%;
		background-color: var(--input-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		outline: none;
	}

	.radio:hover:not(.disabled) {
		border-color: var(--primary-color);
	}

	.radio:focus-visible {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px var(--primary-color-alpha);
	}

	.radio.checked {
		border-color: var(--primary-color);
		background-color: var(--input-bg);
	}

	.radio.disabled {
		background-color: var(--disabled-bg);
		border-color: var(--border-color);
		opacity: 0.5;
		cursor: not-allowed;
	}

	.radio-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: var(--primary-color);
		animation: scaleIn 0.2s ease;
	}

	.radio.disabled .radio-dot {
		background-color: var(--text-disabled);
	}

	@keyframes scaleIn {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1);
		}
	}

	.hidden-input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
		width: 0;
		height: 0;
	}

	.label-text {
		font-size: 0.9375rem;
		color: var(--text-primary);
		line-height: 1.5;
	}

	.radio-label.disabled .label-text {
		color: var(--text-disabled);
	}

	/* Dark mode adjustments */
	:global(.dark) .radio {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .radio.checked {
		background-color: var(--dark-input-bg);
	}

	:global(.dark) .label-text {
		color: var(--dark-text-primary);
	}
</style>
