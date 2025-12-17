<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	export let accept: string = '*/*';
	export let multiple: boolean = false;
	export let maxSize: number | undefined = undefined; // in bytes
	export let maxFiles: number | undefined = undefined;
	export let preview: boolean = true;

	const dispatch = createEventDispatcher();

	let isDragging = false;
	let fileInputElement: HTMLInputElement;
	let uploadedFiles: File[] = [];

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const files = Array.from(e.dataTransfer?.files || []);
		processFiles(files);
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = Array.from(target.files || []);
		processFiles(files);
	}

	function processFiles(files: File[]) {
		let validFiles = files;

		// Check max files limit
		if (maxFiles && uploadedFiles.length + files.length > maxFiles) {
			dispatch('error', `Maximum ${maxFiles} files allowed`);
			validFiles = files.slice(0, maxFiles - uploadedFiles.length);
		}

		// Validate file sizes
		if (maxSize) {
			const oversizedFiles = validFiles.filter(f => f.size > maxSize);
			if (oversizedFiles.length > 0) {
				const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
				dispatch('error', `Some files exceed the ${maxSizeMB}MB size limit`);
				validFiles = validFiles.filter(f => f.size <= maxSize);
			}
		}

		if (validFiles.length > 0) {
			if (multiple) {
				uploadedFiles = [...uploadedFiles, ...validFiles];
			} else {
				uploadedFiles = [validFiles[0]];
			}
			dispatch('upload', uploadedFiles);
		}
	}

	function removeFile(index: number) {
		uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
		dispatch('upload', uploadedFiles);
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	}

	function getFilePreview(file: File): string {
		if (file.type.startsWith('image/')) {
			return URL.createObjectURL(file);
		}
		return '';
	}

	function triggerFileInput() {
		fileInputElement?.click();
	}
</script>

<div class="file-upload-wrapper">
	<div
		class="dropzone"
		class:dragging={isDragging}
		on:dragenter={handleDragEnter}
		on:dragleave={handleDragLeave}
		on:dragover={handleDragOver}
		on:drop={handleDrop}
		on:click={triggerFileInput}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
	>
		<input
			bind:this={fileInputElement}
			type="file"
			{accept}
			{multiple}
			on:change={handleFileSelect}
			class="hidden-input"
			aria-label="File upload"
		/>

		<div class="dropzone-content">
			<Icon name="upload" size={48} />
			<p class="dropzone-title">Drop files here or click to upload</p>
			<p class="dropzone-subtitle">
				{#if accept !== '*/*'}
					Accepted: {accept}
				{/if}
				{#if maxSize}
					{#if accept !== '*/*'} • {/if}Max size: {formatFileSize(maxSize)}
				{/if}
				{#if maxFiles}
					{#if maxSize || accept !== '*/*'} • {/if}Max {maxFiles} files
				{/if}
			</p>
		</div>
	</div>

	{#if uploadedFiles.length > 0 && preview}
		<div class="file-preview-list">
			{#each uploadedFiles as file, index}
				<div class="file-preview-item">
					{#if file.type.startsWith('image/')}
						<img src={getFilePreview(file)} alt={file.name} class="file-thumbnail" />
					{:else}
						<div class="file-icon">
							<Icon name="file" size={32} />
						</div>
					{/if}

					<div class="file-info">
						<p class="file-name">{file.name}</p>
						<p class="file-size">{formatFileSize(file.size)}</p>
					</div>

					<button
						type="button"
						class="remove-button"
						on:click|stopPropagation={() => removeFile(index)}
						aria-label="Remove file"
					>
						<Icon name="x" size={20} />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.file-upload-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.dropzone {
		border: 2px dashed var(--border-color);
		border-radius: 0.5rem;
		padding: 2rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
		background-color: var(--input-bg);
	}

	.dropzone:hover {
		border-color: var(--primary-color);
		background-color: var(--hover-bg);
	}

	.dropzone.dragging {
		border-color: var(--primary-color);
		background-color: var(--primary-color-alpha);
	}

	.dropzone:focus-visible {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px var(--primary-color-alpha);
	}

	.dropzone-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		color: var(--text-tertiary);
	}

	.dropzone-title {
		font-size: 1rem;
		font-weight: 500;
		color: var(--text-primary);
		margin: 0;
	}

	.dropzone-subtitle {
		font-size: 0.875rem;
		color: var(--text-tertiary);
		margin: 0;
	}

	.hidden-input {
		display: none;
	}

	.file-preview-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.file-preview-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background-color: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.file-preview-item:hover {
		border-color: var(--border-hover);
	}

	.file-thumbnail {
		width: 48px;
		height: 48px;
		object-fit: cover;
		border-radius: 0.375rem;
	}

	.file-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--hover-bg);
		border-radius: 0.375rem;
		color: var(--text-tertiary);
	}

	.file-info {
		flex: 1;
		min-width: 0;
	}

	.file-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		margin: 0 0 0.25rem 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-size {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		margin: 0;
	}

	.remove-button {
		padding: 0.5rem;
		background: transparent;
		border: none;
		color: var(--text-tertiary);
		cursor: pointer;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.remove-button:hover {
		background-color: var(--error-bg);
		color: var(--error-color);
	}

	/* Dark mode adjustments */
	:global(.dark) .dropzone {
		background-color: var(--dark-input-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .dropzone:hover {
		background-color: var(--dark-hover-bg);
	}

	:global(.dark) .file-preview-item {
		background-color: var(--dark-card-bg);
		border-color: var(--dark-border-color);
	}

	:global(.dark) .file-icon {
		background-color: var(--dark-hover-bg);
	}
</style>
