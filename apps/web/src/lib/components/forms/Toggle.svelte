<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { BaseFormProps } from './types';

	export let label: string | undefined = undefined;
	export let error: string | undefined = undefined;
	export let checked: boolean = false;
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const dispatch = createEventDispatcher();

	function handleToggle() {
		if (!disabled) {
			checked = !checked;
			dispatch('change', checked);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleToggle();
		}
	}

	$: sizeClass = {
		sm: 'toggle-sm',
		md: 'toggle-md',
		lg: 'toggle-lg'
	}[size];
</script>

<div class="toggle-wrapper" class:disabled>
	<label class="toggle-label">
		{#if label}
			<span class="label-text">{label}</span>
		{/if}

		<div
			class="toggle {sizeClass}"
			class:checked
			class:disabled
			role="switch"
			tabindex={disabled ? -1 : 0}
			aria-checked={checked}
			aria-disabled={disabled}
			aria-label={label || 'Toggle'}
			on:click={handleToggle}
			on:keydown={handleKeydown}
		>
			<div class="toggle-track">
				<div class="toggle-thumb"></div>
			</div>
		</div>

		<input
			type="checkbox"
			{checked}
			{disabled}
			on:change={handleToggle}
			class="hidden-input"
			aria-hidden="true"
			tabindex="-1"
		/>
	</label>
</div>

<style>
	.toggle-wrapper {
		display: inline-flex;
		align-items: center;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		user-select: none;
	}

	.toggle-wrapper.disabled .toggle-label {
		cursor: not-allowed;
	}

	.label-text {
		font-size: 0.9375rem;
		color: var(--text-primary);
		line-height: 1.5;
	}

	.toggle-wrapper.disabled .label-text {
		color: var(--text-disabled);
	}

	.toggle {
		outline: none;
	}

	.toggle:focus-visible .toggle-track {
		box-shadow: 0 0 0 3px var(--primary-color-alpha);
	}

	.toggle-track {
		position: relative;
		background-color: var(--border-color);
		border-radius: 9999px;
		transition: all 0.3s ease;
	}

	.toggle.toggle-sm .toggle-track {
		width: 36px;
		height: 20px;
	}

	.toggle.toggle-md .toggle-track {
		width: 44px;
		height: 24px;
	}

	.toggle.toggle-lg .toggle-track {
		width: 52px;
		height: 28px;
	}

	.toggle:not(.disabled):hover .toggle-track {
		background-color: var(--border-hover);
	}

	.toggle.checked .toggle-track {
		background-color: var(--primary-color);
	}

	.toggle.checked:not(.disabled):hover .toggle-track {
		background-color: var(--primary-color-dark);
	}

	.toggle.disabled .toggle-track {
		background-color: var(--disabled-bg);
		opacity: 0.5;
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		background-color: white;
		border-radius: 50%;
		transition: transform 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toggle.toggle-sm .toggle-thumb {
		width: 16px;
		height: 16px;
	}

	.toggle.toggle-md .toggle-thumb {
		width: 20px;
		height: 20px;
	}

	.toggle.toggle-lg .toggle-thumb {
		width: 24px;
		height: 24px;
	}

	.toggle.checked.toggle-sm .toggle-thumb {
		transform: translateX(16px);
	}

	.toggle.checked.toggle-md .toggle-thumb {
		transform: translateX(20px);
	}

	.toggle.checked.toggle-lg .toggle-thumb {
		transform: translateX(24px);
	}

	.hidden-input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
		width: 0;
		height: 0;
	}

	/* Dark mode adjustments */
	:global(.dark) .toggle-track {
		background-color: var(--dark-border-color);
	}

	:global(.dark) .toggle:not(.disabled):hover .toggle-track {
		background-color: var(--dark-border-hover);
	}

	:global(.dark) .label-text {
		color: var(--dark-text-primary);
	}
</style>
