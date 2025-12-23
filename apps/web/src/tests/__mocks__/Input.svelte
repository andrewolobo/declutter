<script lang="ts">
	interface Props {
		type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
		label?: string;
		placeholder?: string;
		value?: string;
		error?: string;
		icon?: string;
		iconPosition?: 'left' | 'right';
		disabled?: boolean;
		required?: boolean;
		autocomplete?: string | null;
	}
	
	let {
		type = 'text',
		label,
		placeholder = '',
		value = $bindable(''),
		error,
		icon,
		iconPosition = 'left',
		disabled = false,
		required = false,
		autocomplete
	}: Props = $props();
	
	let focused = $state(false);
	
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
	
	let hasError = $derived(!!error);
	let hasValue = $derived(!!value);
</script>

<div class="input-wrapper">
	{#if label}
		<label for={label} class:required>
			{label}
		</label>
	{/if}

	<div 
		class="input-container" 
		class:has-icon={icon} 
		class:icon-left={icon && iconPosition === 'left'} 
		class:icon-right={icon && iconPosition === 'right'} 
		class:focused 
		class:error={hasError} 
		class:disabled
	>
		{#if icon && iconPosition === 'left'}
			<div class="input-icon left">
				<span data-icon={icon} data-testid="icon"></span>
			</div>
		{/if}

		<input
			{type}
			{placeholder}
			{value}
			{disabled}
			{required}
			autocomplete={autocomplete as any}
			id={label}
			class:has-error={hasError}
			oninput={handleInput}
			onfocus={handleFocus}
			onblur={handleBlur}
		/>

		{#if icon && iconPosition === 'right'}
			<div class="input-icon right">
				<span data-icon={icon} data-testid="icon"></span>
			</div>
		{/if}
	</div>

	{#if error}
		<div class="error-message">
			{error}
		</div>
	{/if}
</div>

