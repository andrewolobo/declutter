import { z } from 'zod';

/**
 * Environment configuration schema
 */
const envSchema = z.object({
	// API Configuration
	VITE_API_URL: z.string().url(),
	VITE_API_TIMEOUT: z.string().transform(Number),
	VITE_API_RETRY_ATTEMPTS: z.string().transform(Number).default('3'),
	VITE_API_RETRY_DELAY: z.string().transform(Number).default('1000'),

	// OAuth Configuration
	VITE_GOOGLE_CLIENT_ID: z.string(),
	VITE_MICROSOFT_CLIENT_ID: z.string(),
	VITE_FACEBOOK_APP_ID: z.string(),
	VITE_OAUTH_REDIRECT_URI: z.string().url(),

	// App Configuration
	VITE_APP_NAME: z.string().default('DEC_L'),
	VITE_APP_URL: z.string().url(),
	VITE_APP_DESCRIPTION: z.string().default('Modern classifieds platform'),
	VITE_CONTACT_EMAIL: z.string().email().default('support@decl.ug'),

	// Upload Configuration
	VITE_MAX_UPLOAD_SIZE: z.string().transform(Number).default('5242880'),
	VITE_MAX_IMAGES_PER_POST: z.string().transform(Number).default('5'),
	VITE_ALLOWED_IMAGE_TYPES: z.string().default('image/jpeg,image/png,image/gif,image/webp'),

	// Feed Configuration
	VITE_POSTS_PER_PAGE: z.string().transform(Number).default('20'),
	VITE_INFINITE_SCROLL_THRESHOLD: z.string().transform(Number).default('200'),
	VITE_FEED_CACHE_DURATION: z.string().transform(Number).default('300000'),

	// Messaging Configuration
	VITE_MESSAGE_MAX_LENGTH: z.string().transform(Number).default('1000'),
	VITE_MESSAGE_POLLING_INTERVAL: z.string().transform(Number).default('5000'),

	// Payment Configuration
	VITE_CURRENCY: z.string().default('UGX'),
	VITE_PAYMENT_PROVIDER: z.string().default('stripe'),

	// Feature Flags
	VITE_ENABLE_DARK_MODE: z
		.string()
		.transform((v) => v === 'true')
		.default('true'),
	VITE_ENABLE_NOTIFICATIONS: z
		.string()
		.transform((v) => v === 'true')
		.default('true'),
	VITE_ENABLE_ANALYTICS: z
		.string()
		.transform((v) => v === 'true')
		.default('false'),
	VITE_ENABLE_PWA: z
		.string()
		.transform((v) => v === 'true')
		.default('true'),

	// Development
	VITE_DEBUG_MODE: z
		.string()
		.transform((v) => v === 'true')
		.default('false'),
	VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});

/**
 * Validates and parses environment variables
 */
function parseEnv() {
	try {
		return envSchema.parse(import.meta.env);
	} catch (error) {
		console.error('❌ Invalid environment variables:', error);
		throw new Error('Invalid environment configuration');
	}
}

// Parse and export environment configuration
const env = parseEnv();

/**
 * Application configuration derived from environment variables
 */
export const config = {
	api: {
		baseUrl: env.VITE_API_URL,
		timeout: env.VITE_API_TIMEOUT,
		retryAttempts: env.VITE_API_RETRY_ATTEMPTS,
		retryDelay: env.VITE_API_RETRY_DELAY
	},
	oauth: {
		google: {
			clientId: env.VITE_GOOGLE_CLIENT_ID
		},
		microsoft: {
			clientId: env.VITE_MICROSOFT_CLIENT_ID
		},
		facebook: {
			appId: env.VITE_FACEBOOK_APP_ID
		},
		redirectUri: env.VITE_OAUTH_REDIRECT_URI
	},
	app: {
		name: env.VITE_APP_NAME,
		url: env.VITE_APP_URL,
		description: env.VITE_APP_DESCRIPTION,
		contactEmail: env.VITE_CONTACT_EMAIL
	},
	upload: {
		maxSize: env.VITE_MAX_UPLOAD_SIZE,
		maxImagesPerPost: env.VITE_MAX_IMAGES_PER_POST,
		allowedImageTypes: env.VITE_ALLOWED_IMAGE_TYPES.split(',').map((type) => type.trim())
	},
	feed: {
		postsPerPage: env.VITE_POSTS_PER_PAGE,
		scrollThreshold: env.VITE_INFINITE_SCROLL_THRESHOLD,
		cacheDuration: env.VITE_FEED_CACHE_DURATION
	},
	messaging: {
		maxLength: env.VITE_MESSAGE_MAX_LENGTH,
		pollingInterval: env.VITE_MESSAGE_POLLING_INTERVAL
	},
	payment: {
		currency: env.VITE_CURRENCY,
		provider: env.VITE_PAYMENT_PROVIDER
	},
	features: {
		darkMode: env.VITE_ENABLE_DARK_MODE,
		notifications: env.VITE_ENABLE_NOTIFICATIONS,
		analytics: env.VITE_ENABLE_ANALYTICS,
		pwa: env.VITE_ENABLE_PWA
	},
	dev: {
		debugMode: env.VITE_DEBUG_MODE,
		logLevel: env.VITE_LOG_LEVEL
	}
} as const;

/**
 * Check if running in development mode
 */
export const isDevelopment = import.meta.env.DEV;

/**
 * Check if running in production mode
 */
export const isProduction = import.meta.env.PROD;

/**
 * Check if server-side rendering
 */
export const isServer = typeof window === 'undefined';

/**
 * Check if client-side
 */
export const isClient = !isServer;
