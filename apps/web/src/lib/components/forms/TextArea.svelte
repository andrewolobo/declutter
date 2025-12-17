<script lang="ts">
	export let label: string | undefined = undefined;
	export let placeholder: string = '';
	export let value: string = '';
	export let rows: number = 4;
	export let maxLength: number | undefined = undefined;
	export let error: string | undefined = undefined;
	export let required: boolean = false;
	export let autoResize: boolean = false;
	export let disabled: boolean = false;

	let textareaElement: HTMLTextAreaElement;
	let focused = false;

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		value = target.value;

		if (autoResize) {
			target.style.height = 'auto';
			target.style.height = `${target.scrollHeight}px`;
		}
	}

	function handleFocus() {
		focused = true;
	}

	function handleBlur() {
		focused = false;
	}

	$: hasError = !!error;
	$: characterCount = value.length;
	$: showCounter = maxLength !== undefined;
</script>

<div class="textarea-wrapper">
	{#if label}
		<label for={label} class:required>
			{label}
		</label>
	{/if}

	<div class="textarea-container" class:focused class:error={hasError} class:disabled>
		<textarea
			bind:this={textareaElement}
			{placeholder}
			{value}
			{rows}
			{disabled}
			{required}
			maxlength={maxLength}
			id={label}
			class:has-error={hasError}
			class:auto-resize={autoResize}
			on:input={handleInput}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:input
			on:change
			on:focus
			on:blur
			on:keydown
		></textarea>
	</div>

	<div class="textarea-footer">
		{#if error}
			<span class="error-message">{error}</span>
		{/if}
		{#if showCounter}
			<span class="character-count" class:over-limit={maxLength && characterCount > maxLength}>
				{characterCount}{#if maxLength}/{maxLength}{/if}
			</span>
		{/if}
	</div>
</div>

<style>
	.textarea-wrapper {
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

	.textarea-container {
		position: relative;
	}

	textarea {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		font-family: inherit;
		line-height: 1.5;
		color: var(--text-primary);
		background-color: var(--input-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		outline: none;
		resize: vertical;
		transition: all 0.2s ease;
		min-height: 100px;
	}

	textarea.auto-resize {
		resize: none;
		overflow: hidden;
	}

	textarea::placeholder {
		color: var(--text-tertiary);
	}

	textarea:hover:not(:disabled) {
		border-color: var(--border-hover);
	}

	textarea:focus {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px var(--primary-color-alpha);
	}

	textarea:disabled {
		background-color: var(--disabled-bg);
		color: var(--text-disabled);
		cursor: not-allowed;
		opacity: 0.6;
	}

	textarea.has-error,
	.textarea-container.error textarea {
		border-color: var(--error-color);
	}

	textarea.has-error:focus,
	.textarea-container.error textarea:focus {
		border-color: var(--error-color);
		box-shadow: 0 0 0 3px var(--error-color-alpha);
	}

	.textarea-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-top: -0.25rem;
	}

	.error-message {
		font-size: 0.8125rem;
		color: var(--error-color);
		flex: 1;
	}

	.character-count {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		white-space: nowrap;
	}

	.character-count.over-limit {
		color: var(--error-color);
		font-weight: 500;
	}

	/* Dark mode adjustments */
	:global(.dark) textarea {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
		color: var(--dark-text-primary);
	}

	:global(.dark) textarea::placeholder {
		color: var(--dark-text-tertiary);
	}

	:global(.dark) textarea:hover:not(:disabled) {
		border-color: var(--dark-border-hover);
	}
</style>
