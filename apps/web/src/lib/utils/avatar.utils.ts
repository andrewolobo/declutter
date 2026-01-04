/**
 * DiceBear avatar generation utilities
 * Generates unique avatar URLs using the DiceBear API
 */

export const AVATAR_STYLES = [
	'avataaars',
	'bottts',
	'pixel-art',
	'adventurer',
	'fun-emoji',
	'big-ears',
	'personas',
	'micah',
	'lorelei',
	'croodles',
	'open-peeps',
	'miniavs',
	'adventurer-neutral',
	'avataaars-neutral',
	'big-ears-neutral'
] as const;

export type AvatarStyle = (typeof AVATAR_STYLES)[number];

/**
 * Generates a DiceBear avatar URL for a given style and seed
 * @param style - The avatar style (e.g., 'avataaars', 'bottts')
 * @param seed - Unique identifier for the avatar (e.g., email, user ID)
 * @returns The complete DiceBear API URL
 */
export function generateAvatarUrl(style: AvatarStyle, seed: string): string {
	const encodedSeed = encodeURIComponent(seed);
	return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}`;
}

/**
 * Generates a set of 15 unique avatar URLs using different styles
 * @param seed - Unique identifier for the avatar set (e.g., email)
 * @returns Array of avatar objects with style and URL
 */
export function generateAvatarSet(seed: string): Array<{ style: AvatarStyle; url: string }> {
	return AVATAR_STYLES.map((style) => ({
		style,
		url: generateAvatarUrl(style, seed)
	}));
}

/**
 * Creates a shortened, URL-safe seed from an email address
 * @param email - User's email address
 * @returns Base64-encoded shortened seed
 */
export function generateSeedFromEmail(email: string): string {
	try {
		// Base64 encode and take first 20 characters for cleaner URLs
		return btoa(email).substring(0, 20);
	} catch {
		// Fallback if btoa fails (e.g., non-Latin characters)
		return email.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
	}
}
