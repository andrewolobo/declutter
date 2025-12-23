<script lang="ts">
	import Input from '$lib/components/forms/Input.svelte';
	
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
		placeholder,
		value = $bindable(''),
		error,
		icon,
		iconPosition,
		disabled,
		required,
		autocomplete
	}: Props = $props();
</script>

<Input
	{type}
	{label}
	{placeholder}
	bind:value
	{error}
	{icon}
	{iconPosition}
	{disabled}
	{required}
	{autocomplete}
/>
