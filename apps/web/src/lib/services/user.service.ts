import { apiClient } from './api.client';
import type { ApiResponse, PaginatedResponse } from '$types/api.types';
import type {
	UserProfileDTO,
	UpdateProfileDTO,
	ChangePasswordDTO,
	UserPostsSummaryDTO
} from '$types/user.types';
import { userStore } from '$lib/stores/user.store';
import { handleError } from '$lib/utils/error-handler';
import { STORAGE_KEYS } from '$lib/config/constants';

/**
 * User Service
 * Handles all user profile and preferences API calls with integrated state management
 *
 * Features:
 * - Profile management with automatic store updates
 * - Follow/unfollow with optimistic updates
 * - Block user functionality
 * - User preferences management
 * - Statistics tracking
 * - Caching
 */

// ============================================================================
// Profile Management
// ============================================================================

/**
 * Get current user's profile
 * Automatically updates store
 */
export async function getProfile(): Promise<ApiResponse<UserProfileDTO>> {
	try {
		userStore.setCurrentUserLoading(true);
		const response = await apiClient.get<ApiResponse<UserProfileDTO>>('/users/profile');

		if (response.data.success && response.data.data) {
			userStore.setCurrentUser(response.data.data);
		}

		userStore.setCurrentUserLoading(false);
		return response.data;
	} catch (error) {
		userStore.setCurrentUserError(
			error instanceof Error ? error.message : 'Failed to load profile'
		);
		throw handleError(error);
	}
}

/**
 * Update current user's profile
 * Automatically updates store
 */
export async function updateProfile(data: UpdateProfileDTO): Promise<ApiResponse<UserProfileDTO>> {
	try {
		userStore.setUpdating(true);
		const response = await apiClient.put<ApiResponse<UserProfileDTO>>('/users/profile', data);

		if (response.data.success && response.data.data) {
			userStore.setCurrentUser(response.data.data);
		}

		userStore.setUpdating(false);
		return response.data;
	} catch (error) {
		userStore.setUpdateError(error instanceof Error ? error.message : 'Failed to update profile');
		throw handleError(error);
	}
}

/**
 * Get user profile by ID (public)
 * Checks cache first, then fetches if needed
 */
export async function getUserById(
	userId: number,
	forceRefresh: boolean = false
): Promise<ApiResponse<UserProfileDTO>> {
	try {
		// Check cache first unless force refresh
		if (!forceRefresh && userStore.hasUser(userId)) {
			const cachedUser = userStore.getUser(userId);
			if (cachedUser) {
				return {
					success: true,
					data: cachedUser,
					message: 'User retrieved from cache'
				};
			}
		}

		userStore.setUserLoading(userId, true);
		const response = await apiClient.get<ApiResponse<UserProfileDTO>>(`/users/${userId}`);

		if (response.data.success && response.data.data) {
			userStore.setUser(response.data.data);
		}

		userStore.setUserLoading(userId, false);
		return response.data;
	} catch (error) {
		userStore.setUserError(userId, error instanceof Error ? error.message : 'Failed to load user');
		throw handleError(error);
	}
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
 * Automatically updates store
 */
export async function getPostsSummary(): Promise<ApiResponse<UserPostsSummaryDTO>> {
	try {
		userStore.setStatsLoading(true);
		const response = await apiClient.get<ApiResponse<UserPostsSummaryDTO>>('/users/posts-summary');

		if (response.data.success && response.data.data) {
			userStore.setStats({
				...response.data.data,
				followersCount: 0,
				followingCount: 0
			});
		}

		userStore.setStatsLoading(false);
		return response.data;
	} catch (error) {
		userStore.setStatsLoading(false);
		throw handleError(error);
	}
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
// Follow/Unfollow Operations
// ============================================================================

/**
 * Follow a user
 * Uses optimistic updates for instant UI feedback
 */
export async function followUser(userId: number): Promise<ApiResponse<void>> {
	try {
		// Optimistic update
		userStore.addFollowing(userId);
		userStore.setFollowLoading(userId, true);

		const response = await apiClient.post<ApiResponse<void>>(`/users/${userId}/follow`);

		if (!response.data.success) {
			// Revert on failure
			userStore.removeFollowing(userId);
		}

		userStore.setFollowLoading(userId, false);
		return response.data;
	} catch (error) {
		// Revert optimistic update on error
		userStore.removeFollowing(userId);
		userStore.setFollowLoading(userId, false);
		throw handleError(error);
	}
}

/**
 * Unfollow a user
 * Uses optimistic updates for instant UI feedback
 */
export async function unfollowUser(userId: number): Promise<ApiResponse<void>> {
	try {
		// Optimistic update
		userStore.removeFollowing(userId);
		userStore.setFollowLoading(userId, true);

		const response = await apiClient.delete<ApiResponse<void>>(`/users/${userId}/follow`);

		if (!response.data.success) {
			// Revert on failure
			userStore.addFollowing(userId);
		}

		userStore.setFollowLoading(userId, false);
		return response.data;
	} catch (error) {
		// Revert optimistic update on error
		userStore.addFollowing(userId);
		userStore.setFollowLoading(userId, false);
		throw handleError(error);
	}
}

/**
 * Toggle follow status
 */
export async function toggleFollow(userId: number): Promise<ApiResponse<void>> {
	const isFollowing = userStore.isFollowing(userId);
	return isFollowing ? unfollowUser(userId) : followUser(userId);
}

/**
 * Get list of users that current user follows
 */
export async function getFollowing(
	options: { page?: number; limit?: number } = {}
): Promise<ApiResponse<PaginatedResponse<UserProfileDTO>>> {
	try {
		const { page = 1, limit = 20 } = options;
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString()
		});

		const response = await apiClient.get<ApiResponse<PaginatedResponse<UserProfileDTO>>>(
			`/users/following?${params.toString()}`
		);

		// Update store with following IDs
		if (response.data.success && response.data.data) {
			const userIds = response.data.data.data.map((user) => user.id);
			if (page === 1) {
				userStore.setFollowing(userIds);
			}

			// Cache individual users
			response.data.data.data.forEach((user) => userStore.setUser(user));
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * Get list of users that follow the current user
 */
export async function getFollowers(
	options: { page?: number; limit?: number } = {}
): Promise<ApiResponse<PaginatedResponse<UserProfileDTO>>> {
	try {
		const { page = 1, limit = 20 } = options;
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString()
		});

		const response = await apiClient.get<ApiResponse<PaginatedResponse<UserProfileDTO>>>(
			`/users/followers?${params.toString()}`
		);

		// Update store with follower IDs
		if (response.data.success && response.data.data) {
			const userIds = response.data.data.data.map((user) => user.id);
			if (page === 1) {
				userStore.setFollowers(userIds);
			}

			// Cache individual users
			response.data.data.data.forEach((user) => userStore.setUser(user));
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * Get user's followers by user ID
 */
export async function getUserFollowers(
	userId: number,
	options: { page?: number; limit?: number } = {}
): Promise<ApiResponse<PaginatedResponse<UserProfileDTO>>> {
	try {
		const { page = 1, limit = 20 } = options;
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString()
		});

		const response = await apiClient.get<ApiResponse<PaginatedResponse<UserProfileDTO>>>(
			`/users/${userId}/followers?${params.toString()}`
		);

		// Cache users
		if (response.data.success && response.data.data) {
			response.data.data.data.forEach((user) => userStore.setUser(user));
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

/**
 * Get user's following by user ID
 */
export async function getUserFollowing(
	userId: number,
	options: { page?: number; limit?: number } = {}
): Promise<ApiResponse<PaginatedResponse<UserProfileDTO>>> {
	try {
		const { page = 1, limit = 20 } = options;
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString()
		});

		const response = await apiClient.get<ApiResponse<PaginatedResponse<UserProfileDTO>>>(
			`/users/${userId}/following?${params.toString()}`
		);

		// Cache users
		if (response.data.success && response.data.data) {
			response.data.data.data.forEach((user) => userStore.setUser(user));
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

// ============================================================================
// Block Operations
// ============================================================================

/**
 * Block a user
 * Uses optimistic updates
 */
export async function blockUser(userId: number): Promise<ApiResponse<void>> {
	try {
		// Optimistic update
		userStore.blockUser(userId);
		userStore.setBlockLoading(userId, true);

		const response = await apiClient.post<ApiResponse<void>>(`/users/${userId}/block`);

		if (!response.data.success) {
			// Revert on failure
			userStore.unblockUser(userId);
		}

		userStore.setBlockLoading(userId, false);
		return response.data;
	} catch (error) {
		// Revert optimistic update on error
		userStore.unblockUser(userId);
		userStore.setBlockLoading(userId, false);
		throw handleError(error);
	}
}

/**
 * Unblock a user
 * Uses optimistic updates
 */
export async function unblockUser(userId: number): Promise<ApiResponse<void>> {
	try {
		// Optimistic update
		userStore.unblockUser(userId);
		userStore.setBlockLoading(userId, true);

		const response = await apiClient.delete<ApiResponse<void>>(`/users/${userId}/block`);

		if (!response.data.success) {
			// Revert on failure
			userStore.blockUser(userId);
		}

		userStore.setBlockLoading(userId, false);
		return response.data;
	} catch (error) {
		// Revert optimistic update on error
		userStore.blockUser(userId);
		userStore.setBlockLoading(userId, false);
		throw handleError(error);
	}
}

/**
 * Get list of blocked users
 */
export async function getBlockedUsers(): Promise<ApiResponse<UserProfileDTO[]>> {
	try {
		const response = await apiClient.get<ApiResponse<UserProfileDTO[]>>('/users/blocked');

		if (response.data.success && response.data.data) {
			const userIds = response.data.data.map((user) => user.id);
			userStore.setBlockedUsers(userIds);

			// Cache individual users
			response.data.data.forEach((user) => userStore.setUser(user));
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

// ============================================================================
// User Preferences
// ============================================================================

/**
 * Get user preferences
 */
export async function getPreferences(): Promise<
	ApiResponse<{
		emailNotifications: boolean;
		pushNotifications: boolean;
		smsNotifications: boolean;
		newMessageNotification: boolean;
		newFollowerNotification: boolean;
		postLikeNotification: boolean;
		language: string;
		theme: 'light' | 'dark' | 'auto';
	}>
> {
	try {
		userStore.setPreferencesLoading(true);
		const response = await apiClient.get('/users/preferences');

		if (response.data.success && response.data.data) {
			userStore.setPreferences(response.data.data);
		}

		userStore.setPreferencesLoading(false);
		return response.data;
	} catch (error) {
		userStore.setPreferencesLoading(false);
		throw handleError(error);
	}
}

/**
 * Update user preferences
 */
export async function updatePreferences(
	preferences: Partial<{
		emailNotifications: boolean;
		pushNotifications: boolean;
		smsNotifications: boolean;
		newMessageNotification: boolean;
		newFollowerNotification: boolean;
		postLikeNotification: boolean;
		language: string;
		theme: 'light' | 'dark' | 'auto';
	}>
): Promise<ApiResponse<any>> {
	try {
		userStore.setPreferencesLoading(true);
		const response = await apiClient.put('/users/preferences', preferences);

		if (response.data.success && response.data.data) {
			userStore.updatePreferences(preferences);
		}

		userStore.setPreferencesLoading(false);
		return response.data;
	} catch (error) {
		userStore.setPreferencesLoading(false);
		throw handleError(error);
	}
}

// ============================================================================
// Search & Discovery
// ============================================================================

/**
 * Search users by name or email
 */
export async function searchUsers(
	query: string,
	options: { page?: number; limit?: number } = {}
): Promise<ApiResponse<PaginatedResponse<UserProfileDTO>>> {
	try {
		const { page = 1, limit = 20 } = options;
		const params = new URLSearchParams({
			query,
			page: page.toString(),
			limit: limit.toString()
		});

		const response = await apiClient.get<ApiResponse<PaginatedResponse<UserProfileDTO>>>(
			`/users/search?${params.toString()}`
		);

		// Cache users
		if (response.data.success && response.data.data) {
			response.data.data.data.forEach((user) => userStore.setUser(user));
		}

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get cached user data from localStorage
 * Note: Prefer using currentUser from store instead
 */
export function getCachedUser(): UserProfileDTO | null {
	const state = userStore;
	// Access the store's current user directly
	let user: UserProfileDTO | null = null;
	state.subscribe((s) => (user = s.currentUser))();
	return user;
}

/**
 * Clear all user data from localStorage
 */
function clearUserData(): void {
	userStore.clearCurrentUser();

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

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Preload a user profile
 */
export async function preloadUser(userId: number): Promise<void> {
	try {
		if (!userStore.hasUser(userId)) {
			await getUserById(userId);
		}
	} catch (error) {
		// Silent fail for preloading
		console.error('Failed to preload user:', error);
	}
}

/**
 * Preload multiple user profiles
 */
export async function preloadUsers(userIds: number[]): Promise<void> {
	const promises = userIds.map((id) => preloadUser(id));
	await Promise.allSettled(promises);
}

/**
 * Clear user cache
 */
export function clearUserCache(): void {
	userStore.reset();
}

/**
 * Refresh current user profile
 */
export async function refreshProfile(): Promise<void> {
	await getProfile();
}
