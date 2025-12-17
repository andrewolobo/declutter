<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	export let label: string = '';
	export let checked: boolean = false;
	export let disabled: boolean = false;
	export let error: string | undefined = undefined;
	export let indeterminate: boolean = false;

	const dispatch = createEventDispatcher();

	function handleChange() {
		if (!disabled) {
			checked = !checked;
			dispatch('change', checked);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleChange();
		}
	}

	$: hasError = !!error;
</script>

<div class="checkbox-wrapper" class:disabled class:error={hasError}>
	<label class="checkbox-label">
		<div
			class="checkbox"
			class:checked
			class:indeterminate
			class:disabled
			role="checkbox"
			tabindex={disabled ? -1 : 0}
			aria-checked={indeterminate ? 'mixed' : checked}
			aria-disabled={disabled}
			on:click={handleChange}
			on:keydown={handleKeydown}
		>
			{#if indeterminate}
				<div class="indeterminate-icon"></div>
			{:else if checked}
				<Icon name="check" size={14} />
			{/if}
		</div>

		<input
			type="checkbox"
			{checked}
			{disabled}
			on:change={handleChange}
			class="hidden-input"
			aria-hidden="true"
			tabindex="-1"
		/>

		<span class="label-text">{label}</span>
	</label>

	{#if error}
		<span class="error-message">{error}</span>
	{/if}
</div>

<style>
	.checkbox-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		user-select: none;
	}

	.checkbox-wrapper.disabled .checkbox-label {
		cursor: not-allowed;
	}

	.checkbox {
		position: relative;
		width: 20px;
		height: 20px;
		min-width: 20px;
		border: 2px solid var(--border-color);
		border-radius: 0.25rem;
		background-color: var(--input-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		outline: none;
	}

	.checkbox:hover:not(.disabled) {
		border-color: var(--primary-color);
	}

	.checkbox:focus-visible {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px var(--primary-color-alpha);
	}

	.checkbox.checked,
	.checkbox.indeterminate {
		background-color: var(--primary-color);
		border-color: var(--primary-color);
		color: white;
	}

	.checkbox.disabled {
		background-color: var(--disabled-bg);
		border-color: var(--border-color);
		opacity: 0.5;
		cursor: not-allowed;
	}

	.checkbox.checked.disabled {
		background-color: var(--disabled-bg);
		color: var(--text-disabled);
	}

	.indeterminate-icon {
		width: 10px;
		height: 2px;
		background-color: white;
		border-radius: 1px;
	}

	.checkbox-wrapper.error .checkbox {
		border-color: var(--error-color);
	}

	.checkbox-wrapper.error .checkbox.checked,
	.checkbox-wrapper.error .checkbox.indeterminate {
		background-color: var(--error-color);
		border-color: var(--error-color);
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

	.checkbox-wrapper.disabled .label-text {
		color: var(--text-disabled);
	}

	.error-message {
		font-size: 0.8125rem;
		color: var(--error-color);
		margin-left: 1.95rem;
	}

	/* Dark mode adjustments */
	:global(.dark) .checkbox {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .label-text {
		color: var(--dark-text-primary);
	}
</style>
