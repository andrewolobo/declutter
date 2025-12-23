import { vi } from 'vitest';

// Mock the Icon component to avoid CSS preprocessing issues during tests
vi.mock('$lib/components/ui/Icon.svelte', () => {
	return {
		default: class MockIcon {
			$$prop_def = {
				name: '',
				size: 24,
				fill: 0,
				weight: 400,
				grade: 0,
				opsz: 24,
				class: '',
				ariaLabel: ''
			};

			constructor(options: any) {
				// Mock constructor
			}
		}
	};
});
