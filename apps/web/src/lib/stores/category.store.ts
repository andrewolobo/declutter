/**
 * Category Store
 *
 * Manages category state, caching, and derived data.
 *
 * @module stores/category
 */

import { writable, derived, type Readable } from 'svelte/store';
import type { CategoryResponseDTO } from '$lib/types/category.types';

// ============================================================================
// Types
// ============================================================================

export interface CategoryStoreState {
	categories: Map<number, CategoryResponseDTO>;
	loading: boolean;
	error: string | null;
	lastFetched: string | null;
}

// ============================================================================
// Store Creation
// ============================================================================

/**
 * Create category store with state management
 */
function createCategoryStore() {
	const initialState: CategoryStoreState = {
		categories: new Map(),
		loading: false,
		error: null,
		lastFetched: null
	};

	const { subscribe, set, update } = writable<CategoryStoreState>(initialState);

	return {
		subscribe,

		/**
		 * Set loading state
		 *
		 * @example
		 * ```typescript
		 * categoryStore.setLoading(true);
		 * ```
		 */
		setLoading(loading: boolean): void {
			update((state) => ({ ...state, loading }));
		},

		/**
		 * Set error state
		 *
		 * @example
		 * ```typescript
		 * categoryStore.setError('Failed to fetch categories');
		 * ```
		 */
		setError(error: string | null): void {
			update((state) => ({ ...state, error, loading: false }));
		},

		/**
		 * Set all categories
		 *
		 * @param categories - Array of categories to store
		 *
		 * @example
		 * ```typescript
		 * categoryStore.setCategories(categories);
		 * ```
		 */
		setCategories(categories: CategoryResponseDTO[]): void {
			update((state) => {
				const newCategories = new Map<number, CategoryResponseDTO>();
				categories.forEach((category) => {
					newCategories.set(category.id, category);
				});

				return {
					...state,
					categories: newCategories,
					loading: false,
					error: null,
					lastFetched: new Date().toISOString()
				};
			});
		},

		/**
		 * Add a new category
		 *
		 * @param category - Category to add
		 *
		 * @example
		 * ```typescript
		 * categoryStore.addCategory(newCategory);
		 * ```
		 */
		addCategory(category: CategoryResponseDTO): void {
			update((state) => {
				const newCategories = new Map(state.categories);
				newCategories.set(category.id, category);

				return {
					...state,
					categories: newCategories
				};
			});
		},

		/**
		 * Update an existing category
		 *
		 * @param category - Category with updated data
		 *
		 * @example
		 * ```typescript
		 * categoryStore.updateCategory(updatedCategory);
		 * ```
		 */
		updateCategory(category: CategoryResponseDTO): void {
			update((state) => {
				const existing = state.categories.get(category.id);
				if (!existing) {
					// If category doesn't exist, add it
					const newCategories = new Map(state.categories);
					newCategories.set(category.id, category);
					return { ...state, categories: newCategories };
				}

				const newCategories = new Map(state.categories);
				newCategories.set(category.id, {
					...existing,
					...category
				});

				return {
					...state,
					categories: newCategories
				};
			});
		},

		/**
		 * Remove a category
		 *
		 * @param categoryId - ID of category to remove
		 *
		 * @example
		 * ```typescript
		 * categoryStore.removeCategory(1);
		 * ```
		 */
		removeCategory(categoryId: number): void {
			update((state) => {
				const newCategories = new Map(state.categories);
				newCategories.delete(categoryId);

				return {
					...state,
					categories: newCategories
				};
			});
		},

		/**
		 * Update category post count
		 *
		 * @param categoryId - Category ID
		 * @param postCount - New post count
		 *
		 * @example
		 * ```typescript
		 * categoryStore.updatePostCount(1, 42);
		 * ```
		 */
		updatePostCount(categoryId: number, postCount: number): void {
			update((state) => {
				const category = state.categories.get(categoryId);
				if (!category) return state;

				const newCategories = new Map(state.categories);
				newCategories.set(categoryId, {
					...category,
					postCount
				});

				return {
					...state,
					categories: newCategories
				};
			});
		},

		/**
		 * Increment category post count
		 *
		 * @param categoryId - Category ID
		 * @param amount - Amount to increment (default: 1)
		 *
		 * @example
		 * ```typescript
		 * categoryStore.incrementPostCount(1); // +1
		 * categoryStore.incrementPostCount(1, 5); // +5
		 * ```
		 */
		incrementPostCount(categoryId: number, amount = 1): void {
			update((state) => {
				const category = state.categories.get(categoryId);
				if (!category) return state;

				const newCategories = new Map(state.categories);
				newCategories.set(categoryId, {
					...category,
					postCount: category.postCount + amount
				});

				return {
					...state,
					categories: newCategories
				};
			});
		},

		/**
		 * Decrement category post count
		 *
		 * @param categoryId - Category ID
		 * @param amount - Amount to decrement (default: 1)
		 *
		 * @example
		 * ```typescript
		 * categoryStore.decrementPostCount(1); // -1
		 * categoryStore.decrementPostCount(1, 3); // -3
		 * ```
		 */
		decrementPostCount(categoryId: number, amount = 1): void {
			update((state) => {
				const category = state.categories.get(categoryId);
				if (!category) return state;

				const newCategories = new Map(state.categories);
				newCategories.set(categoryId, {
					...category,
					postCount: Math.max(0, category.postCount - amount)
				});

				return {
					...state,
					categories: newCategories
				};
			});
		},

		/**
		 * Clear all categories
		 *
		 * @example
		 * ```typescript
		 * categoryStore.clearCategories();
		 * ```
		 */
		clearCategories(): void {
			update((state) => ({
				...state,
				categories: new Map(),
				lastFetched: null
			}));
		},

		/**
		 * Reset store to initial state
		 */
		reset(): void {
			set(initialState);
		},

		// ========================================================================
		// Getters (synchronous access to state)
		// ========================================================================

		/**
		 * Get a category by ID
		 *
		 * @param categoryId - Category ID
		 * @returns Category or null if not found
		 */
		getCategory(categoryId: number): CategoryResponseDTO | null {
			let category: CategoryResponseDTO | null = null;
			subscribe((state) => {
				category = state.categories.get(categoryId) ?? null;
			})();
			return category;
		},

		/**
		 * Get all categories as array
		 *
		 * @returns Array of all categories
		 */
		getAllCategories(): CategoryResponseDTO[] {
			let categories: CategoryResponseDTO[] = [];
			subscribe((state) => {
				categories = Array.from(state.categories.values());
			})();
			return categories;
		},

		/**
		 * Check if a category exists
		 *
		 * @param categoryId - Category ID
		 * @returns True if category exists
		 */
		hasCategory(categoryId: number): boolean {
			let exists = false;
			subscribe((state) => {
				exists = state.categories.has(categoryId);
			})();
			return exists;
		},

		/**
		 * Check if any categories are loaded
		 *
		 * @returns True if categories exist
		 */
		hasCategories(): boolean {
			let hasAny = false;
			subscribe((state) => {
				hasAny = state.categories.size > 0;
			})();
			return hasAny;
		},

		/**
		 * Get category count
		 *
		 * @returns Number of categories
		 */
		getCategoryCount(): number {
			let count = 0;
			subscribe((state) => {
				count = state.categories.size;
			})();
			return count;
		}
	};
}

// ============================================================================
// Store Instance
// ============================================================================

export const categoryStore = createCategoryStore();

// ============================================================================
// Derived Stores
// ============================================================================

/**
 * All categories as an array
 */
export const categories: Readable<CategoryResponseDTO[]> = derived(categoryStore, ($store) =>
	Array.from($store.categories.values())
);

/**
 * Categories sorted by name (A-Z)
 */
export const categoriesByName: Readable<CategoryResponseDTO[]> = derived(
	categories,
	($categories) => {
		return [...$categories].sort((a, b) => a.name.localeCompare(b.name));
	}
);

/**
 * Categories sorted by post count (descending)
 */
export const categoriesByPopularity: Readable<CategoryResponseDTO[]> = derived(
	categories,
	($categories) => {
		return [...$categories].sort((a, b) => b.postCount - a.postCount);
	}
);

/**
 * Top 5 most popular categories
 */
export const topCategories: Readable<CategoryResponseDTO[]> = derived(
	categoriesByPopularity,
	($categories) => $categories.slice(0, 5)
);

/**
 * Categories with posts (post count > 0)
 */
export const categoriesWithPosts: Readable<CategoryResponseDTO[]> = derived(
	categories,
	($categories) => $categories.filter((cat) => cat.postCount > 0)
);

/**
 * Empty categories (post count = 0)
 */
export const emptyCategories: Readable<CategoryResponseDTO[]> = derived(categories, ($categories) =>
	$categories.filter((cat) => cat.postCount === 0)
);

/**
 * Loading state
 */
export const categoriesLoading: Readable<boolean> = derived(
	categoryStore,
	($store) => $store.loading
);

/**
 * Error state
 */
export const categoriesError: Readable<string | null> = derived(
	categoryStore,
	($store) => $store.error
);

/**
 * Whether categories have been loaded
 */
export const categoriesLoaded: Readable<boolean> = derived(
	categoryStore,
	($store) => $store.categories.size > 0
);

/**
 * Total number of categories
 */
export const categoryCount: Readable<number> = derived(
	categoryStore,
	($store) => $store.categories.size
);

/**
 * Total posts across all categories
 */
export const totalCategoryPosts: Readable<number> = derived(categories, ($categories) =>
	$categories.reduce((sum, cat) => sum + cat.postCount, 0)
);

/**
 * Category statistics
 */
export const categoryStats: Readable<{
	total: number;
	withPosts: number;
	empty: number;
	totalPosts: number;
	averagePostsPerCategory: number;
}> = derived(
	[categories, categoriesWithPosts, emptyCategories, totalCategoryPosts],
	([$categories, $withPosts, $empty, $totalPosts]) => ({
		total: $categories.length,
		withPosts: $withPosts.length,
		empty: $empty.length,
		totalPosts: $totalPosts,
		averagePostsPerCategory:
			$categories.length > 0 ? Math.round($totalPosts / $categories.length) : 0
	})
);

/**
 * Last fetch timestamp
 */
export const categoriesLastFetched: Readable<string | null> = derived(
	categoryStore,
	($store) => $store.lastFetched
);

/**
 * Check if categories need refresh (older than 5 minutes)
 */
export const categoriesNeedRefresh: Readable<boolean> = derived(
	categoriesLastFetched,
	($lastFetched) => {
		if (!$lastFetched) return true;

		const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
		const lastFetchTime = new Date($lastFetched).getTime();

		return lastFetchTime < fiveMinutesAgo;
	}
);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get category by ID (convenience function)
 *
 * @param categoryId - Category ID
 * @returns Category or null
 */
export function getCategory(categoryId: number): CategoryResponseDTO | null {
	return categoryStore.getCategory(categoryId);
}

/**
 * Get category name by ID
 *
 * @param categoryId - Category ID
 * @returns Category name or null
 */
export function getCategoryName(categoryId: number): string | null {
	const category = categoryStore.getCategory(categoryId);
	return category?.name ?? null;
}

/**
 * Get category icon by ID
 *
 * @param categoryId - Category ID
 * @returns Category icon URL or null
 */
export function getCategoryIcon(categoryId: number): string | null {
	const category = categoryStore.getCategory(categoryId);
	return category?.iconUrl ?? null;
}

/**
 * Check if category exists
 *
 * @param categoryId - Category ID
 * @returns True if category exists
 */
export function hasCategory(categoryId: number): boolean {
	return categoryStore.hasCategory(categoryId);
}

/**
 * Search categories by name (local search)
 *
 * @param query - Search query
 * @returns Matching categories
 */
export function searchCategoriesLocal(query: string): CategoryResponseDTO[] {
	const allCategories = categoryStore.getAllCategories();
	const lowerQuery = query.toLowerCase().trim();

	if (!lowerQuery) return allCategories;

	return allCategories.filter(
		(cat) =>
			cat.name.toLowerCase().includes(lowerQuery) ||
			cat.description?.toLowerCase().includes(lowerQuery)
	);
}

/**
 * Get categories by IDs (local lookup)
 *
 * @param categoryIds - Array of category IDs
 * @returns Array of categories
 */
export function getCategoriesByIds(categoryIds: number[]): CategoryResponseDTO[] {
	return categoryIds
		.map((id) => categoryStore.getCategory(id))
		.filter((cat): cat is CategoryResponseDTO => cat !== null);
}

// ============================================================================
// Export Types
// ============================================================================

export type { CategoryStoreState };
