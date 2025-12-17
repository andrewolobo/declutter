import axios from 'axios';
import type {
	AxiosInstance,
	AxiosError,
	AxiosRequestConfig,
	InternalAxiosRequestConfig
} from 'axios';
import { config as appConfig, isDevelopment } from '$lib/config';
import { STORAGE_KEYS } from '$lib/config/constants';
import type { ApiResponse, ApiError } from '$types/api.types';
import type { AuthTokens } from '$types/auth.types';

/**
 * Create configured Axios instance
 */
export const apiClient: AxiosInstance = axios.create({
	baseURL: appConfig.api.baseUrl,
	timeout: appConfig.api.timeout,
	headers: {
		'Content-Type': 'application/json'
	}
});

/**
 * Get tokens from localStorage
 */
function getTokens(): AuthTokens | null {
	if (typeof window === 'undefined') return null;

	const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
	const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

	if (!accessToken || !refreshToken) return null;

	return { accessToken, refreshToken };
}

/**
 * Save tokens to localStorage
 */
function saveTokens(tokens: AuthTokens): void {
	if (typeof window === 'undefined') return;

	localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
	localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
}

/**
 * Clear tokens from localStorage
 */
function clearTokens(): void {
	if (typeof window === 'undefined') return;

	localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
	localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
	localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Request interceptor - Add auth token to requests
 */
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const tokens = getTokens();

		if (tokens?.accessToken && config.headers) {
			config.headers.Authorization = `Bearer ${tokens.accessToken}`;
		}

		// Log requests in development
		if (isDevelopment && appConfig.dev.debugMode) {
			console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
				params: config.params,
				data: config.data
			});
		}

		return config;
	},
	(error: AxiosError) => {
		if (isDevelopment) {
			console.error('[API Request Error]', error);
		}
		return Promise.reject(error);
	}
);

/**
 * Track if we're currently refreshing the token
 */
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value: any) => void;
	reject: (error: any) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
function processQueue(error: AxiosError | null, token: string | null = null): void {
	failedQueue.forEach((promise) => {
		if (error) {
			promise.reject(error);
		} else {
			promise.resolve(token);
		}
	});

	failedQueue = [];
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<string> {
	const tokens = getTokens();

	if (!tokens?.refreshToken) {
		throw new Error('No refresh token available');
	}

	try {
		const response = await axios.post<ApiResponse<AuthTokens>>(
			`${appConfig.api.baseUrl}/auth/refresh`,
			{ refreshToken: tokens.refreshToken }
		);

		if (response.data.success && response.data.data) {
			const newTokens = response.data.data;
			saveTokens(newTokens);
			return newTokens.accessToken;
		}

		throw new Error('Token refresh failed');
	} catch (error) {
		clearTokens();
		// Redirect to login - will be handled by the calling code (skip in test environment)
		if (typeof window !== 'undefined' && import.meta.env.MODE !== 'test') {
			window.location.href = '/auth/login';
		}
		throw error;
	}
}

/**
 * Response interceptor - Handle errors and token refresh
 */
apiClient.interceptors.response.use(
	(response) => {
		// Log successful responses in development
		if (isDevelopment && appConfig.dev.debugMode) {
			console.log(
				`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
				{
					status: response.status,
					data: response.data
				}
			);
		}

		return response;
	},
	async (error: AxiosError<ApiError>) => {
		const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

		// Log errors in development
		if (isDevelopment) {
			console.error('[API Response Error]', {
				url: error.config?.url,
				status: error.response?.status,
				message: error.response?.data?.message || error.message,
				error: error.response?.data
			});
		}

		// Handle 401 Unauthorized - Try to refresh token
		if (error.response?.status === 401 && !originalRequest._retry) {
			// Check if we have a refresh token before attempting refresh
			const refreshToken =
				typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) : null;

			if (!refreshToken) {
				// No refresh token available, can't refresh - reject with original error
				clearTokens();
				return Promise.reject(error);
			}

			if (isRefreshing) {
				// Queue this request while token is being refreshed
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${token}`;
						}
						return apiClient(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const newAccessToken = await refreshAccessToken();
				processQueue(null, newAccessToken);

				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				}

				return apiClient(originalRequest);
			} catch (refreshError) {
				processQueue(error, null);
				clearTokens();

				// Redirect to login (skip in test environment)
				if (typeof window !== 'undefined' && import.meta.env.MODE !== 'test') {
					window.location.href =
						'/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
				}

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		// Handle 403 Forbidden
		if (error.response?.status === 403) {
			// Could show a toast notification here
			console.error('Access forbidden');
		}

		// Handle 404 Not Found
		if (error.response?.status === 404) {
			console.error('Resource not found');
		}

		// Handle 429 Rate Limit
		if (error.response?.status === 429) {
			console.error('Rate limit exceeded');
		}

		// Handle 500+ Server Errors
		if (error.response?.status && error.response.status >= 500) {
			console.error('Server error occurred');
		}

		return Promise.reject(error);
	}
);

/**
 * Retry interceptor for failed requests (network errors, etc.)
 */
apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
	const originalRequest = error.config as AxiosRequestConfig & { _retryCount?: number };

	// Don't retry if it's a client error (4xx)
	if (error.response && error.response.status >= 400 && error.response.status < 500) {
		return Promise.reject(error);
	}

	// Initialize retry count (handle case where originalRequest might be undefined in tests)
	if (!originalRequest) {
		return Promise.reject(error);
	}
	if (!originalRequest._retryCount) {
		originalRequest._retryCount = 0;
	}

	// Check if we should retry
	if (originalRequest._retryCount < appConfig.api.retryAttempts) {
		originalRequest._retryCount++;

		// Exponential backoff
		const delay = appConfig.api.retryDelay * Math.pow(2, originalRequest._retryCount - 1);

		if (isDevelopment) {
			console.log(
				`[API Retry] Attempt ${originalRequest._retryCount}/${appConfig.api.retryAttempts} after ${delay}ms`
			);
		}

		await new Promise((resolve) => setTimeout(resolve, delay));

		return apiClient(originalRequest);
	}

	return Promise.reject(error);
});

/**
 * Helper function to make type-safe API calls
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
	try {
		const response = await apiClient.request<ApiResponse<T>>(config);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.data) {
			return error.response.data as ApiResponse<T>;
		}
		throw error;
	}
}

/**
 * Set auth tokens (used after login/register)
 */
export function setAuthTokens(tokens: AuthTokens): void {
	saveTokens(tokens);
}

/**
 * Clear auth tokens (used during logout)
 */
export function clearAuthTokens(): void {
	clearTokens();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
	const tokens = getTokens();
	return tokens !== null && !!tokens.accessToken;
}

export default apiClient;
