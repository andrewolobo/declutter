<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	export let type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' = 'text';
	export let label: string | undefined = undefined;
	export let placeholder: string = '';
	export let value: string = '';
	export let error: string | undefined = undefined;
	export let icon: string | undefined = undefined;
	export let iconPosition: 'left' | 'right' = 'left';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let autocomplete: string | null | undefined = undefined;

	let focused = false;
	let inputElement: HTMLInputElement;

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
	}

	function handleFocus() {
		focused = true;
	}

	function handleBlur() {
		focused = false;
	}

	$: hasError = !!error;
	$: hasValue = !!value;
</script>

<div class="input-wrapper">
	{#if label}
		<label for={label} class:required>
			{label}
		</label>
	{/if}

	<div class="input-container" class:has-icon={icon} class:icon-left={icon && iconPosition === 'left'} class:icon-right={icon && iconPosition === 'right'} class:focused class:error={hasError} class:disabled>
		{#if icon && iconPosition === 'left'}
			<div class="input-icon left">
				<Icon name={icon} size={20} />
			</div>
		{/if}

		<input
			bind:this={inputElement}
			{type}
			{placeholder}
			{value}
			{disabled}
			{required}
			autocomplete={autocomplete as any}
			id={label}
			class:has-error={hasError}
			on:input={handleInput}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:input
			on:change
			on:focus
			on:blur
			on:keydown
		/>

		{#if icon && iconPosition === 'right'}
			<div class="input-icon right">
				<Icon name={icon} size={20} />
			</div>
		{/if}
	</div>

	{#if error}
		<span class="error-message">{error}</span>
	{/if}
</div>

<style>
	.input-wrapper {
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

	label.required::after {
		content: '*';
		color: var(--error-color);
		margin-left: 0.25rem;
	}

	.input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	input {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		color: var(--text-primary);
		background-color: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		outline: none;
		transition: all 0.2s ease;
	}

	input::placeholder {
		color: var(--text-tertiary);
	}

	input:hover:not(:disabled) {
		border-color: var(--border-hover);
	}

	input:focus {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px var(--primary-color-alpha);
	}

	input:disabled {
		background-color: var(--disabled-bg);
		color: var(--text-disabled);
		cursor: not-allowed;
		opacity: 0.6;
	}

	input.has-error,
	.input-container.error input {
		border-color: var(--error-color);
	}

	input.has-error:focus,
	.input-container.error input:focus {
		border-color: var(--error-color);
		box-shadow: 0 0 0 3px var(--error-color-alpha);
	}

	.input-container.has-icon.icon-left input {
		padding-left: 2.75rem;
	}

	.input-container.has-icon.icon-right input {
		padding-right: 2.75rem;
	}

	.input-icon {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-tertiary);
		pointer-events: none;
	}

	.input-icon.left {
		left: 0.875rem;
	}

	.input-icon.right {
		right: 0.875rem;
	}

	.input-container.focused .input-icon {
		color: var(--primary-color);
	}

	.input-container.error .input-icon {
		color: var(--error-color);
	}

	.error-message {
		font-size: 0.8125rem;
		color: var(--error-color);
		margin-top: -0.25rem;
	}

	/* Dark mode adjustments */
	:global(.dark) input {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
		color: var(--dark-text-primary);
	}

	:global(.dark) input::placeholder {
		color: var(--dark-text-tertiary);
	}

	:global(.dark) input:hover:not(:disabled) {
		border-color: var(--dark-border-hover);
	}
</style>
