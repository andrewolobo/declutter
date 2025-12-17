import type { AxiosError } from 'axios';

export interface ClientError {
	message: string;
	code?: string;
	status?: number;
	details?: unknown;
}

export class AppError extends Error {
	code?: string;
	status?: number;
	details?: unknown;

	constructor(message: string, code?: string, status?: number, details?: unknown) {
		super(message);
		this.name = 'AppError';
		this.code = code;
		this.status = status;
		this.details = details;
	}
}

/**
 * Handles API errors and converts them to a standardized format
 */
export function handleApiError(error: unknown): ClientError {
	if (isAxiosError(error)) {
		const axiosError = error as AxiosError<{ message?: string; error?: string }>;

		return {
			message:
				axiosError.response?.data?.message ||
				axiosError.response?.data?.error ||
				axiosError.message ||
				'An unexpected error occurred',
			code: axiosError.code,
			status: axiosError.response?.status,
			details: axiosError.response?.data
		};
	}

	if (error instanceof AppError) {
		return {
			message: error.message,
			code: error.code,
			status: error.status,
			details: error.details
		};
	}

	if (error instanceof Error) {
		return {
			message: error.message
		};
	}

	return {
		message: 'An unexpected error occurred'
	};
}

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError {
	return (error as AxiosError).isAxiosError === true;
}

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
	return false;
}

/**
 * Checks if an error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
	const apiError = handleApiError(error);
	return apiError.status === 401 || apiError.status === 403;
}

/**
 * Checks if an error is a validation error
 */
export function isValidationError(error: unknown): boolean {
	const apiError = handleApiError(error);
	return apiError.status === 400 || apiError.status === 422;
}
