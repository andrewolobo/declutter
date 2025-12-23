<script lang="ts">
	import Button from '$lib/components/buttons/Button.svelte';
	
	interface Props {
		content?: string;
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		disabled?: boolean;
		icon?: string;
		iconPosition?: 'left' | 'right';
		fullWidth?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: () => void;
	}
	
	let {
		content = '',
		variant,
		size,
		loading,
		disabled,
		icon,
		iconPosition,
		fullWidth,
		type,
		class: className,
		onclick
	}: Props = $props();
</script>

<Button
	{variant}
	{size}
	{loading}
	{disabled}
	{icon}
	{iconPosition}
	{fullWidth}
	{type}
	class={className}
	{onclick}
>
	{content}
</Button>
