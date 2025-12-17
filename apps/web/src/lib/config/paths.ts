/**
 * Path configuration and helper functions
 */

import { config } from './env';

/**
 * Constructs a full API URL from a path
 */
export function apiUrl(path: string): string {
	const baseUrl = config.api.baseUrl.replace(/\/$/, '');
	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	return `${baseUrl}${cleanPath}`;
}

/**
 * Constructs a full application URL from a path
 */
export function appUrl(path: string): string {
	const baseUrl = config.app.url.replace(/\/$/, '');
	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	return `${baseUrl}${cleanPath}`;
}

/**
 * Constructs an OAuth redirect URL
 */
export function oauthRedirectUrl(provider: 'google' | 'microsoft' | 'facebook'): string {
	return `${config.oauth.redirectUri}?provider=${provider}`;
}

/**
 * Constructs a user profile URL
 */
export function userProfileUrl(username: string): string {
	return appUrl(`/profile/${username}`);
}

/**
 * Constructs a post detail URL
 */
export function postDetailUrl(postId: string): string {
	return appUrl(`/posts/${postId}`);
}

/**
 * Constructs an image URL (assumes images are served from API)
 */
export function imageUrl(imagePath: string): string {
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath;
	}
	return apiUrl(`/uploads/${imagePath}`);
}

/**
 * Extracts query parameters from URL
 */
export function getQueryParams(url: string): Record<string, string> {
	const params: Record<string, string> = {};
	const searchParams = new URL(url).searchParams;
	searchParams.forEach((value, key) => {
		params[key] = value;
	});
	return params;
}

/**
 * Builds a URL with query parameters
 */
export function buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
	if (!params) return path;

	const url = new URL(path, window.location.origin);
	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.append(key, String(value));
	});

	return url.toString();
}

/**
 * Checks if a URL is external
 */
export function isExternalUrl(url: string): boolean {
	try {
		const urlObj = new URL(url, window.location.origin);
		return urlObj.origin !== window.location.origin;
	} catch {
		return false;
	}
}
