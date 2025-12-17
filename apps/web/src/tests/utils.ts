import { render, type RenderResult } from '@testing-library/svelte';
import type { ComponentProps, Component } from 'svelte';

/**
 * Enhanced render with common test setup
 */
export function renderWithProviders<T extends Component>(
	component: T,
	options: any = {}
): RenderResult<T> {
	return render(component, options);
}

/**
 * Wait for a specific amount of time
 */
export const waitFor = (ms: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Flush all pending promises
 */
export const flushPromises = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));

/**
 * Wait for next tick
 */
export const nextTick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Create a mock File object
 */
export function createMockFile(
	name: string = 'test.png',
	size: number = 1024,
	type: string = 'image/png'
): File {
	const blob = new Blob(['x'.repeat(size)], { type });
	return new File([blob], name, { type });
}

/**
 * Create a mock FileList
 */
export function createMockFileList(files: File[]): FileList {
	const fileList = {
		length: files.length,
		item: (index: number) => files[index] || null,
		[Symbol.iterator]: function* () {
			yield* files;
		}
	};

	// Add indexed access
	files.forEach((file, index) => {
		(fileList as any)[index] = file;
	});

	return fileList as FileList;
}

/**
 * Mock FormData for upload tests
 */
export class MockFormData {
	private data: Map<string, any> = new Map();

	append(key: string, value: any) {
		if (this.data.has(key)) {
			const existing = this.data.get(key);
			if (Array.isArray(existing)) {
				existing.push(value);
			} else {
				this.data.set(key, [existing, value]);
			}
		} else {
			this.data.set(key, value);
		}
	}

	get(key: string) {
		const value = this.data.get(key);
		return Array.isArray(value) ? value[0] : value;
	}

	getAll(key: string) {
		const value = this.data.get(key);
		return Array.isArray(value) ? value : [value];
	}

	has(key: string) {
		return this.data.has(key);
	}

	delete(key: string) {
		this.data.delete(key);
	}

	entries() {
		return this.data.entries();
	}

	keys() {
		return this.data.keys();
	}

	values() {
		return this.data.values();
	}
}

// Make FormData available globally in tests
if (typeof global !== 'undefined') {
	(global as any).FormData = MockFormData;
}
