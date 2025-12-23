import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { UserProfileDTO } from '$types/user.types';
import { STORAGE_KEYS } from '$lib/config/constants';

// ============================================================================
// Types
// ============================================================================

interface UserState {
	// Current user profile
	currentUser: UserProfileDTO | null;
	currentUserLoading: boolean;
	currentUserError: string | null;

	// User cache (for viewing other users' profiles)
	users: Record<number, UserProfileDTO>;
	userLoading: Record<number, boolean>;
	userError: Record<number, string | null>;

	// Follow relationships
	following: Set<number>; // User IDs that current user follows
	followers: Set<number>; // User IDs that follow current user
	followLoading: Record<number, boolean>;

	// Blocked users
	blockedUsers: Set<number>;
	blockLoading: Record<number, boolean>;

	// User statistics
	stats: {
		totalPosts: number;
		activePosts: number;
		expiredPosts: number;
		draftPosts: number;
		followersCount: number;
		followingCount: number;
	} | null;
	statsLoading: boolean;

	// User preferences
	preferences: {
		emailNotifications: boolean;
		pushNotifications: boolean;
		smsNotifications: boolean;
		newMessageNotification: boolean;
		newFollowerNotification: boolean;
		postLikeNotification: boolean;
		language: string;
		theme: 'light' | 'dark' | 'auto';
	} | null;
	preferencesLoading: boolean;

	// Profile update status
	isUpdating: boolean;
	updateError: string | null;
}

const initialState: UserState = {
	currentUser: null,
	currentUserLoading: false,
	currentUserError: null,

	users: {},
	userLoading: {},
	userError: {},

	following: new Set(),
	followers: new Set(),
	followLoading: {},

	blockedUsers: new Set(),
	blockLoading: {},

	stats: null,
	statsLoading: false,

	preferences: null,
	preferencesLoading: false,

	isUpdating: false,
	updateError: null
};

// ============================================================================
// Store
// ============================================================================

function createUserStore() {
	const { subscribe, set, update }: Writable<UserState> = writable<UserState>(initialState);

	// Load initial user from localStorage
	if (typeof window !== 'undefined') {
		const cachedUserJson = localStorage.getItem(STORAGE_KEYS.USER);
		if (cachedUserJson) {
			try {
				const cachedUser = JSON.parse(cachedUserJson) as UserProfileDTO;
				update((state) => ({ ...state, currentUser: cachedUser }));
			} catch (error) {
				console.error('Failed to parse cached user:', error);
			}
		}
	}

	return {
		subscribe,

		// ============================================================================
		// Current User Management
		// ============================================================================

		/**
		 * Set current user profile
		 */
		setCurrentUser: (user: UserProfileDTO | null) => {
			update((state) => ({
				...state,
				currentUser: user,
				currentUserError: null
			}));

			// Persist to localStorage
			if (typeof window !== 'undefined') {
				if (user) {
					localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
				} else {
					localStorage.removeItem(STORAGE_KEYS.USER);
				}
			}
		},

		/**
		 * Update current user profile (partial update)
		 */
		updateCurrentUser: (updates: Partial<UserProfileDTO>) => {
			update((state) => {
				if (!state.currentUser) return state;

				const updatedUser = { ...state.currentUser, ...updates };

				// Persist to localStorage
				if (typeof window !== 'undefined') {
					localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
				}

				return {
					...state,
					currentUser: updatedUser
				};
			});
		},

		/**
		 * Set current user loading state
		 */
		setCurrentUserLoading: (loading: boolean) => {
			update((state) => ({ ...state, currentUserLoading: loading }));
		},

		/**
		 * Set current user error
		 */
		setCurrentUserError: (error: string | null) => {
			update((state) => ({
				...state,
				currentUserError: error,
				currentUserLoading: false
			}));
		},

		/**
		 * Clear current user (logout)
		 */
		clearCurrentUser: () => {
			update((state) => ({
				...state,
				currentUser: null,
				stats: null,
				preferences: null,
				following: new Set(),
				followers: new Set()
			}));

			// Clear from localStorage
			if (typeof window !== 'undefined') {
				localStorage.removeItem(STORAGE_KEYS.USER);
			}
		},

		// ============================================================================
		// User Cache Management (Other Users)
		// ============================================================================

		/**
		 * Set a user in cache
		 */
		setUser: (user: UserProfileDTO) => {
			update((state) => ({
				...state,
				users: { ...state.users, [user.id]: user },
				userError: { ...state.userError, [user.id]: null }
			}));
		},

		/**
		 * Set user loading state
		 */
		setUserLoading: (userId: number, loading: boolean) => {
			update((state) => ({
				...state,
				userLoading: { ...state.userLoading, [userId]: loading }
			}));
		},

		/**
		 * Set user error
		 */
		setUserError: (userId: number, error: string | null) => {
			update((state) => ({
				...state,
				userError: { ...state.userError, [userId]: error },
				userLoading: { ...state.userLoading, [userId]: false }
			}));
		},

		/**
		 * Get user from cache
		 */
		getUser: (userId: number): UserProfileDTO | undefined => {
			return get(userStore).users[userId];
		},

		/**
		 * Check if user is in cache
		 */
		hasUser: (userId: number): boolean => {
			return Boolean(get(userStore).users[userId]);
		},

		// ============================================================================
		// Follow Management
		// ============================================================================

		/**
		 * Set following list
		 */
		setFollowing: (userIds: number[]) => {
			update((state) => ({
				...state,
				following: new Set(userIds)
			}));
		},

		/**
		 * Add to following list (optimistic)
		 */
		addFollowing: (userId: number) => {
			update((state) => {
				const newFollowing = new Set(state.following);
				newFollowing.add(userId);
				return { ...state, following: newFollowing };
			});
		},

		/**
		 * Remove from following list (optimistic)
		 */
		removeFollowing: (userId: number) => {
			update((state) => {
				const newFollowing = new Set(state.following);
				newFollowing.delete(userId);
				return { ...state, following: newFollowing };
			});
		},

		/**
		 * Set followers list
		 */
		setFollowers: (userIds: number[]) => {
			update((state) => ({
				...state,
				followers: new Set(userIds)
			}));
		},

		/**
		 * Set follow loading state
		 */
		setFollowLoading: (userId: number, loading: boolean) => {
			update((state) => ({
				...state,
				followLoading: { ...state.followLoading, [userId]: loading }
			}));
		},

		/**
		 * Check if current user is following another user
		 */
		isFollowing: (userId: number): boolean => {
			return get(userStore).following.has(userId);
		},

		/**
		 * Check if user is a follower
		 */
		isFollower: (userId: number): boolean => {
			return get(userStore).followers.has(userId);
		},

		// ============================================================================
		// Block Management
		// ============================================================================

		/**
		 * Set blocked users list
		 */
		setBlockedUsers: (userIds: number[]) => {
			update((state) => ({
				...state,
				blockedUsers: new Set(userIds)
			}));
		},

		/**
		 * Block a user (optimistic)
		 */
		blockUser: (userId: number) => {
			update((state) => {
				const newBlocked = new Set(state.blockedUsers);
				newBlocked.add(userId);

				// Remove from following/followers if blocked
				const newFollowing = new Set(state.following);
				const newFollowers = new Set(state.followers);
				newFollowing.delete(userId);
				newFollowers.delete(userId);

				return {
					...state,
					blockedUsers: newBlocked,
					following: newFollowing,
					followers: newFollowers
				};
			});
		},

		/**
		 * Unblock a user (optimistic)
		 */
		unblockUser: (userId: number) => {
			update((state) => {
				const newBlocked = new Set(state.blockedUsers);
				newBlocked.delete(userId);
				return { ...state, blockedUsers: newBlocked };
			});
		},

		/**
		 * Set block loading state
		 */
		setBlockLoading: (userId: number, loading: boolean) => {
			update((state) => ({
				...state,
				blockLoading: { ...state.blockLoading, [userId]: loading }
			}));
		},

		/**
		 * Check if user is blocked
		 */
		isBlocked: (userId: number): boolean => {
			return get(userStore).blockedUsers.has(userId);
		},

		// ============================================================================
		// Statistics Management
		// ============================================================================

		/**
		 * Set user statistics
		 */
		setStats: (stats: UserState['stats']) => {
			update((state) => ({ ...state, stats, statsLoading: false }));
		},

		/**
		 * Update stats (partial)
		 */
		updateStats: (updates: Partial<NonNullable<UserState['stats']>>) => {
			update((state) => ({
				...state,
				stats: state.stats ? { ...state.stats, ...updates } : null
			}));
		},

		/**
		 * Set stats loading state
		 */
		setStatsLoading: (loading: boolean) => {
			update((state) => ({ ...state, statsLoading: loading }));
		},

		/**
		 * Increment post count
		 */
		incrementPostCount: (status: 'active' | 'draft' | 'expired' = 'active') => {
			update((state) => {
				if (!state.stats) return state;

				const updates: Partial<NonNullable<UserState['stats']>> = {
					totalPosts: state.stats.totalPosts + 1
				};

				if (status === 'active') updates.activePosts = state.stats.activePosts + 1;
				if (status === 'draft') updates.draftPosts = state.stats.draftPosts + 1;
				if (status === 'expired') updates.expiredPosts = state.stats.expiredPosts + 1;

				return {
					...state,
					stats: { ...state.stats, ...updates }
				};
			});
		},

		/**
		 * Decrement post count
		 */
		decrementPostCount: (status: 'active' | 'draft' | 'expired' = 'active') => {
			update((state) => {
				if (!state.stats) return state;

				const updates: Partial<NonNullable<UserState['stats']>> = {
					totalPosts: Math.max(0, state.stats.totalPosts - 1)
				};

				if (status === 'active') updates.activePosts = Math.max(0, state.stats.activePosts - 1);
				if (status === 'draft') updates.draftPosts = Math.max(0, state.stats.draftPosts - 1);
				if (status === 'expired') updates.expiredPosts = Math.max(0, state.stats.expiredPosts - 1);

				return {
					...state,
					stats: { ...state.stats, ...updates }
				};
			});
		},

		// ============================================================================
		// Preferences Management
		// ============================================================================

		/**
		 * Set user preferences
		 */
		setPreferences: (preferences: UserState['preferences']) => {
			update((state) => ({ ...state, preferences, preferencesLoading: false }));
		},

		/**
		 * Update preferences (partial)
		 */
		updatePreferences: (updates: Partial<NonNullable<UserState['preferences']>>) => {
			update((state) => ({
				...state,
				preferences: state.preferences ? { ...state.preferences, ...updates } : null
			}));
		},

		/**
		 * Set preferences loading state
		 */
		setPreferencesLoading: (loading: boolean) => {
			update((state) => ({ ...state, preferencesLoading: loading }));
		},

		// ============================================================================
		// Profile Update Status
		// ============================================================================

		/**
		 * Set profile updating state
		 */
		setUpdating: (updating: boolean) => {
			update((state) => ({ ...state, isUpdating: updating }));
		},

		/**
		 * Set update error
		 */
		setUpdateError: (error: string | null) => {
			update((state) => ({
				...state,
				updateError: error,
				isUpdating: false
			}));
		},

		// ============================================================================
		// Utility
		// ============================================================================

		/**
		 * Reset entire store to initial state
		 */
		reset: () => {
			set(initialState);
		},

		/**
		 * Get current user ID
		 */
		getCurrentUserId: (): number | null => {
			return get(userStore).currentUser?.id ?? null;
		},

		/**
		 * Check if user is authenticated
		 */
		isAuthenticated: (): boolean => {
			return Boolean(get(userStore).currentUser);
		}
	};
}

// ============================================================================
// Export Store and Derived Stores
// ============================================================================

export const userStore = createUserStore();

// Derived stores for convenient access
export const currentUser: Readable<UserProfileDTO | null> = derived(
	userStore,
	($store) => $store.currentUser
);

export const currentUserLoading: Readable<boolean> = derived(
	userStore,
	($store) => $store.currentUserLoading
);

export const currentUserError: Readable<string | null> = derived(
	userStore,
	($store) => $store.currentUserError
);

export const userStats: Readable<UserState['stats']> = derived(userStore, ($store) => $store.stats);

export const userPreferences: Readable<UserState['preferences']> = derived(
	userStore,
	($store) => $store.preferences
);

export const isAuthenticated: Readable<boolean> = derived(userStore, ($store) =>
	Boolean($store.currentUser)
);

export const isEmailVerified: Readable<boolean> = derived(
	userStore,
	($store) => $store.currentUser?.isEmailVerified ?? false
);

export const isPhoneVerified: Readable<boolean> = derived(
	userStore,
	($store) => $store.currentUser?.isPhoneVerified ?? false
);

export const following: Readable<Set<number>> = derived(userStore, ($store) => $store.following);

export const followers: Readable<Set<number>> = derived(userStore, ($store) => $store.followers);

export const blockedUsers: Readable<Set<number>> = derived(
	userStore,
	($store) => $store.blockedUsers
);
