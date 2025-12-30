import type { AxiosError } from 'axios';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ClientError {
	message: string;
	code?: string;
	status?: number;
	details?: unknown;
	retryable?: boolean;
	timestamp?: number;
}

export interface RetryConfig {
	maxRetries: number;
	retryDelay: number;
	retryableStatusCodes: number[];
	backoffMultiplier: number;
}

export interface ErrorLogEntry {
	timestamp: number;
	method?: string;
	url?: string;
	status?: number;
	message: string;
	code?: string;
	details?: unknown;
	stack?: string;
}

// ============================================================================
// Error Classes
// ============================================================================

export class AppError extends Error {
	code?: string;
	status?: number;
	details?: unknown;
	retryable: boolean;
	timestamp: number;

	constructor(
		message: string,
		code?: string,
		status?: number,
		details?: unknown,
		retryable = false
	) {
		super(message);
		this.name = 'AppError';
		this.code = code;
		this.status = status;
		this.details = details;
		this.retryable = retryable;
		this.timestamp = Date.now();
	}
}

export class NetworkError extends AppError {
	constructor(message = 'Network connection failed', details?: unknown) {
		super(message, 'ERR_NETWORK', 0, details, true);
		this.name = 'NetworkError';
	}
}

export class TimeoutError extends AppError {
	constructor(message = 'Request timeout', details?: unknown) {
		super(message, 'ERR_TIMEOUT', 0, details, true);
		this.name = 'TimeoutError';
	}
}

export class ServerError extends AppError {
	constructor(message = 'Server error', status = 500, details?: unknown) {
		super(message, 'ERR_SERVER', status, details, true);
		this.name = 'ServerError';
	}
}

export class ValidationError extends AppError {
	constructor(message = 'Validation failed', details?: unknown) {
		super(message, 'ERR_VALIDATION', 400, details, false);
		this.name = 'ValidationError';
	}
}

export class AuthenticationError extends AppError {
	constructor(message = 'Authentication failed', details?: unknown) {
		super(message, 'ERR_AUTH', 401, details, false);
		this.name = 'AuthenticationError';
	}
}

export class AuthorizationError extends AppError {
	constructor(message = 'Access denied', details?: unknown) {
		super(message, 'ERR_FORBIDDEN', 403, details, false);
		this.name = 'AuthorizationError';
	}
}

export class NotFoundError extends AppError {
	constructor(message = 'Resource not found', details?: unknown) {
		super(message, 'ERR_NOT_FOUND', 404, details, false);
		this.name = 'NotFoundError';
	}
}

export class RateLimitError extends AppError {
	constructor(message = 'Rate limit exceeded', details?: unknown) {
		super(message, 'ERR_RATE_LIMIT', 429, details, true);
		this.name = 'RateLimitError';
	}
}

// ============================================================================
// Error Logging
// ============================================================================

const errorLog: ErrorLogEntry[] = [];
const MAX_LOG_ENTRIES = 100;

/**
 * Log error for debugging
 */
export function logError(error: ClientError, context?: { method?: string; url?: string }): void {
	const entry: ErrorLogEntry = {
		timestamp: Date.now(),
		method: context?.method,
		url: context?.url,
		status: error.status,
		message: error.message,
		code: error.code,
		details: error.details,
		stack: error instanceof Error ? error.stack : undefined
	};

	errorLog.push(entry);

	// Keep only last MAX_LOG_ENTRIES
	if (errorLog.length > MAX_LOG_ENTRIES) {
		errorLog.shift();
	}

	// Log to console in development
	if (import.meta.env.DEV) {
		console.error('[Error Log]', entry);
	}
}

/**
 * Get error log entries
 */
export function getErrorLog(): ErrorLogEntry[] {
	return [...errorLog];
}

/**
 * Clear error log
 */
export function clearErrorLog(): void {
	errorLog.length = 0;
}

/**
 * Get recent errors (last N entries)
 */
export function getRecentErrors(count = 10): ErrorLogEntry[] {
	return errorLog.slice(-count);
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Handles API errors and converts them to a standardized format
 */
export function handleApiError(
	error: unknown,
	context?: { method?: string; url?: string }
): ClientError {
	let clientError: ClientError;

	if (isAxiosError(error)) {
		const axiosError = error as AxiosError<{ message?: string; error?: string }>;
		const status = axiosError.response?.status || 0;

		// Determine error type based on status code or error code
		if (!axiosError.response && axiosError.code === 'ECONNABORTED') {
			clientError = {
				message: 'Request timeout. Please try again.',
				code: 'ERR_TIMEOUT',
				status: 0,
				retryable: true,
				timestamp: Date.now(),
				details: axiosError.response?.data
			};
		} else if (!axiosError.response) {
			clientError = {
				message: 'Network connection failed. Please check your internet connection.',
				code: 'ERR_NETWORK',
				status: 0,
				retryable: true,
				timestamp: Date.now(),
				details: axiosError.response?.data
			};
		} else if (status === 401) {
			clientError = {
				message: axiosError.response?.data?.message || 'Authentication required',
				code: 'ERR_AUTH',
				status: 401,
				retryable: false,
				timestamp: Date.now(),
				details: axiosError.response?.data
			};
		} else if (status === 403) {
			clientError = {
				message: axiosError.response?.data?.message || 'Access denied',
				code: 'ERR_FORBIDDEN',
				status: 403,
				retryable: false,
				timestamp: Date.now(),
				details: axiosError.response?.data
			};
		} else if (status === 404) {
			clientError = {
				message: axiosError.response?.data?.message || 'Resource not found',
				code: 'ERR_NOT_FOUND',
				status: 404,
				retryable: false,
				timestamp: Date.now(),
				details: axiosError.response?.data
			};
		} else if (status === 429) {
			clientError = {
				message: axiosError.response?.data?.message || 'Too many requests. Please try again later.',
				code: 'ERR_RATE_LIMIT',
				status: 429,
				retryable: true,
				timestamp: Date.now(),
				details: axiosError.response?.data
			};
		} else if (status >= 500) {
			clientError = {
				message: axiosError.response?.data?.message || 'Server error. Please try again later.',
				code: 'ERR_SERVER',
				status,
				retryable: true,
				timestamp: Date.now(),
				details: axiosError.response?.data
			};
		} else if (status >= 400) {
			clientError = {
				message:
					axiosError.response?.data?.message ||
					axiosError.response?.data?.error ||
					'Request failed',
				code: 'ERR_BAD_REQUEST',
				status,
				retryable: false,
				timestamp: Date.now(),
				details: axiosError.response?.data
			};
		} else {
			clientError = {
				message: axiosError.message || 'An unexpected error occurred',
				code: axiosError.code,
				status,
				retryable: false,
				timestamp: Date.now(),
				details: axiosError.response?.data
			};
		}
	} else if (error instanceof AppError) {
		clientError = {
			message: error.message,
			code: error.code,
			status: error.status,
			retryable: error.retryable,
			timestamp: error.timestamp,
			details: error.details
		};
	} else if (error instanceof Error) {
		clientError = {
			message: error.message,
			retryable: false,
			timestamp: Date.now()
		};
	} else {
		clientError = {
			message: 'An unexpected error occurred',
			retryable: false,
			timestamp: Date.now()
		};
	}

	// Log the error
	logError(clientError, context);

	return clientError;
}

/**
 * Main error handler (legacy compatibility)
 */
export function handleError(error: unknown): AppError {
	const clientError = handleApiError(error);

	// Convert to AppError for throwing
	if (clientError.status === 401) {
		return new AuthenticationError(clientError.message, clientError.details);
	} else if (clientError.status === 403) {
		return new AuthorizationError(clientError.message, clientError.details);
	} else if (clientError.status === 404) {
		return new NotFoundError(clientError.message, clientError.details);
	} else if (clientError.status === 429) {
		return new RateLimitError(clientError.message, clientError.details);
	} else if (clientError.status && clientError.status >= 500) {
		return new ServerError(clientError.message, clientError.status, clientError.details);
	} else if (clientError.code === 'ERR_NETWORK') {
		return new NetworkError(clientError.message, clientError.details);
	} else if (clientError.code === 'ERR_TIMEOUT') {
		return new TimeoutError(clientError.message, clientError.details);
	} else if (clientError.status === 400 || clientError.status === 422) {
		return new ValidationError(clientError.message, clientError.details);
	}

	return new AppError(
		clientError.message,
		clientError.code,
		clientError.status,
		clientError.details,
		clientError.retryable
	);
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError {
	return (error as AxiosError).isAxiosError === true;
}

/**
 * Type guard for AppError
 */
export function isAppError(error: unknown): error is AppError {
	return error instanceof AppError;
}

// ============================================================================
// Error Utilities
// ============================================================================

/**
 * Gets a user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
	const apiError = handleApiError(error);
	return apiError.message;
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
	if (isAxiosError(error)) {
		return !error.response && error.code === 'ERR_NETWORK';
	}
	if (error instanceof NetworkError) {
		return true;
	}
	return false;
}

/**
 * Checks if an error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
	if (isAxiosError(error)) {
		return error.code === 'ECONNABORTED';
	}
	if (error instanceof TimeoutError) {
		return true;
	}
	return false;
}

/**
 * Checks if an error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
	if (error instanceof AuthenticationError) {
		return true;
	}
	const apiError = handleApiError(error);
	return apiError.status === 401 || apiError.status === 403;
}

/**
 * Checks if an error is a validation error
 */
export function isValidationError(error: unknown): boolean {
	if (error instanceof ValidationError) {
		return true;
	}
	const apiError = handleApiError(error);
	return apiError.status === 400 || apiError.status === 422;
}

/**
 * Checks if an error is a server error
 */
export function isServerError(error: unknown): boolean {
	if (error instanceof ServerError) {
		return true;
	}
	const apiError = handleApiError(error);
	return !!apiError.status && apiError.status >= 500;
}

/**
 * Checks if an error is retryable
 */
export function isRetryable(error: unknown): boolean {
	if (isAppError(error)) {
		return error.retryable;
	}

	// Network, timeout, rate limit, and server errors are retryable
	return (
		isNetworkError(error) ||
		isTimeoutError(error) ||
		isServerError(error) ||
		isRateLimitError(error)
	);
}

/**
 * Checks if an error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
	if (error instanceof RateLimitError) {
		return true;
	}
	const apiError = handleApiError(error);
	return apiError.status === 429;
}

/**
 * Checks if an error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
	if (error instanceof NotFoundError) {
		return true;
	}
	const apiError = handleApiError(error);
	return apiError.status === 404;
}

// ============================================================================
// Retry Logic
// ============================================================================

const DEFAULT_RETRY_CONFIG: RetryConfig = {
	maxRetries: 3,
	retryDelay: 1000, // 1 second
	retryableStatusCodes: [408, 429, 500, 502, 503, 504],
	backoffMultiplier: 2
};

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	config: Partial<RetryConfig> = {}
): Promise<T> {
	const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
	let lastError: unknown;

	for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;

			// Check if error is retryable
			if (!isRetryable(error)) {
				throw error;
			}

			// Check if we have retries left
			if (attempt === retryConfig.maxRetries) {
				throw error;
			}

			// Calculate delay with exponential backoff
			const delay = retryConfig.retryDelay * Math.pow(retryConfig.backoffMultiplier, attempt);

			// Log retry attempt
			if (import.meta.env.DEV) {
				console.log(
					`[Retry] Attempt ${attempt + 1}/${retryConfig.maxRetries} failed. Retrying in ${delay}ms...`
				);
			}

			// Wait before retrying
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError;
}

/**
 * Retry with custom condition
 */
export async function retryWithCondition<T>(
	fn: () => Promise<T>,
	shouldRetry: (error: unknown, attempt: number) => boolean,
	maxRetries = 3,
	delay = 1000
): Promise<T> {
	let lastError: unknown;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;

			if (!shouldRetry(error, attempt) || attempt === maxRetries) {
				throw error;
			}

			await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
		}
	}

	throw lastError;
}

// ============================================================================
// Error Recovery
// ============================================================================

/**
 * Attempt to recover from an error with fallback
 */
export async function withFallback<T>(
	primaryFn: () => Promise<T>,
	fallbackFn: () => Promise<T>
): Promise<T> {
	try {
		return await primaryFn();
	} catch (error) {
		if (import.meta.env.DEV) {
			console.warn('[Fallback] Primary function failed, using fallback:', error);
		}
		return await fallbackFn();
	}
}

/**
 * Attempt to recover from an error with default value
 */
export async function withDefault<T>(fn: () => Promise<T>, defaultValue: T): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		if (import.meta.env.DEV) {
			console.warn('[Default] Function failed, using default value:', error);
		}
		return defaultValue;
	}
}

/**
 * Circuit breaker pattern for preventing cascading failures
 */
export class CircuitBreaker {
	private failureCount = 0;
	private lastFailureTime = 0;
	private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

	constructor(
		private threshold = 5,
		private timeout = 60000 // 1 minute
	) {}

	async execute<T>(fn: () => Promise<T>): Promise<T> {
		// Check if circuit is open
		if (this.state === 'OPEN') {
			const timeSinceLastFailure = Date.now() - this.lastFailureTime;

			if (timeSinceLastFailure >= this.timeout) {
				this.state = 'HALF_OPEN';
			} else {
				throw new AppError(
					'Service temporarily unavailable',
					'ERR_CIRCUIT_OPEN',
					503,
					undefined,
					true
				);
			}
		}

		try {
			const result = await fn();

			// Success - reset circuit
			if (this.state === 'HALF_OPEN') {
				this.state = 'CLOSED';
				this.failureCount = 0;
			}

			return result;
		} catch (error) {
			this.failureCount++;
			this.lastFailureTime = Date.now();

			// Open circuit if threshold exceeded
			if (this.failureCount >= this.threshold) {
				this.state = 'OPEN';
			}

			throw error;
		}
	}

	reset(): void {
		this.state = 'CLOSED';
		this.failureCount = 0;
		this.lastFailureTime = 0;
	}

	getState(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
		return this.state;
	}
}

// ============================================================================
// Error Reporting
// ============================================================================

export interface ErrorReport {
	totalErrors: number;
	errorsByType: Record<string, number>;
	errorsByStatus: Record<number, number>;
	recentErrors: ErrorLogEntry[];
	retryableErrors: number;
	networkErrors: number;
}

/**
 * Generate error report
 */
export function generateErrorReport(): ErrorReport {
	const errorsByType: Record<string, number> = {};
	const errorsByStatus: Record<number, number> = {};
	let retryableErrors = 0;
	let networkErrors = 0;

	for (const entry of errorLog) {
		// Count by type
		const type = entry.code || 'UNKNOWN';
		errorsByType[type] = (errorsByType[type] || 0) + 1;

		// Count by status
		if (entry.status) {
			errorsByStatus[entry.status] = (errorsByStatus[entry.status] || 0) + 1;
		}

		// Count special types
		if (entry.code === 'ERR_NETWORK') networkErrors++;
		if (entry.status && (entry.status >= 500 || entry.status === 429)) retryableErrors++;
	}

	return {
		totalErrors: errorLog.length,
		errorsByType,
		errorsByStatus,
		recentErrors: getRecentErrors(10),
		retryableErrors,
		networkErrors
	};
}
