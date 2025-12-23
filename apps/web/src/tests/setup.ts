import { vi, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import MockIcon from './__mocks__/Icon.svelte';
import MockInput from './__mocks__/Input.svelte';

// Mock the Icon component to avoid CSS preprocessing issues
vi.mock('$lib/components/ui/Icon.svelte', () => ({
	default: MockIcon
}));

// Mock the Input component to avoid CSS preprocessing issues
vi.mock('$lib/components/forms/Input.svelte', () => ({
	default: MockInput
}));

// Mock environment variables
process.env.VITE_API_BASE_URL = 'http://localhost:3000/api/v1';
process.env.VITE_NODE_ENV = 'test';
process.env.VITE_DEBUG_MODE = 'false';

// Setup localStorage mock
const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value.toString();
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
		get length() {
			return Object.keys(store).length;
		},
		key: vi.fn((index: number) => {
			const keys = Object.keys(store);
			return keys[index] || null;
		})
	};
})();

global.localStorage = localStorageMock as any;

// Setup sessionStorage mock
global.sessionStorage = localStorageMock as any;

// Mock window.location
delete (window as any).location;
window.location = {
	href: 'http://localhost:3000',
	pathname: '/',
	search: '',
	hash: ''
} as any;

// Mock Image for canvas operations
class ImageMock {
	onload: (() => void) | null = null;
	onerror: (() => void) | null = null;
	src: string = '';
	width: number = 800;
	height: number = 600;

	constructor() {
		// Simulate async image loading
		setTimeout(() => {
			if (this.onload) this.onload();
		}, 0);
	}
}

global.Image = ImageMock as any;

// Mock FileReader
class FileReaderMock {
	onload: ((event: any) => void) | null = null;
	onerror: ((event: any) => void) | null = null;
	result: string | ArrayBuffer | null = null;

	readAsDataURL(blob: Blob) {
		setTimeout(() => {
			this.result =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
			if (this.onload) {
				this.onload({ target: this } as any);
			}
		}, 0);
	}

	readAsText(blob: Blob) {
		setTimeout(() => {
			this.result = 'test file content';
			if (this.onload) {
				this.onload({ target: this } as any);
			}
		}, 0);
	}
}

global.FileReader = FileReaderMock as any;

// Mock HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
	drawImage: vi.fn(),
	getImageData: vi.fn(),
	putImageData: vi.fn(),
	clearRect: vi.fn(),
	fillRect: vi.fn()
})) as any;

HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
	const blob = new Blob(['test'], { type: 'image/png' });
	callback(blob);
}) as any;

// Cleanup after each test
afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	localStorageMock.clear();
});

// Reset mocks before each test
beforeEach(() => {
	vi.clearAllMocks();
});
