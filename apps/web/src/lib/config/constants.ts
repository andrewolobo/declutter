/**
 * Application-wide constants
 */

// Local Storage Keys
export const STORAGE_KEYS = {
	ACCESS_TOKEN: 'decl_access_token',
	REFRESH_TOKEN: 'decl_refresh_token',
	USER: 'decl_user',
	THEME: 'decl_theme',
	LANGUAGE: 'decl_language',
	DRAFT_POST: 'decl_draft_post',
	FEED_CACHE: 'decl_feed_cache'
} as const;

// API Endpoints
export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		LOGOUT: '/auth/logout',
		REFRESH: '/auth/refresh',
		ME: '/auth/me',
		GOOGLE: '/auth/google',
		MICROSOFT: '/auth/microsoft',
		FACEBOOK: '/auth/facebook'
	},
	USERS: {
		BASE: '/users',
		PROFILE: '/users/profile',
		UPDATE: '/users/profile',
		BY_ID: (id: string) => `/users/${id}`,
		BY_USERNAME: (username: string) => `/users/username/${username}`
	},
	POSTS: {
		BASE: '/posts',
		BY_ID: (id: string) => `/posts/${id}`,
		CREATE: '/posts',
		UPDATE: (id: string) => `/posts/${id}`,
		DELETE: (id: string) => `/posts/${id}`,
		MY_POSTS: '/posts/my-posts',
		FEED: '/posts/feed',
		SEARCH: '/posts/search',
		UPLOAD_IMAGE: '/posts/upload'
	},
	CATEGORIES: {
		BASE: '/categories',
		BY_ID: (id: string) => `/categories/${id}`
	},
	MESSAGES: {
		BASE: '/messages',
		THREAD: (threadId: string) => `/messages/thread/${threadId}`,
		SEND: '/messages/send',
		THREADS: '/messages/threads'
	},
	PAYMENTS: {
		BASE: '/payments',
		TIERS: '/payments/tiers',
		PROCESS: '/payments/process',
		HISTORY: '/payments/history'
	}
} as const;

// Post Status
export const POST_STATUS = {
	DRAFT: 'draft',
	PENDING: 'pending_approval',
	APPROVED: 'approved',
	REJECTED: 'rejected',
	EXPIRED: 'expired'
} as const;

// Post Visibility Tiers
export const VISIBILITY_TIERS = {
	STANDARD: 'standard',
	FEATURED: 'featured',
	PREMIUM: 'premium'
} as const;

// User Roles
export const USER_ROLES = {
	USER: 'user',
	ADMIN: 'admin'
} as const;

// OAuth Providers
export const OAUTH_PROVIDERS = {
	GOOGLE: 'google',
	MICROSOFT: 'microsoft',
	FACEBOOK: 'facebook'
} as const;

// Image Upload
export const IMAGE_CONFIG = {
	MAX_SIZE: 5 * 1024 * 1024, // 5MB
	MAX_FILES: 5,
	ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
	ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
} as const;

// Pagination
export const PAGINATION = {
	DEFAULT_PAGE: 1,
	DEFAULT_LIMIT: 20,
	MAX_LIMIT: 100
} as const;

// Validation
export const VALIDATION = {
	USERNAME: {
		MIN_LENGTH: 3,
		MAX_LENGTH: 30,
		PATTERN: /^[a-zA-Z0-9_-]+$/
	},
	PASSWORD: {
		MIN_LENGTH: 8,
		MAX_LENGTH: 100,
		PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
	},
	POST_TITLE: {
		MIN_LENGTH: 5,
		MAX_LENGTH: 100
	},
	POST_DESCRIPTION: {
		MIN_LENGTH: 20,
		MAX_LENGTH: 2000
	},
	POST_PRICE: {
		MIN: 0,
		MAX: 999999999
	},
	MESSAGE: {
		MAX_LENGTH: 1000
	}
} as const;

// Date Formats
export const DATE_FORMATS = {
	SHORT: 'short',
	LONG: 'long',
	FULL: 'full'
} as const;

// Theme
export const THEME = {
	LIGHT: 'light',
	DARK: 'dark',
	SYSTEM: 'system'
} as const;

// Toast Types
export const TOAST_TYPES = {
	SUCCESS: 'success',
	ERROR: 'error',
	WARNING: 'warning',
	INFO: 'info'
} as const;

// Toast Duration (milliseconds)
export const TOAST_DURATION = {
	SHORT: 3000,
	MEDIUM: 5000,
	LONG: 8000
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500
} as const;

// Error Messages
export const ERROR_MESSAGES = {
	NETWORK_ERROR: 'Network error. Please check your internet connection.',
	UNAUTHORIZED: 'You are not authorized to perform this action.',
	FORBIDDEN: 'Access denied.',
	NOT_FOUND: 'The requested resource was not found.',
	VALIDATION_ERROR: 'Please check your input and try again.',
	SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
	SESSION_EXPIRED: 'Your session has expired. Please log in again.',
	UPLOAD_FAILED: 'File upload failed. Please try again.',
	FILE_TOO_LARGE: 'File is too large. Maximum size is 5MB.',
	INVALID_FILE_TYPE: 'Invalid file type. Only images are allowed.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
	LOGIN: 'Successfully logged in!',
	LOGOUT: 'Successfully logged out!',
	REGISTER: 'Account created successfully!',
	POST_CREATED: 'Post created successfully!',
	POST_UPDATED: 'Post updated successfully!',
	POST_DELETED: 'Post deleted successfully!',
	PROFILE_UPDATED: 'Profile updated successfully!',
	MESSAGE_SENT: 'Message sent successfully!',
	PAYMENT_SUCCESS: 'Payment processed successfully!'
} as const;

// Routes
export const ROUTES = {
	HOME: '/',
	LOGIN: '/auth/login',
	REGISTER: '/auth/register',
	LOGOUT: '/auth/logout',
	OAUTH_CALLBACK: '/auth/callback',
	PROFILE: '/profile',
	EDIT_PROFILE: '/profile/edit',
	USER_PROFILE: (username: string) => `/profile/${username}`,
	POSTS: '/posts',
	POST_DETAIL: (id: string) => `/posts/${id}`,
	POST_CREATE: '/posts/create',
	POST_EDIT: (id: string) => `/posts/edit/${id}`,
	MY_POSTS: '/posts/my-posts',
	MESSAGES: '/messages',
	MESSAGE_THREAD: (threadId: string) => `/messages/${threadId}`,
	PAYMENT: '/payment/select',
	PAYMENT_CONFIRM: '/payment/confirm',
	ADMIN: '/admin',
	ADMIN_POSTS: '/admin/posts',
	ADMIN_CATEGORIES: '/admin/categories'
} as const;

// Breakpoints (matches Tailwind)
export const BREAKPOINTS = {
	SM: 640,
	MD: 768,
	LG: 1024,
	XL: 1280,
	'2XL': 1536
} as const;
