<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	export let images: string[] = []; // URLs or base64
	export let maxImages: number = 5;
	// Reserved for future use - aspect ratio constraint
	export const aspectRatio: string | undefined = undefined;

	const dispatch = createEventDispatcher();

	let isDragging = false;
	let draggedIndex: number | null = null;
	let fileInputElement: HTMLInputElement;

	function handleDragStart(index: number) {
		draggedIndex = index;
	}

	function handleDragOver(e: DragEvent, targetIndex: number) {
		e.preventDefault();
		if (draggedIndex !== null && draggedIndex !== targetIndex) {
			const newImages = [...images];
			const [draggedItem] = newImages.splice(draggedIndex, 1);
			newImages.splice(targetIndex, 0, draggedItem);
			images = newImages;
			draggedIndex = targetIndex;
			dispatch('reorder', images);
		}
	}

	function handleDragEnd() {
		draggedIndex = null;
	}

	function handleFileDrop(e: DragEvent, index?: number) {
		e.preventDefault();
		isDragging = false;

		const files = Array.from(e.dataTransfer?.files || []).filter(f =>
			f.type.startsWith('image/')
		);

		if (files.length > 0) {
			processFiles(files);
		}
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = Array.from(target.files || []);
		processFiles(files);
		// Reset input value to allow re-selecting same file
		target.value = '';
	}

	async function processFiles(files: File[]) {
		const availableSlots = maxImages - images.length;
		const filesToProcess = files.slice(0, availableSlots);

		for (const file of filesToProcess) {
			try {
				const dataUrl = await readFileAsDataURL(file);
				images = [...images, dataUrl];
			} catch (error) {
				console.error('Error processing file:', error);
			}
		}

		dispatch('upload', images);
	}

	function readFileAsDataURL(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	function removeImage(index: number) {
		images = images.filter((_, i) => i !== index);
		dispatch('remove', index);
	}

	function setPrimaryImage(index: number) {
		if (index !== 0) {
			const newImages = [...images];
			const [primaryImage] = newImages.splice(index, 1);
			newImages.unshift(primaryImage);
			images = newImages;
			dispatch('reorder', images);
		}
	}

	function triggerFileInput() {
		fileInputElement?.click();
	}

	$: hasImages = images.length > 0;
	$: canAddMore = images.length < maxImages;
</script>

<div class="image-uploader">
	<input
		bind:this={fileInputElement}
		type="file"
		accept="image/*"
		multiple
		on:change={handleFileSelect}
		class="hidden-input"
		aria-label="Upload images"
	/>

	<div class="images-grid">
		{#each images as image, index}
			<div
				class="image-slot"
				class:primary={index === 0}
				draggable="true"
				role="button"
				tabindex="0"
				on:dragstart={() => handleDragStart(index)}
				on:dragover={(e) => handleDragOver(e, index)}
				on:dragend={handleDragEnd}
			>
				<img src={image} alt="Upload {index + 1}" />

				<div class="image-overlay">
					{#if index === 0}
						<span class="primary-badge">Primary</span>
					{:else}
						<button
							type="button"
							class="overlay-button"
							on:click={() => setPrimaryImage(index)}
							title="Set as primary"
						>
							<Icon name="star" size={16} />
						</button>
					{/if}

					<button
						type="button"
						class="overlay-button delete"
						on:click={() => removeImage(index)}
						title="Remove image"
					>
						<Icon name="trash" size={16} />
					</button>
				</div>

				<div class="drag-handle" title="Drag to reorder">
					<Icon name="grip-vertical" size={16} />
				</div>
			</div>
		{/each}

		{#if canAddMore}
			<button
				type="button"
				class="image-slot add-slot"
				on:click={triggerFileInput}
				on:dragenter={(e) => {
					e.preventDefault();
					isDragging = true;
				}}
				on:dragleave={(e) => {
					e.preventDefault();
					isDragging = false;
				}}
				on:dragover={(e) => e.preventDefault()}
				on:drop={handleFileDrop}
				class:dragging={isDragging}
			>
				<Icon name="plus" size={32} />
				<span class="add-text">Add Image</span>
				<span class="add-subtext">{images.length}/{maxImages}</span>
			</button>
		{/if}
	</div>

	{#if hasImages}
		<p class="hint-text">
			<Icon name="info" size={14} />
			Drag images to reorder. First image will be the primary image.
		</p>
	{/if}
</div>

<style>
	.image-uploader {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.hidden-input {
		display: none;
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
	}

	.image-slot {
		position: relative;
		aspect-ratio: 1 / 1;
		border: 2px solid var(--border-color);
		border-radius: 0.5rem;
		overflow: hidden;
		background-color: var(--card-bg);
		cursor: move;
		transition: all 0.2s ease;
	}

	.image-slot:hover {
		border-color: var(--primary-color);
	}

	.image-slot.primary {
		border-color: var(--primary-color);
		border-width: 3px;
	}

	.image-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent);
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0.5rem;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.image-slot:hover .image-overlay {
		opacity: 1;
	}

	.primary-badge {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		background-color: var(--primary-color);
		color: white;
		border-radius: 0.25rem;
	}

	.overlay-button {
		padding: 0.375rem;
		background-color: rgba(0, 0, 0, 0.6);
		border: none;
		color: white;
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.overlay-button:hover {
		background-color: rgba(0, 0, 0, 0.8);
	}

	.overlay-button.delete:hover {
		background-color: var(--error-color);
	}

	.drag-handle {
		position: absolute;
		bottom: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem;
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
		border-radius: 0.25rem;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.image-slot:hover .drag-handle {
		opacity: 1;
	}

	.add-slot {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		color: var(--text-tertiary);
		cursor: pointer;
		border-style: dashed;
	}

	.add-slot:hover {
		background-color: var(--hover-bg);
		color: var(--primary-color);
	}

	.add-slot.dragging {
		border-color: var(--primary-color);
		background-color: var(--primary-color-alpha);
		color: var(--primary-color);
	}

	.add-text {
		font-size: 0.875rem;
		font-weight: 500;
	}

	.add-subtext {
		font-size: 0.75rem;
		color: var(--text-tertiary);
	}

	.hint-text {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		margin: 0;
	}

	/* Dark mode adjustments */
	:global(.dark) .image-slot {
		background-color: var(--dark-card-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .add-slot:hover {
		background-color: var(--dark-hover-bg);
	}
</style>
