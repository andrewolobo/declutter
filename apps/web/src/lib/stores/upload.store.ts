/**
 * Upload Store
 *
 * Manages file upload state, progress tracking, and upload history.
 *
 * STATUS: STUB IMPLEMENTATION
 * This is a placeholder store that will be fully implemented later.
 * The upload service is already complete, but advanced state management
 * features like progress tracking, retry logic, and upload history will
 * be added when needed.
 *
 * @module stores/upload
 */

import { writable, derived, type Readable } from 'svelte/store';
import type { UploadProgress, UploadResponse } from '$lib/services/upload.service';

// ============================================================================
// Types
// ============================================================================

export interface UploadItem {
	id: string;
	file: File;
	status: 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled';
	progress: number;
	result?: UploadResponse;
	error?: string;
	startedAt: string;
	completedAt?: string;
}

export interface UploadStoreState {
	uploads: Map<string, UploadItem>;
	activeUploadCount: number;
	totalUploaded: number;
	totalFailed: number;
}

// ============================================================================
// Store Creation
// ============================================================================

/**
 * Create upload store with state management
 */
function createUploadStore() {
	const initialState: UploadStoreState = {
		uploads: new Map(),
		activeUploadCount: 0,
		totalUploaded: 0,
		totalFailed: 0
	};

	const { subscribe, set, update } = writable<UploadStoreState>(initialState);

	return {
		subscribe,

		/**
		 * Start a new upload
		 *
		 * @example
		 * ```typescript
		 * uploadStore.startUpload('upload_123', file);
		 * ```
		 */
		startUpload(id: string, file: File): void {
			update((state) => {
				const newUploads = new Map(state.uploads);
				newUploads.set(id, {
					id,
					file,
					status: 'uploading',
					progress: 0,
					startedAt: new Date().toISOString()
				});

				return {
					...state,
					uploads: newUploads,
					activeUploadCount: state.activeUploadCount + 1
				};
			});
		},

		/**
		 * Update upload progress
		 *
		 * @example
		 * ```typescript
		 * uploadStore.updateProgress('upload_123', 45);
		 * ```
		 */
		updateProgress(id: string, progress: number): void {
			update((state) => {
				const upload = state.uploads.get(id);
				if (!upload) return state;

				const newUploads = new Map(state.uploads);
				newUploads.set(id, {
					...upload,
					progress
				});

				return {
					...state,
					uploads: newUploads
				};
			});
		},

		/**
		 * Complete an upload
		 *
		 * @example
		 * ```typescript
		 * uploadStore.completeUpload('upload_123', result);
		 * ```
		 */
		completeUpload(id: string, result: UploadResponse): void {
			update((state) => {
				const upload = state.uploads.get(id);
				if (!upload) return state;

				const newUploads = new Map(state.uploads);
				newUploads.set(id, {
					...upload,
					status: 'completed',
					progress: 100,
					result,
					completedAt: new Date().toISOString()
				});

				return {
					...state,
					uploads: newUploads,
					activeUploadCount: Math.max(0, state.activeUploadCount - 1),
					totalUploaded: state.totalUploaded + 1
				};
			});
		},

		/**
		 * Mark an upload as failed
		 *
		 * @example
		 * ```typescript
		 * uploadStore.failUpload('upload_123', 'Network error');
		 * ```
		 */
		failUpload(id: string, error: string): void {
			update((state) => {
				const upload = state.uploads.get(id);
				if (!upload) return state;

				const newUploads = new Map(state.uploads);
				newUploads.set(id, {
					...upload,
					status: 'failed',
					error,
					completedAt: new Date().toISOString()
				});

				return {
					...state,
					uploads: newUploads,
					activeUploadCount: Math.max(0, state.activeUploadCount - 1),
					totalFailed: state.totalFailed + 1
				};
			});
		},

		/**
		 * Cancel an in-progress upload
		 *
		 * @example
		 * ```typescript
		 * uploadStore.cancelUpload('upload_123');
		 * ```
		 */
		cancelUpload(id: string): void {
			update((state) => {
				const upload = state.uploads.get(id);
				if (!upload) return state;

				const newUploads = new Map(state.uploads);
				newUploads.set(id, {
					...upload,
					status: 'cancelled',
					completedAt: new Date().toISOString()
				});

				return {
					...state,
					uploads: newUploads,
					activeUploadCount: Math.max(0, state.activeUploadCount - 1)
				};
			});
		},

		/**
		 * Remove an upload from the store
		 *
		 * @example
		 * ```typescript
		 * uploadStore.removeUpload('upload_123');
		 * ```
		 */
		removeUpload(id: string): void {
			update((state) => {
				const newUploads = new Map(state.uploads);
				const upload = newUploads.get(id);

				if (upload && upload.status === 'uploading') {
					// Don't remove active uploads
					return state;
				}

				newUploads.delete(id);

				return {
					...state,
					uploads: newUploads
				};
			});
		},

		/**
		 * Clear completed uploads
		 *
		 * @example
		 * ```typescript
		 * uploadStore.clearCompleted();
		 * ```
		 */
		clearCompleted(): void {
			update((state) => {
				const newUploads = new Map(state.uploads);

				for (const [id, upload] of newUploads.entries()) {
					if (upload.status === 'completed') {
						newUploads.delete(id);
					}
				}

				return {
					...state,
					uploads: newUploads
				};
			});
		},

		/**
		 * Clear all uploads (except active ones)
		 *
		 * @example
		 * ```typescript
		 * uploadStore.clearAll();
		 * ```
		 */
		clearAll(): void {
			update((state) => {
				const newUploads = new Map(state.uploads);

				for (const [id, upload] of newUploads.entries()) {
					if (upload.status !== 'uploading') {
						newUploads.delete(id);
					}
				}

				return {
					...state,
					uploads: newUploads,
					totalUploaded: 0,
					totalFailed: 0
				};
			});
		},

		/**
		 * Reset the store to initial state
		 */
		reset(): void {
			set(initialState);
		}
	};
}

// ============================================================================
// Store Instance
// ============================================================================

export const uploadStore = createUploadStore();

// ============================================================================
// Derived Stores
// ============================================================================

/**
 * All uploads as an array
 */
export const uploads: Readable<UploadItem[]> = derived(uploadStore, ($store) =>
	Array.from($store.uploads.values())
);

/**
 * Active uploads (currently uploading)
 */
export const activeUploads: Readable<UploadItem[]> = derived(uploads, ($uploads) =>
	$uploads.filter((u) => u.status === 'uploading')
);

/**
 * Completed uploads
 */
export const completedUploads: Readable<UploadItem[]> = derived(uploads, ($uploads) =>
	$uploads.filter((u) => u.status === 'completed')
);

/**
 * Failed uploads
 */
export const failedUploads: Readable<UploadItem[]> = derived(uploads, ($uploads) =>
	$uploads.filter((u) => u.status === 'failed')
);

/**
 * Whether any upload is in progress
 */
export const hasActiveUploads: Readable<boolean> = derived(
	uploadStore,
	($store) => $store.activeUploadCount > 0
);

/**
 * Total number of active uploads
 */
export const activeUploadCount: Readable<number> = derived(
	uploadStore,
	($store) => $store.activeUploadCount
);

/**
 * Overall upload progress (0-100)
 */
export const overallProgress: Readable<number> = derived(activeUploads, ($activeUploads) => {
	if ($activeUploads.length === 0) return 0;

	const totalProgress = $activeUploads.reduce((sum, upload) => sum + upload.progress, 0);
	return Math.round(totalProgress / $activeUploads.length);
});

/**
 * Upload statistics
 */
export const uploadStats: Readable<{
	total: number;
	active: number;
	completed: number;
	failed: number;
}> = derived(uploadStore, ($store) => ({
	total: $store.uploads.size,
	active: $store.activeUploadCount,
	completed: $store.totalUploaded,
	failed: $store.totalFailed
}));

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get a specific upload by ID
 */
export function getUpload(id: string): UploadItem | undefined {
	let upload: UploadItem | undefined;
	uploadStore.subscribe((state) => {
		upload = state.uploads.get(id);
	})();
	return upload;
}

/**
 * Check if an upload exists
 */
export function hasUpload(id: string): boolean {
	return getUpload(id) !== undefined;
}

/**
 * Get upload progress by ID
 */
export function getUploadProgress(id: string): number {
	const upload = getUpload(id);
	return upload?.progress ?? 0;
}

// ============================================================================
// Export Types
// ============================================================================

export type { UploadItem, UploadStoreState };
