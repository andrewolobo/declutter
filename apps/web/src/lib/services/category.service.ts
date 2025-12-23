/**
 * Category Service
 *
 * Handles all category-related operations including fetching categories,
 * category hierarchy, and category statistics.
 *
 * @module services/category
 */

import { apiClient } from './api.client';
import { categoryStore } from '$lib/stores/category.store';
import { handleApiError } from '$lib/utils/error-handler';
import type { ApiResponse } from '$lib/types/api.types';
import type {
	CategoryResponseDTO,
	CreateCategoryDTO,
	UpdateCategoryDTO
} from '$lib/types/category.types';

// ============================================================================
// Category Fetching
// ============================================================================

/**
 * Get all categories
 *
 * @param forceRefresh - Force fetch from API instead of using cache
 * @returns Promise resolving to array of categories
 *
 * @example
 * ```typescript
 * const categories = await getCategories();
 * console.log(`Found ${categories.length} categories`);
 * ```
 */
export async function getCategories(forceRefresh = false): Promise<CategoryResponseDTO[]> {
	try {
		// Check cache first unless force refresh
		const cached = categoryStore.getAllCategories();
		if (!forceRefresh && cached.length > 0) {
			return cached;
		}

		const response = await apiClient.get<ApiResponse<CategoryResponseDTO[]>>('/categories');

		if (response.data.success && response.data.data) {
			// Update store with fresh data
			categoryStore.setCategories(response.data.data);
			return response.data.data;
		}

		return [];
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Get a single category by ID
 *
 * @param categoryId - The category ID
 * @param forceRefresh - Force fetch from API instead of using cache
 * @returns Promise resolving to category data
 *
 * @example
 * ```typescript
 * const category = await getCategory(1);
 * console.log('Category:', category.name);
 * ```
 */
export async function getCategory(
	categoryId: number,
	forceRefresh = false
): Promise<CategoryResponseDTO> {
	try {
		// Check cache first unless force refresh
		const cached = categoryStore.getCategory(categoryId);
		if (!forceRefresh && cached) {
			return cached;
		}

		const response = await apiClient.get<ApiResponse<CategoryResponseDTO>>(
			`/categories/${categoryId}`
		);

		if (response.data.success && response.data.data) {
			// Update store
			categoryStore.updateCategory(response.data.data);
			return response.data.data;
		}

		throw new Error('Category not found');
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Get categories with their post counts
 *
 * @param forceRefresh - Force fetch from API instead of using cache
 * @returns Promise resolving to categories with statistics
 *
 * @example
 * ```typescript
 * const stats = await getCategoriesWithStats();
 * stats.forEach(cat => console.log(`${cat.name}: ${cat.postCount} posts`));
 * ```
 */
export async function getCategoriesWithStats(forceRefresh = false): Promise<CategoryResponseDTO[]> {
	try {
		// Check cache first unless force refresh
		if (!forceRefresh && categoryStore.hasCategories()) {
			return categoryStore.getAllCategories();
		}

		const response = await apiClient.get<ApiResponse<CategoryResponseDTO[]>>('/categories/stats');

		if (response.data.success && response.data.data) {
			categoryStore.setCategories(response.data.data);
			return response.data.data;
		}

		return [];
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Get popular categories (sorted by post count)
 *
 * @param limit - Maximum number of categories to return
 * @returns Promise resolving to popular categories
 *
 * @example
 * ```typescript
 * const popular = await getPopularCategories(5);
 * console.log('Top 5 categories:', popular);
 * ```
 */
export async function getPopularCategories(limit = 10): Promise<CategoryResponseDTO[]> {
	try {
		const response = await apiClient.get<ApiResponse<CategoryResponseDTO[]>>(
			'/categories/popular',
			{ params: { limit } }
		);

		if (response.data.success && response.data.data) {
			return response.data.data;
		}

		return [];
	} catch (error) {
		throw handleApiError(error);
	}
}

// ============================================================================
// Category Management (Admin)
// ============================================================================

/**
 * Create a new category (admin only)
 *
 * @param data - Category creation data
 * @returns Promise resolving to created category
 *
 * @example
 * ```typescript
 * const category = await createCategory({
 *   name: 'Electronics',
 *   description: 'Electronic devices and gadgets',
 *   iconUrl: 'https://cdn.example.com/icons/electronics.svg'
 * });
 * ```
 */
export async function createCategory(data: CreateCategoryDTO): Promise<CategoryResponseDTO> {
	try {
		const response = await apiClient.post<ApiResponse<CategoryResponseDTO>>('/categories', data);

		if (response.data.success && response.data.data) {
			// Add to store
			categoryStore.addCategory(response.data.data);
			return response.data.data;
		}

		throw new Error('Failed to create category');
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Update a category (admin only)
 *
 * @param categoryId - The category ID
 * @param data - Category update data
 * @returns Promise resolving to updated category
 *
 * @example
 * ```typescript
 * const updated = await updateCategory(1, {
 *   description: 'Updated description'
 * });
 * ```
 */
export async function updateCategory(
	categoryId: number,
	data: UpdateCategoryDTO
): Promise<CategoryResponseDTO> {
	try {
		const response = await apiClient.put<ApiResponse<CategoryResponseDTO>>(
			`/categories/${categoryId}`,
			data
		);

		if (response.data.success && response.data.data) {
			// Update store
			categoryStore.updateCategory(response.data.data);
			return response.data.data;
		}

		throw new Error('Failed to update category');
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Delete a category (admin only)
 *
 * @param categoryId - The category ID
 * @returns Promise resolving when deletion is complete
 *
 * @example
 * ```typescript
 * await deleteCategory(1);
 * console.log('Category deleted');
 * ```
 */
export async function deleteCategory(categoryId: number): Promise<void> {
	try {
		const response = await apiClient.delete<ApiResponse<void>>(`/categories/${categoryId}`);

		if (response.data.success) {
			// Remove from store
			categoryStore.removeCategory(categoryId);
		}
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Reorder categories (admin only)
 *
 * @param categoryIds - Array of category IDs in desired order
 * @returns Promise resolving when reordering is complete
 *
 * @example
 * ```typescript
 * await reorderCategories([3, 1, 2, 4]);
 * console.log('Categories reordered');
 * ```
 */
export async function reorderCategories(categoryIds: number[]): Promise<void> {
	try {
		const response = await apiClient.post<ApiResponse<void>>('/categories/reorder', {
			categoryIds
		});

		if (response.data.success) {
			// Refresh categories to get new order
			await getCategories(true);
		}
	} catch (error) {
		throw handleApiError(error);
	}
}

// ============================================================================
// Category Search & Filter
// ============================================================================

/**
 * Search categories by name
 *
 * @param query - Search query string
 * @returns Promise resolving to matching categories
 *
 * @example
 * ```typescript
 * const results = await searchCategories('elect');
 * console.log('Found:', results);
 * ```
 */
export async function searchCategories(query: string): Promise<CategoryResponseDTO[]> {
	try {
		if (!query.trim()) {
			return [];
		}

		const response = await apiClient.get<ApiResponse<CategoryResponseDTO[]>>('/categories/search', {
			params: { q: query }
		});

		if (response.data.success && response.data.data) {
			return response.data.data;
		}

		return [];
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Get categories by IDs
 *
 * @param categoryIds - Array of category IDs
 * @returns Promise resolving to categories
 *
 * @example
 * ```typescript
 * const categories = await getCategoriesByIds([1, 3, 5]);
 * ```
 */
export async function getCategoriesByIds(categoryIds: number[]): Promise<CategoryResponseDTO[]> {
	try {
		if (categoryIds.length === 0) {
			return [];
		}

		// Try to get from cache first
		const cached = categoryIds
			.map((id) => categoryStore.getCategory(id))
			.filter((cat): cat is CategoryResponseDTO => cat !== null);

		if (cached.length === categoryIds.length) {
			return cached;
		}

		// Fetch missing ones
		const response = await apiClient.post<ApiResponse<CategoryResponseDTO[]>>('/categories/batch', {
			categoryIds
		});

		if (response.data.success && response.data.data) {
			// Update store
			response.data.data.forEach((cat) => categoryStore.updateCategory(cat));
			return response.data.data;
		}

		return [];
	} catch (error) {
		throw handleApiError(error);
	}
}

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Refresh categories cache
 *
 * @example
 * ```typescript
 * await refreshCategories();
 * console.log('Categories cache refreshed');
 * ```
 */
export async function refreshCategories(): Promise<void> {
	await getCategories(true);
}

/**
 * Clear categories cache
 *
 * @example
 * ```typescript
 * clearCategoriesCache();
 * ```
 */
export function clearCategoriesCache(): void {
	categoryStore.clearCategories();
}

/**
 * Check if categories are loaded in cache
 *
 * @returns True if categories are cached
 */
export function hasCachedCategories(): boolean {
	return categoryStore.hasCategories();
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get category name by ID
 *
 * @param categoryId - The category ID
 * @returns Category name or null if not found
 *
 * @example
 * ```typescript
 * const name = getCategoryName(1);
 * console.log('Category name:', name);
 * ```
 */
export function getCategoryName(categoryId: number): string | null {
	const category = categoryStore.getCategory(categoryId);
	return category?.name ?? null;
}

/**
 * Get category icon URL by ID
 *
 * @param categoryId - The category ID
 * @returns Category icon URL or null if not found
 */
export function getCategoryIcon(categoryId: number): string | null {
	const category = categoryStore.getCategory(categoryId);
	return category?.iconUrl ?? null;
}

/**
 * Get total post count across all categories
 *
 * @returns Total post count
 */
export function getTotalPostCount(): number {
	const categories = categoryStore.getAllCategories();
	return categories.reduce((sum, cat) => sum + cat.postCount, 0);
}

/**
 * Sort categories by name
 *
 * @param categories - Array of categories to sort
 * @param ascending - Sort order (default: true)
 * @returns Sorted categories
 */
export function sortCategoriesByName(
	categories: CategoryResponseDTO[],
	ascending = true
): CategoryResponseDTO[] {
	return [...categories].sort((a, b) => {
		const comparison = a.name.localeCompare(b.name);
		return ascending ? comparison : -comparison;
	});
}

/**
 * Sort categories by post count
 *
 * @param categories - Array of categories to sort
 * @param ascending - Sort order (default: false for most popular first)
 * @returns Sorted categories
 */
export function sortCategoriesByPostCount(
	categories: CategoryResponseDTO[],
	ascending = false
): CategoryResponseDTO[] {
	return [...categories].sort((a, b) => {
		const comparison = a.postCount - b.postCount;
		return ascending ? comparison : -comparison;
	});
}

/**
 * Filter categories with minimum post count
 *
 * @param categories - Array of categories to filter
 * @param minPosts - Minimum post count
 * @returns Filtered categories
 */
export function filterCategoriesByMinPosts(
	categories: CategoryResponseDTO[],
	minPosts: number
): CategoryResponseDTO[] {
	return categories.filter((cat) => cat.postCount >= minPosts);
}

// ============================================================================
// Export Default Service Object
// ============================================================================

export const categoryService = {
	// Fetching
	getCategories,
	getCategory,
	getCategoriesWithStats,
	getPopularCategories,

	// Management (Admin)
	createCategory,
	updateCategory,
	deleteCategory,
	reorderCategories,

	// Search & Filter
	searchCategories,
	getCategoriesByIds,

	// Cache
	refreshCategories,
	clearCategoriesCache,
	hasCachedCategories,

	// Utilities
	getCategoryName,
	getCategoryIcon,
	getTotalPostCount,
	sortCategoriesByName,
	sortCategoriesByPostCount,
	filterCategoriesByMinPosts
};

export default categoryService;
