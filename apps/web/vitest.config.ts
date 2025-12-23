import { defineConfig } from 'vitest/config';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		svelte({
			hot: !process.env.VITEST,
			compilerOptions: {
				dev: false
			},
			preprocess: vitePreprocess()
		})
	],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/tests/setup.ts'],
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['node_modules', 'dist', '.svelte-kit'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			exclude: [
				'node_modules/',
				'src/tests/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/mockData/',
				'dist/',
				'.svelte-kit/'
			],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 75,
				statements: 80
			}
		}
	},
	resolve: {
		alias: {
			$lib: resolve(__dirname, './src/lib'),
			$types: resolve(__dirname, './src/lib/types'),
			$tests: resolve(__dirname, './src/tests')
		},
		// Force browser-compatible Svelte in tests
		conditions: ['browser']
	}
});
