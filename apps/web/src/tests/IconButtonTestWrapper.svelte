<script lang="ts">
	import IconButton from '$lib/components/buttons/IconButton.svelte';
	
	interface Props {
		icon: string;
		ariaLabel: string;
		variant?: 'default' | 'primary' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		badge?: boolean | number;
		class?: string;
		onclick?: () => void;
	}
	
	let {
		icon,
		ariaLabel,
		variant,
		size,
		disabled,
		badge,
		class: className,
		onclick
	}: Props = $props();
</script>

<IconButton
	{icon}
	{ariaLabel}
	{variant}
	{size}
	{disabled}
	{badge}
	class={className}
	{onclick}
/>
