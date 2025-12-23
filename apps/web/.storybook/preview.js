import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/app.css';

/** @type { import('@storybook/svelte').Preview } */
const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		backgrounds: {
			default: 'light',
			values: [
				{
					name: 'light',
					value: '#f6f8f8'
				},
				{
					name: 'dark',
					value: '#102222'
				}
			]
		},
		layout: 'centered'
	},
	decorators: [
		withThemeByClassName({
			themes: {
				light: '',
				dark: 'dark'
			},
			defaultTheme: 'light'
		})
	]
};

export default preview;
