import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	handleApiError,
	handleError,
	AppError,
	NetworkError,
	TimeoutError,
	ServerError,
	ValidationError,
	AuthenticationError,
	AuthorizationError,
	NotFoundError,
	RateLimitError,
	getErrorMessage,
	isNetworkError,
	isTimeoutError,
	isAuthError,
	isValidationError,
	isServerError,
	isRetryable,
	isRateLimitError,
	isNotFoundError,
	isAppError,
	retryWithBackoff,
	retryWithCondition,
	withFallback,
	withDefault,
	CircuitBreaker,
	logError,
	getErrorLog,
	clearErrorLog,
	getRecentErrors,
	generateErrorReport
} from './error-handler';
import type { AxiosError } from 'axios';

describe('Error Handler', () => {
	beforeEach(() => {
		clearErrorLog();
		vi.clearAllMocks();
	});

	// ========================================================================
	// Error Classes Tests
	// ========================================================================

	describe('Error Classes', () => {
		it('creates AppError correctly', () => {
			const error = new AppError('Test error', 'TEST_CODE', 400, { detail: 'test' }, true);

			expect(error.message).toBe('Test error');
			expect(error.name).toBe('AppError');
			expect(error.code).toBe('TEST_CODE');
			expect(error.status).toBe(400);
			expect(error.details).toEqual({ detail: 'test' });
			expect(error.retryable).toBe(true);
			expect(error.timestamp).toBeGreaterThan(0);
		});

		it('creates NetworkError correctly', () => {
			const error = new NetworkError();

			expect(error.message).toBe('Network connection failed');
			expect(error.name).toBe('NetworkError');
			expect(error.code).toBe('ERR_NETWORK');
			expect(error.retryable).toBe(true);
		});

		it('creates TimeoutError correctly', () => {
			const error = new TimeoutError();

			expect(error.message).toBe('Request timeout');
			expect(error.name).toBe('TimeoutError');
			expect(error.code).toBe('ERR_TIMEOUT');
			expect(error.retryable).toBe(true);
		});

		it('creates ServerError correctly', () => {
			const error = new ServerError('Server down', 503);

			expect(error.message).toBe('Server down');
			expect(error.name).toBe('ServerError');
			expect(error.code).toBe('ERR_SERVER');
			expect(error.status).toBe(503);
			expect(error.retryable).toBe(true);
		});

		it('creates ValidationError correctly', () => {
			const error = new ValidationError('Invalid input');

			expect(error.message).toBe('Invalid input');
			expect(error.name).toBe('ValidationError');
			expect(error.code).toBe('ERR_VALIDATION');
			expect(error.status).toBe(400);
			expect(error.retryable).toBe(false);
		});

		it('creates AuthenticationError correctly', () => {
			const error = new AuthenticationError('Invalid token');

			expect(error.message).toBe('Invalid token');
			expect(error.name).toBe('AuthenticationError');
			expect(error.code).toBe('ERR_AUTH');
			expect(error.status).toBe(401);
			expect(error.retryable).toBe(false);
		});

		it('creates AuthorizationError correctly', () => {
			const error = new AuthorizationError();

			expect(error.message).toBe('Access denied');
			expect(error.name).toBe('AuthorizationError');
			expect(error.code).toBe('ERR_FORBIDDEN');
			expect(error.status).toBe(403);
			expect(error.retryable).toBe(false);
		});

		it('creates NotFoundError correctly', () => {
			const error = new NotFoundError('User not found');

			expect(error.message).toBe('User not found');
			expect(error.name).toBe('NotFoundError');
			expect(error.code).toBe('ERR_NOT_FOUND');
			expect(error.status).toBe(404);
			expect(error.retryable).toBe(false);
		});

		it('creates RateLimitError correctly', () => {
			const error = new RateLimitError();

			expect(error.message).toBe('Rate limit exceeded');
			expect(error.name).toBe('RateLimitError');
			expect(error.code).toBe('ERR_RATE_LIMIT');
			expect(error.status).toBe(429);
			expect(error.retryable).toBe(true);
		});
	});

	// ========================================================================
	// handleApiError Tests
	// ========================================================================

	describe('handleApiError', () => {
		it('handles Axios network error', () => {
			const axiosError = {
				isAxiosError: true,
				message: 'Network Error',
				code: 'ERR_NETWORK',
				response: undefined
			} as unknown as AxiosError;

			const result = handleApiError(axiosError);

			expect(result.message).toBe('Network connection failed. Please check your internet connection.');
			expect(result.code).toBe('ERR_NETWORK');
			expect(result.retryable).toBe(true);
		});

		it('handles Axios timeout error', () => {
			const axiosError = {
				isAxiosError: true,
				message: 'timeout of 5000ms exceeded',
				code: 'ECONNABORTED',
				response: undefined
			} as unknown as AxiosError;

			const result = handleApiError(axiosError);

			expect(result.message).toBe('Request timeout. Please try again.');
			expect(result.code).toBe('ERR_TIMEOUT');
			expect(result.retryable).toBe(true);
		});

		it('handles Axios 401 error', () => {
			const axiosError = {
				isAxiosError: true,
				message: 'Request failed with status code 401',
				response: {
					status: 401,
					data: { message: 'Invalid token' }
				}
			} as unknown as AxiosError;

			const result = handleApiError(axiosError);

			expect(result.message).toBe('Invalid token');
			expect(result.code).toBe('ERR_AUTH');
			expect(result.status).toBe(401);
			expect(result.retryable).toBe(false);
		});

		it('handles Axios 403 error', () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 403,
					data: { message: 'Forbidden' }
				}
			} as unknown as AxiosError;

			const result = handleApiError(axiosError);

			expect(result.message).toBe('Forbidden');
			expect(result.code).toBe('ERR_FORBIDDEN');
			expect(result.status).toBe(403);
			expect(result.retryable).toBe(false);
		});

		it('handles Axios 404 error', () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 404,
					data: { message: 'Not found' }
				}
			} as unknown as AxiosError;

			const result = handleApiError(axiosError);

			expect(result.message).toBe('Not found');
			expect(result.code).toBe('ERR_NOT_FOUND');
			expect(result.status).toBe(404);
			expect(result.retryable).toBe(false);
		});

		it('handles Axios 429 error', () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 429,
					data: {}
				}
			} as unknown as AxiosError;

			const result = handleApiError(axiosError);

			expect(result.message).toBe('Too many requests. Please try again later.');
			expect(result.code).toBe('ERR_RATE_LIMIT');
			expect(result.status).toBe(429);
			expect(result.retryable).toBe(true);
		});

		it('handles Axios 500 error', () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 500,
					data: { message: 'Internal server error' }
				}
			} as unknown as AxiosError;

			const result = handleApiError(axiosError);

			expect(result.message).toBe('Internal server error');
			expect(result.code).toBe('ERR_SERVER');
			expect(result.status).toBe(500);
			expect(result.retryable).toBe(true);
		});

		it('handles AppError', () => {
			const appError = new ValidationError('Invalid email');

			const result = handleApiError(appError);

			expect(result.message).toBe('Invalid email');
			expect(result.code).toBe('ERR_VALIDATION');
			expect(result.status).toBe(400);
			expect(result.retryable).toBe(false);
		});

		it('handles generic Error', () => {
			const error = new Error('Something went wrong');

			const result = handleApiError(error);

			expect(result.message).toBe('Something went wrong');
			expect(result.retryable).toBe(false);
		});

		it('handles unknown error', () => {
			const result = handleApiError('Unknown error');

			expect(result.message).toBe('An unexpected error occurred');
			expect(result.retryable).toBe(false);
		});
	});

	// ========================================================================
	// handleError Tests
	// ========================================================================

	describe('handleError', () => {
		it('converts 401 to AuthenticationError', () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 401,
					data: { message: 'Unauthorized' }
				}
			} as unknown as AxiosError;

			const result = handleError(axiosError);

			expect(result).toBeInstanceOf(AuthenticationError);
			expect(result.message).toBe('Unauthorized');
		});

		it('converts 404 to NotFoundError', () => {
			const axiosError = {
				isAxiosError: true,
				response: {
					status: 404,
					data: { message: 'Not found' }
				}
			} as unknown as AxiosError;

			const result = handleError(axiosError);

			expect(result).toBeInstanceOf(NotFoundError);
			expect(result.message).toBe('Not found');
		});

		it('converts network error to NetworkError', () => {
			const axiosError = {
				isAxiosError: true,
				code: 'ERR_NETWORK',
				message: 'Network Error'
			} as unknown as AxiosError;

			const result = handleError(axiosError);

			expect(result).toBeInstanceOf(NetworkError);
		});
	});

	// ========================================================================
	// Type Guard Tests
	// ========================================================================

	describe('Type Guards', () => {
		it('identifies network errors', () => {
			const networkError = new NetworkError();
			const axiosNetworkError = {
				isAxiosError: true,
				code: 'ERR_NETWORK'
			} as unknown as AxiosError;

			expect(isNetworkError(networkError)).toBe(true);
			expect(isNetworkError(axiosNetworkError)).toBe(true);
			expect(isNetworkError(new Error('Test'))).toBe(false);
		});

		it('identifies timeout errors', () => {
			const timeoutError = new TimeoutError();
			const axiosTimeoutError = {
				isAxiosError: true,
				code: 'ECONNABORTED'
			} as unknown as AxiosError;

			expect(isTimeoutError(timeoutError)).toBe(true);
			expect(isTimeoutError(axiosTimeoutError)).toBe(true);
			expect(isTimeoutError(new Error('Test'))).toBe(false);
		});

		it('identifies auth errors', () => {
			const authError = new AuthenticationError();

			expect(isAuthError(authError)).toBe(true);
			expect(isAuthError(new Error('Test'))).toBe(false);
		});

		it('identifies validation errors', () => {
			const validationError = new ValidationError();

			expect(isValidationError(validationError)).toBe(true);
			expect(isValidationError(new Error('Test'))).toBe(false);
		});

		it('identifies server errors', () => {
			const serverError = new ServerError();

			expect(isServerError(serverError)).toBe(true);
			expect(isServerError(new Error('Test'))).toBe(false);
		});

		it('identifies rate limit errors', () => {
			const rateLimitError = new RateLimitError();

			expect(isRateLimitError(rateLimitError)).toBe(true);
			expect(isRateLimitError(new Error('Test'))).toBe(false);
		});

		it('identifies not found errors', () => {
			const notFoundError = new NotFoundError();

			expect(isNotFoundError(notFoundError)).toBe(true);
			expect(isNotFoundError(new Error('Test'))).toBe(false);
		});

		it('identifies AppError', () => {
			const appError = new AppError('Test');

			expect(isAppError(appError)).toBe(true);
			expect(isAppError(new Error('Test'))).toBe(false);
		});

		it('identifies retryable errors', () => {
			expect(isRetryable(new NetworkError())).toBe(true);
			expect(isRetryable(new TimeoutError())).toBe(true);
			expect(isRetryable(new ServerError())).toBe(true);
			expect(isRetryable(new RateLimitError())).toBe(true);
			expect(isRetryable(new ValidationError())).toBe(false);
			expect(isRetryable(new AuthenticationError())).toBe(false);
		});
	});

	// ========================================================================
	// Utility Function Tests
	// ========================================================================

	describe('getErrorMessage', () => {
		it('extracts message from error', () => {
			const error = new ValidationError('Invalid input');

			expect(getErrorMessage(error)).toBe('Invalid input');
		});

		it('handles unknown error', () => {
			expect(getErrorMessage('test')).toBe('An unexpected error occurred');
		});
	});

	// ========================================================================
	// Retry Logic Tests
	// ========================================================================

	describe('retryWithBackoff', () => {
		it('retries failed requests', async () => {
			let attempts = 0;
			const fn = vi.fn(async () => {
				attempts++;
				if (attempts < 3) {
					throw new NetworkError();
				}
				return 'success';
			});

			const result = await retryWithBackoff(fn, {
				maxRetries: 3,
				retryDelay: 10,
				retryableStatusCodes: [],
				backoffMultiplier: 1
			});

			expect(result).toBe('success');
			expect(fn).toHaveBeenCalledTimes(3);
		});

		it('throws on non-retryable errors', async () => {
			const fn = vi.fn(async () => {
				throw new ValidationError();
			});

			await expect(
				retryWithBackoff(fn, {
					maxRetries: 3,
					retryDelay: 10,
					retryableStatusCodes: [],
					backoffMultiplier: 1
				})
			).rejects.toThrow(ValidationError);

			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('throws after max retries', async () => {
			const fn = vi.fn(async () => {
				throw new NetworkError();
			});

			await expect(
				retryWithBackoff(fn, {
					maxRetries: 2,
					retryDelay: 10,
					retryableStatusCodes: [],
					backoffMultiplier: 1
				})
			).rejects.toThrow(NetworkError);

			expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
		});
	});

	describe('retryWithCondition', () => {
		it('retries based on custom condition', async () => {
			let attempts = 0;
			const fn = vi.fn(async () => {
				attempts++;
				if (attempts < 2) {
					throw new Error('Temporary error');
				}
				return 'success';
			});

			const shouldRetry = (error: unknown) => error instanceof Error;

			const result = await retryWithCondition(fn, shouldRetry, 3, 10);

			expect(result).toBe('success');
			expect(fn).toHaveBeenCalledTimes(2);
		});
	});

	// ========================================================================
	// Error Recovery Tests
	// ========================================================================

	describe('withFallback', () => {
		it('uses primary function when successful', async () => {
			const primary = vi.fn(async () => 'primary');
			const fallback = vi.fn(async () => 'fallback');

			const result = await withFallback(primary, fallback);

			expect(result).toBe('primary');
			expect(primary).toHaveBeenCalled();
			expect(fallback).not.toHaveBeenCalled();
		});

		it('uses fallback when primary fails', async () => {
			const primary = vi.fn(async () => {
				throw new Error('Failed');
			});
			const fallback = vi.fn(async () => 'fallback');

			const result = await withFallback(primary, fallback);

			expect(result).toBe('fallback');
			expect(primary).toHaveBeenCalled();
			expect(fallback).toHaveBeenCalled();
		});
	});

	describe('withDefault', () => {
		it('returns function result when successful', async () => {
			const fn = vi.fn(async () => 'result');

			const result = await withDefault(fn, 'default');

			expect(result).toBe('result');
			expect(fn).toHaveBeenCalled();
		});

		it('returns default when function fails', async () => {
			const fn = vi.fn(async () => {
				throw new Error('Failed');
			});

			const result = await withDefault(fn, 'default');

			expect(result).toBe('default');
			expect(fn).toHaveBeenCalled();
		});
	});

	// ========================================================================
	// Circuit Breaker Tests
	// ========================================================================

	describe('CircuitBreaker', () => {
		it('executes function when circuit is closed', async () => {
			const breaker = new CircuitBreaker(3, 1000);
			const fn = vi.fn(async () => 'success');

			const result = await breaker.execute(fn);

			expect(result).toBe('success');
			expect(breaker.getState()).toBe('CLOSED');
		});

		it('opens circuit after threshold failures', async () => {
			const breaker = new CircuitBreaker(2, 1000);
			const fn = vi.fn(async () => {
				throw new Error('Failed');
			});

			// First two failures
			await expect(breaker.execute(fn)).rejects.toThrow();
			await expect(breaker.execute(fn)).rejects.toThrow();

			expect(breaker.getState()).toBe('OPEN');

			// Circuit should be open now
			await expect(breaker.execute(fn)).rejects.toThrow('Service temporarily unavailable');
		});

		it('resets circuit on successful retry', async () => {
			const breaker = new CircuitBreaker(2, 100);
			let attempts = 0;

			const fn = vi.fn(async () => {
				attempts++;
				if (attempts <= 2) {
					throw new Error('Failed');
				}
				return 'success';
			});

			// Trigger failures to open circuit
			await expect(breaker.execute(fn)).rejects.toThrow();
			await expect(breaker.execute(fn)).rejects.toThrow();

			expect(breaker.getState()).toBe('OPEN');

			// Wait for timeout
			await new Promise((resolve) => setTimeout(resolve, 150));

			// Should be half-open now, successful call should close it
			const result = await breaker.execute(fn);
			expect(result).toBe('success');
			expect(breaker.getState()).toBe('CLOSED');
		});
	});

	// ========================================================================
	// Error Logging Tests
	// ========================================================================

	describe('Error Logging', () => {
		it('logs errors', () => {
			const error = {
				message: 'Test error',
				code: 'TEST',
				status: 500,
				timestamp: Date.now()
			};

			logError(error, { method: 'GET', url: '/api/test' });

			const log = getErrorLog();
			expect(log.length).toBe(1);
			expect(log[0].message).toBe('Test error');
			expect(log[0].method).toBe('GET');
			expect(log[0].url).toBe('/api/test');
		});

		it('limits log entries', () => {
			clearErrorLog();

			// Log more than MAX_LOG_ENTRIES
			for (let i = 0; i < 150; i++) {
				logError({
					message: `Error ${i}`,
					timestamp: Date.now()
				});
			}

			const log = getErrorLog();
			expect(log.length).toBe(100); // MAX_LOG_ENTRIES
		});

		it('gets recent errors', () => {
			clearErrorLog();

			for (let i = 0; i < 20; i++) {
				logError({
					message: `Error ${i}`,
					timestamp: Date.now()
				});
			}

			const recent = getRecentErrors(5);
			expect(recent.length).toBe(5);
			expect(recent[4].message).toBe('Error 19'); // Most recent
		});

		it('clears error log', () => {
			logError({ message: 'Test', timestamp: Date.now() });
			expect(getErrorLog().length).toBeGreaterThan(0);

			clearErrorLog();
			expect(getErrorLog().length).toBe(0);
		});
	});

	// ========================================================================
	// Error Reporting Tests
	// ========================================================================

	describe('generateErrorReport', () => {
		it('generates comprehensive error report', () => {
			clearErrorLog();

			// Log various errors
			logError({ message: 'Network error', code: 'ERR_NETWORK', status: 0, timestamp: Date.now() });
			logError({ message: 'Server error', code: 'ERR_SERVER', status: 500, timestamp: Date.now() });
			logError({ message: 'Server error 2', code: 'ERR_SERVER', status: 503, timestamp: Date.now() });
			logError({ message: 'Auth error', code: 'ERR_AUTH', status: 401, timestamp: Date.now() });

			const report = generateErrorReport();

			expect(report.totalErrors).toBe(4);
			expect(report.errorsByType['ERR_NETWORK']).toBe(1);
			expect(report.errorsByType['ERR_SERVER']).toBe(2);
			expect(report.errorsByType['ERR_AUTH']).toBe(1);
			expect(report.errorsByStatus[500]).toBe(1);
			expect(report.errorsByStatus[503]).toBe(1);
			expect(report.errorsByStatus[401]).toBe(1);
			expect(report.networkErrors).toBe(1);
			expect(report.retryableErrors).toBe(2); // Two server errors
			expect(report.recentErrors.length).toBe(4);
		});
	});
});
