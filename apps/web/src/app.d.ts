// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_API_TIMEOUT: string;
	readonly VITE_API_RETRY_ATTEMPTS: string;
	readonly VITE_API_RETRY_DELAY: string;
	readonly VITE_GOOGLE_CLIENT_ID: string;
	readonly VITE_MICROSOFT_CLIENT_ID: string;
	readonly VITE_FACEBOOK_APP_ID: string;
	readonly VITE_OAUTH_REDIRECT_URI: string;
	readonly VITE_APP_NAME: string;
	readonly VITE_APP_URL: string;
	readonly VITE_APP_DESCRIPTION: string;
	readonly VITE_CONTACT_EMAIL: string;
	readonly VITE_MAX_UPLOAD_SIZE: string;
	readonly VITE_MAX_IMAGES_PER_POST: string;
	readonly VITE_ALLOWED_IMAGE_TYPES: string;
	readonly VITE_POSTS_PER_PAGE: string;
	readonly VITE_INFINITE_SCROLL_THRESHOLD: string;
	readonly VITE_FEED_CACHE_DURATION: string;
	readonly VITE_MESSAGE_MAX_LENGTH: string;
	readonly VITE_MESSAGE_POLLING_INTERVAL: string;
	readonly VITE_CURRENCY: string;
	readonly VITE_PAYMENT_PROVIDER: string;
	readonly VITE_ENABLE_DARK_MODE: string;
	readonly VITE_ENABLE_NOTIFICATIONS: string;
	readonly VITE_ENABLE_ANALYTICS: string;
	readonly VITE_ENABLE_PWA: string;
	readonly VITE_DEBUG_MODE: string;
	readonly VITE_LOG_LEVEL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

export {};
