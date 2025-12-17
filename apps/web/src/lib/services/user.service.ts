import { apiClient } from './api.client';
import type { ApiResponse } from '$types/api.types';
import type {
	UserProfileDTO,
	UpdateProfileDTO,
	ChangePasswordDTO,
	UserPostsSummaryDTO
} from '$types/user.types';
import { STORAGE_KEYS } from '$lib/config/constants';

/**
 * User Service
 * Handles all user profile and preferences API calls
 */

// ============================================================================
// Profile Management
// ============================================================================

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<ApiResponse<UserProfileDTO>> {
	const response = await apiClient.get<ApiResponse<UserProfileDTO>>('/users/profile');

	// Update cached user data
	if (response.data.success && response.data.data) {
		updateCachedUser(response.data.data);
	}

	return response.data;
}

/**
 * Update current user's profile
 */
export async function updateProfile(data: UpdateProfileDTO): Promise<ApiResponse<UserProfileDTO>> {
	const response = await apiClient.put<ApiResponse<UserProfileDTO>>('/users/profile', data);

	// Update cached user data
	if (response.data.success && response.data.data) {
		updateCachedUser(response.data.data);
	}

	return response.data;
}

/**
 * Get user profile by ID (public)
 */
export async function getUserById(userId: number): Promise<ApiResponse<UserProfileDTO>> {
	const response = await apiClient.get<ApiResponse<UserProfileDTO>>(`/users/${userId}`);
	return response.data;
}

// ============================================================================
// Account Security
// ============================================================================

/**
 * Change user password
 */
export async function changePassword(data: ChangePasswordDTO): Promise<ApiResponse<void>> {
	const response = await apiClient.post<ApiResponse<void>>('/users/change-password', data);
	return response.data;
}

/**
 * Delete user account
 */
export async function deleteAccount(): Promise<ApiResponse<void>> {
	const response = await apiClient.delete<ApiResponse<void>>('/users/account');

	// Clear all local data after account deletion
	if (response.data.success) {
		clearUserData();
	}

	return response.data;
}

// ============================================================================
// User Statistics
// ============================================================================

/**
 * Get current user's posts summary (counts by status)
 */
export async function getPostsSummary(): Promise<ApiResponse<UserPostsSummaryDTO>> {
	const response = await apiClient.get<ApiResponse<UserPostsSummaryDTO>>('/users/posts-summary');
	return response.data;
}

// ============================================================================
// Email Verification
// ============================================================================

/**
 * Request new email verification
 */
export async function requestEmailVerification(): Promise<ApiResponse<void>> {
	const response = await apiClient.post<ApiResponse<void>>('/users/request-email-verification');
	return response.data;
}

// Note: verifyEmail is handled by auth.service

// ============================================================================
// Phone Verification
// ============================================================================

/**
 * Request phone verification code
 */
export async function requestPhoneVerification(phoneNumber: string): Promise<ApiResponse<void>> {
	const response = await apiClient.post<ApiResponse<void>>('/users/request-phone-verification', {
		phoneNumber
	});
	return response.data;
}

// Note: verifyPhone is handled by auth.service

// ============================================================================
// Profile Picture Management
// ============================================================================

/**
 * Update profile picture URL
 */
export async function updateProfilePicture(imageUrl: string): Promise<ApiResponse<UserProfileDTO>> {
	return updateProfile({ profilePictureUrl: imageUrl });
}

/**
 * Remove profile picture
 */
export async function removeProfilePicture(): Promise<ApiResponse<UserProfileDTO>> {
	return updateProfile({ profilePictureUrl: '' });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get cached user data from localStorage
 */
export function getCachedUser(): UserProfileDTO | null {
	if (typeof window === 'undefined') return null;

	const userJson = localStorage.getItem(STORAGE_KEYS.USER);
	if (!userJson) return null;

	try {
		return JSON.parse(userJson) as UserProfileDTO;
	} catch {
		return null;
	}
}

/**
 * Update cached user data in localStorage
 */
function updateCachedUser(userData: Partial<UserProfileDTO>): void {
	if (typeof window === 'undefined') return;

	const currentUser = getCachedUser();
	const updatedUser = currentUser ? { ...currentUser, ...userData } : userData;

	localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
}

/**
 * Clear all user data from localStorage
 */
function clearUserData(): void {
	if (typeof window === 'undefined') return;

	localStorage.removeItem(STORAGE_KEYS.USER);
	localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
	localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Check if user's email is verified
 */
export function isEmailVerified(): boolean {
	const user = getCachedUser();
	return user?.isEmailVerified ?? false;
}

/**
 * Check if user's phone is verified
 */
export function isPhoneVerified(): boolean {
	const user = getCachedUser();
	return user?.isPhoneVerified ?? false;
}

/**
 * Get user's full name
 */
export function getUserFullName(): string | null {
	const user = getCachedUser();
	return user?.fullName ?? null;
}

/**
 * Get user's email address
 */
export function getUserEmail(): string | null {
	const user = getCachedUser();
	return user?.emailAddress ?? null;
}

/**
 * Get user's profile picture URL
 */
export function getUserProfilePicture(): string | null {
	const user = getCachedUser();
	return user?.profilePictureUrl ?? null;
}
