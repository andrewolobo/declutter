/**
 * Formats a number as currency (UGX)
 */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-UG', {
		style: 'currency',
		currency: 'UGX',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	const now = new Date();
	const diff = now.getTime() - dateObj.getTime();

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
	if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
	if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
	if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
	if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	return 'Just now';
}

/**
 * Formats a date to a localized string
 */
export function formatDate(
	date: Date | string,
	format: 'short' | 'long' | 'full' = 'short'
): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;

	switch (format) {
		case 'short':
			return dateObj.toLocaleDateString('en-UG', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		case 'long':
			return dateObj.toLocaleDateString('en-UG', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		case 'full':
			return dateObj.toLocaleDateString('en-UG', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		default:
			return dateObj.toLocaleDateString();
	}
}

/**
 * Formats a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.substring(0, maxLength)}...`;
}

/**
 * Formats a phone number (Uganda format)
 */
export function formatPhoneNumber(phone: string): string {
	// Remove all non-numeric characters
	const cleaned = phone.replace(/\D/g, '');

	// Format as +256 XXX XXX XXX
	if (cleaned.startsWith('256')) {
		return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
	}

	// Format as 0XXX XXX XXX
	if (cleaned.startsWith('0')) {
		return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
	}

	return phone;
}

/**
 * Capitalizes the first letter of each word
 */
export function capitalizeWords(text: string): string {
	return text
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
