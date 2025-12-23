<script lang="ts">
	interface Props {
		name?: string;
		size?: string;
		class?: string;
	}
	
	let { name = '', size = '', class: className = '' }: Props = $props();
</script>

<span data-icon={name} data-testid="icon" class="mock-icon {className}"></span>
