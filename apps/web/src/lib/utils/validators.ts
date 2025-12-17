import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation schema
 * Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
 */
export const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/[0-9]/, 'Password must contain at least one number')
	.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Username validation schema
 */
export const usernameSchema = z
	.string()
	.min(3, 'Username must be at least 3 characters')
	.max(30, 'Username must not exceed 30 characters')
	.regex(
		/^[a-zA-Z0-9_-]+$/,
		'Username can only contain letters, numbers, underscores, and hyphens'
	);

/**
 * Phone number validation (Uganda format)
 */
export const phoneSchema = z
	.string()
	.regex(/^(\+256|0)[0-9]{9}$/, 'Invalid phone number. Format: +256XXXXXXXXX or 0XXXXXXXXX');

/**
 * URL validation
 */
export const urlSchema = z.string().url('Invalid URL');

/**
 * Price validation (positive number)
 */
export const priceSchema = z
	.number()
	.positive('Price must be positive')
	.max(999999999, 'Price is too high');

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
	try {
		emailSchema.parse(email);
		return true;
	} catch {
		return false;
	}
}

/**
 * Validates a password
 */
export function isValidPassword(password: string): boolean {
	try {
		passwordSchema.parse(password);
		return true;
	} catch {
		return false;
	}
}

/**
 * Validates a username
 */
export function isValidUsername(username: string): boolean {
	try {
		usernameSchema.parse(username);
		return true;
	} catch {
		return false;
	}
}

/**
 * Sanitizes HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
	const div = document.createElement('div');
	div.textContent = html;
	return div.innerHTML;
}

/**
 * Validates file size
 */
export function isValidFileSize(file: File, maxSizeInMB: number): boolean {
	const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
	return file.size <= maxSizeInBytes;
}

/**
 * Validates file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
	return allowedTypes.includes(file.type);
}

/**
 * Validates image file
 */
export function isValidImage(file: File, maxSizeInMB: number = 5): boolean {
	const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
	return isValidFileType(file, allowedTypes) && isValidFileSize(file, maxSizeInMB);
}
