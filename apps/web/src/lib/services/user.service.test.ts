import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import * as userService from './user.service';
import { userStore } from '$lib/stores/user.store';
import { apiClient } from './api.client';
import type { UserProfileDTO, UpdateProfileDTO } from '$types/user.types';

// Mock the API client
vi.mock('./api.client', () => ({
	apiClient: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn()
	}
}));

// Mock error handler
vi.mock('$lib/utils/error-handler', () => ({
	handleError: vi.fn((error) => error)
}));

describe('User Service', () => {
	// Sample test data
	const mockUser: UserProfileDTO = {
		id: 1,
		fullName: 'Test User',
		emailAddress: 'test@example.com',
		phoneNumber: '1234567890',
		profilePictureUrl: 'https://example.com/avatar.jpg',
		location: 'Test City',
		bio: 'Test bio',
		isEmailVerified: true,
		isPhoneVerified: false,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const mockOtherUser: UserProfileDTO = {
		id: 2,
		fullName: 'Other User',
		emailAddress: 'other@example.com',
		profilePictureUrl: 'https://example.com/other.jpg',
		location: 'Other City',
		isEmailVerified: true,
		isPhoneVerified: true,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const mockUpdateData: UpdateProfileDTO = {
		fullName: 'Updated Name',
		bio: 'Updated bio',
		location: 'Updated City'
	};

	beforeEach(() => {
		// Reset store before each test
		userStore.reset();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Profile Management', () => {
		describe('getProfile', () => {
			it('should fetch profile and update store', async () => {
				const response = {
					data: {
						success: true,
						data: mockUser,
						message: 'Profile retrieved'
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await userService.getProfile();

				expect(result.success).toBe(true);
				expect(result.data).toEqual(mockUser);
				expect(apiClient.get).toHaveBeenCalledWith('/users/profile');

				// Check store updates
				const storeState = get(userStore);
				expect(storeState.currentUser).toEqual(mockUser);
				expect(storeState.currentUserLoading).toBe(false);
			});

			it('should handle profile fetch error', async () => {
				const error = new Error('Failed to fetch profile');
				vi.mocked(apiClient.get).mockRejectedValue(error);

				await expect(userService.getProfile()).rejects.toThrow();

				const storeState = get(userStore);
				expect(storeState.currentUserError).toBeTruthy();
			});
		});

		describe('updateProfile', () => {
			it('should update profile and sync store', async () => {
				const updatedUser = { ...mockUser, ...mockUpdateData };
				const response = {
					data: {
						success: true,
						data: updatedUser,
						message: 'Profile updated'
					}
				};

				vi.mocked(apiClient.put).mockResolvedValue(response);

				const result = await userService.updateProfile(mockUpdateData);

				expect(result.success).toBe(true);
				expect(result.data?.fullName).toBe('Updated Name');
				expect(apiClient.put).toHaveBeenCalledWith('/users/profile', mockUpdateData);

				const storeState = get(userStore);
				expect(storeState.currentUser).toEqual(updatedUser);
			});

			it('should handle update error', async () => {
				const error = new Error('Update failed');
				vi.mocked(apiClient.put).mockRejectedValue(error);

				await expect(userService.updateProfile(mockUpdateData)).rejects.toThrow();

				const storeState = get(userStore);
				expect(storeState.updateError).toBeTruthy();
			});
		});

		describe('getUserById', () => {
			it('should fetch user and cache it', async () => {
				const response = {
					data: {
						success: true,
						data: mockOtherUser,
						message: 'User retrieved'
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await userService.getUserById(2);

				expect(result.success).toBe(true);
				expect(result.data).toEqual(mockOtherUser);
				expect(apiClient.get).toHaveBeenCalledWith('/users/2');

				// Check cache
				const storeState = get(userStore);
				expect(storeState.users[2]).toEqual(mockOtherUser);
			});

			it('should return cached user without API call', async () => {
				// Pre-populate cache
				userStore.setUser(mockOtherUser);

				const result = await userService.getUserById(2, false);

				expect(result.success).toBe(true);
				expect(result.data).toEqual(mockOtherUser);
				expect(apiClient.get).not.toHaveBeenCalled();
			});

			it('should force refresh even with cached data', async () => {
				// Pre-populate cache
				userStore.setUser(mockOtherUser);

				const response = {
					data: {
						success: true,
						data: { ...mockOtherUser, fullName: 'Updated Name' },
						message: 'User retrieved'
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await userService.getUserById(2, true);

				expect(result.success).toBe(true);
				expect(result.data?.fullName).toBe('Updated Name');
				expect(apiClient.get).toHaveBeenCalled();
			});
		});

		describe('updateProfilePicture', () => {
			it('should update profile picture', async () => {
				const newImageUrl = 'https://example.com/new-avatar.jpg';
				const updatedUser = { ...mockUser, profilePictureUrl: newImageUrl };

				const response = {
					data: {
						success: true,
						data: updatedUser,
						message: 'Profile picture updated'
					}
				};

				vi.mocked(apiClient.put).mockResolvedValue(response);

				const result = await userService.updateProfilePicture(newImageUrl);

				expect(result.success).toBe(true);
				expect(result.data?.profilePictureUrl).toBe(newImageUrl);
			});
		});

		describe('removeProfilePicture', () => {
			it('should remove profile picture', async () => {
				const updatedUser = { ...mockUser, profilePictureUrl: '' };

				const response = {
					data: {
						success: true,
						data: updatedUser,
						message: 'Profile picture removed'
					}
				};

				vi.mocked(apiClient.put).mockResolvedValue(response);

				const result = await userService.removeProfilePicture();

				expect(result.success).toBe(true);
				expect(result.data?.profilePictureUrl).toBe('');
			});
		});
	});

	describe('Follow/Unfollow Operations', () => {
		describe('followUser', () => {
			it('should optimistically follow a user', async () => {
				const response = {
					data: {
						success: true,
						message: 'User followed'
					}
				};

				vi.mocked(apiClient.post).mockResolvedValue(response);

				await userService.followUser(2);

				expect(apiClient.post).toHaveBeenCalledWith('/users/2/follow');

				const storeState = get(userStore);
				expect(storeState.following.has(2)).toBe(true);
			});

			it('should revert optimistic update on error', async () => {
				const error = new Error('Failed to follow');
				vi.mocked(apiClient.post).mockRejectedValue(error);

				await expect(userService.followUser(2)).rejects.toThrow();

				const storeState = get(userStore);
				expect(storeState.following.has(2)).toBe(false);
			});
		});

		describe('unfollowUser', () => {
			it('should optimistically unfollow a user', async () => {
				// Setup: user is following
				userStore.addFollowing(2);

				const response = {
					data: {
						success: true,
						message: 'User unfollowed'
					}
				};

				vi.mocked(apiClient.delete).mockResolvedValue(response);

				await userService.unfollowUser(2);

				expect(apiClient.delete).toHaveBeenCalledWith('/users/2/follow');

				const storeState = get(userStore);
				expect(storeState.following.has(2)).toBe(false);
			});

			it('should revert optimistic update on error', async () => {
				// Setup: user is following
				userStore.addFollowing(2);

				const error = new Error('Failed to unfollow');
				vi.mocked(apiClient.delete).mockRejectedValue(error);

				await expect(userService.unfollowUser(2)).rejects.toThrow();

				const storeState = get(userStore);
				expect(storeState.following.has(2)).toBe(true);
			});
		});

		describe('toggleFollow', () => {
			it('should follow when not following', async () => {
				const response = {
					data: {
						success: true,
						message: 'User followed'
					}
				};

				vi.mocked(apiClient.post).mockResolvedValue(response);

				await userService.toggleFollow(2);

				expect(apiClient.post).toHaveBeenCalledWith('/users/2/follow');
			});

			it('should unfollow when following', async () => {
				// Setup: user is following
				userStore.addFollowing(2);

				const response = {
					data: {
						success: true,
						message: 'User unfollowed'
					}
				};

				vi.mocked(apiClient.delete).mockResolvedValue(response);

				await userService.toggleFollow(2);

				expect(apiClient.delete).toHaveBeenCalledWith('/users/2/follow');
			});
		});

		describe('getFollowing', () => {
			it('should fetch following list', async () => {
				const response = {
					data: {
						success: true,
						data: {
							data: [mockOtherUser],
							pagination: {
								page: 1,
								limit: 20,
								total: 1,
								pages: 1
							}
						}
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await userService.getFollowing();

				expect(result.success).toBe(true);
				expect(apiClient.get).toHaveBeenCalled();

				const storeState = get(userStore);
				expect(storeState.following.has(2)).toBe(true);
			});
		});

		describe('getFollowers', () => {
			it('should fetch followers list', async () => {
				const response = {
					data: {
						success: true,
						data: {
							data: [mockOtherUser],
							pagination: {
								page: 1,
								limit: 20,
								total: 1,
								pages: 1
							}
						}
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await userService.getFollowers();

				expect(result.success).toBe(true);

				const storeState = get(userStore);
				expect(storeState.followers.has(2)).toBe(true);
			});
		});
	});

	describe('Block Operations', () => {
		describe('blockUser', () => {
			it('should optimistically block a user', async () => {
				const response = {
					data: {
						success: true,
						message: 'User blocked'
					}
				};

				vi.mocked(apiClient.post).mockResolvedValue(response);

				await userService.blockUser(2);

				expect(apiClient.post).toHaveBeenCalledWith('/users/2/block');

				const storeState = get(userStore);
				expect(storeState.blockedUsers.has(2)).toBe(true);
			});

			it('should remove from following when blocking', async () => {
				// Setup: user is following
				userStore.addFollowing(2);

				const response = {
					data: {
						success: true,
						message: 'User blocked'
					}
				};

				vi.mocked(apiClient.post).mockResolvedValue(response);

				await userService.blockUser(2);

				const storeState = get(userStore);
				expect(storeState.blockedUsers.has(2)).toBe(true);
				expect(storeState.following.has(2)).toBe(false);
			});

			it('should revert optimistic update on error', async () => {
				const error = new Error('Failed to block');
				vi.mocked(apiClient.post).mockRejectedValue(error);

				await expect(userService.blockUser(2)).rejects.toThrow();

				const storeState = get(userStore);
				expect(storeState.blockedUsers.has(2)).toBe(false);
			});
		});

		describe('unblockUser', () => {
			it('should optimistically unblock a user', async () => {
				// Setup: user is blocked
				userStore.blockUser(2);

				const response = {
					data: {
						success: true,
						message: 'User unblocked'
					}
				};

				vi.mocked(apiClient.delete).mockResolvedValue(response);

				await userService.unblockUser(2);

				expect(apiClient.delete).toHaveBeenCalledWith('/users/2/block');

				const storeState = get(userStore);
				expect(storeState.blockedUsers.has(2)).toBe(false);
			});
		});

		describe('getBlockedUsers', () => {
			it('should fetch blocked users list', async () => {
				const response = {
					data: {
						success: true,
						data: [mockOtherUser]
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await userService.getBlockedUsers();

				expect(result.success).toBe(true);

				const storeState = get(userStore);
				expect(storeState.blockedUsers.has(2)).toBe(true);
			});
		});
	});

	describe('User Statistics', () => {
		describe('getPostsSummary', () => {
			it('should fetch and store posts summary', async () => {
				const summary = {
					totalPosts: 10,
					activePosts: 5,
					expiredPosts: 3,
					draftPosts: 2
				};

				const response = {
					data: {
						success: true,
						data: summary
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await userService.getPostsSummary();

				expect(result.success).toBe(true);
				expect(result.data).toEqual(summary);

				const storeState = get(userStore);
				expect(storeState.stats?.totalPosts).toBe(10);
				expect(storeState.stats?.activePosts).toBe(5);
			});
		});
	});

	describe('User Preferences', () => {
		describe('getPreferences', () => {
			it('should fetch and store preferences', async () => {
				const preferences = {
					emailNotifications: true,
					pushNotifications: false,
					smsNotifications: true,
					newMessageNotification: true,
					newFollowerNotification: false,
					postLikeNotification: true,
					language: 'en',
					theme: 'dark' as const
				};

				const response = {
					data: {
						success: true,
						data: preferences
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await userService.getPreferences();

				expect(result.success).toBe(true);

				const storeState = get(userStore);
				expect(storeState.preferences).toEqual(preferences);
			});
		});

		describe('updatePreferences', () => {
			it('should update preferences', async () => {
				const updates = {
					emailNotifications: false,
					theme: 'light' as const
				};

				const response = {
					data: {
						success: true,
						data: updates
					}
				};

				vi.mocked(apiClient.put).mockResolvedValue(response);

				await userService.updatePreferences(updates);

				expect(apiClient.put).toHaveBeenCalledWith('/users/preferences', updates);
			});
		});
	});

	describe('Search & Discovery', () => {
		describe('searchUsers', () => {
			it('should search users and cache results', async () => {
				const response = {
					data: {
						success: true,
						data: {
							data: [mockOtherUser],
							pagination: {
								page: 1,
								limit: 20,
								total: 1,
								pages: 1
							}
						}
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await userService.searchUsers('test');

				expect(result.success).toBe(true);
				expect(apiClient.get).toHaveBeenCalled();

				const storeState = get(userStore);
				expect(storeState.users[2]).toEqual(mockOtherUser);
			});
		});
	});

	describe('Helper Functions', () => {
		describe('getCachedUser', () => {
			it('should return current user from store', () => {
				userStore.setCurrentUser(mockUser);

				const user = userService.getCachedUser();

				expect(user).toEqual(mockUser);
			});

			it('should return null when no user', () => {
				const user = userService.getCachedUser();

				expect(user).toBeNull();
			});
		});

		describe('isEmailVerified', () => {
			it('should return true when email is verified', () => {
				userStore.setCurrentUser(mockUser);

				const verified = userService.isEmailVerified();

				expect(verified).toBe(true);
			});

			it('should return false when email is not verified', () => {
				userStore.setCurrentUser({ ...mockUser, isEmailVerified: false });

				const verified = userService.isEmailVerified();

				expect(verified).toBe(false);
			});
		});

		describe('preloadUser', () => {
			it('should preload user if not cached', async () => {
				const response = {
					data: {
						success: true,
						data: mockOtherUser
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				await userService.preloadUser(2);

				expect(apiClient.get).toHaveBeenCalledWith('/users/2');
			});

			it('should not fetch if already cached', async () => {
				userStore.setUser(mockOtherUser);

				await userService.preloadUser(2);

				expect(apiClient.get).not.toHaveBeenCalled();
			});
		});

		describe('preloadUsers', () => {
			it('should preload multiple users', async () => {
				const response = {
					data: {
						success: true,
						data: mockOtherUser
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				await userService.preloadUsers([2, 3, 4]);

				expect(apiClient.get).toHaveBeenCalledTimes(3);
			});
		});

		describe('refreshProfile', () => {
			it('should refresh current user profile', async () => {
				const response = {
					data: {
						success: true,
						data: mockUser
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				await userService.refreshProfile();

				expect(apiClient.get).toHaveBeenCalledWith('/users/profile');
			});
		});

		describe('clearUserCache', () => {
			it('should reset store', () => {
				userStore.setCurrentUser(mockUser);
				userStore.setUser(mockOtherUser);

				userService.clearUserCache();

				const storeState = get(userStore);
				expect(storeState.currentUser).toBeNull();
				expect(storeState.users).toEqual({});
			});
		});
	});
});
