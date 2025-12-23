/**
 * Category Service Tests
 * 
 * Comprehensive test suite for category service functionality.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiClient } from './api.client';
import { categoryStore } from '$lib/stores/category.store';
import * as categoryService from './category.service';
import type { CategoryResponseDTO, CreateCategoryDTO, UpdateCategoryDTO } from '$lib/types/category.types';

// Mock API client
vi.mock('./api.client', () => ({
	apiClient: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn()
	}
}));

// Mock category store
vi.mock('$lib/stores/category.store', () => ({
	categoryStore: {
		getAllCategories: vi.fn(),
		getCategory: vi.fn(),
		hasCategories: vi.fn(),
		setCategories: vi.fn(),
		updateCategory: vi.fn(),
		addCategory: vi.fn(),
		removeCategory: vi.fn(),
		clearCategories: vi.fn()
	}
}));

describe('Category Service', () => {
	// Sample test data
	const mockCategory: CategoryResponseDTO = {
		id: 1,
		name: 'Electronics',
		description: 'Electronic devices and gadgets',
		iconUrl: 'https://cdn.example.com/icons/electronics.svg',
		postCount: 42,
		createdAt: new Date('2025-01-01')
	};

	const mockCategories: CategoryResponseDTO[] = [
		mockCategory,
		{
			id: 2,
			name: 'Furniture',
			description: 'Home and office furniture',
			iconUrl: 'https://cdn.example.com/icons/furniture.svg',
			postCount: 28,
			createdAt: new Date('2025-01-02')
		},
		{
			id: 3,
			name: 'Clothing',
			description: 'Apparel and accessories',
			iconUrl: 'https://cdn.example.com/icons/clothing.svg',
			postCount: 56,
			createdAt: new Date('2025-01-03')
		}
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	// ========================================================================
	// Category Fetching
	// ========================================================================

	describe('getCategories', () => {
		it('should fetch categories from API on first call', async () => {
			vi.mocked(categoryStore.getAllCategories).mockReturnValue([]);
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: mockCategories }
			});

			const result = await categoryService.getCategories();

			expect(apiClient.get).toHaveBeenCalledWith('/categories');
			expect(categoryStore.setCategories).toHaveBeenCalledWith(mockCategories);
			expect(result).toEqual(mockCategories);
		});

		it('should return cached categories when available', async () => {
			vi.mocked(categoryStore.getAllCategories).mockReturnValue(mockCategories);

			const result = await categoryService.getCategories();

			expect(apiClient.get).not.toHaveBeenCalled();
			expect(result).toEqual(mockCategories);
		});

		it('should force refresh when requested', async () => {
			vi.mocked(categoryStore.getAllCategories).mockReturnValue(mockCategories);
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: mockCategories }
			});

			const result = await categoryService.getCategories(true);

			expect(apiClient.get).toHaveBeenCalledWith('/categories');
			expect(result).toEqual(mockCategories);
		});

		it('should return empty array if API returns no data', async () => {
			vi.mocked(categoryStore.getAllCategories).mockReturnValue([]);
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: null }
			});

			const result = await categoryService.getCategories();

			expect(result).toEqual([]);
		});

		it('should handle API errors', async () => {
			vi.mocked(categoryStore.getAllCategories).mockReturnValue([]);
			vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

			await expect(categoryService.getCategories()).rejects.toThrow();
		});
	});

	describe('getCategory', () => {
		it('should fetch category from API', async () => {
			vi.mocked(categoryStore.getCategory).mockReturnValue(null);
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: mockCategory }
			});

			const result = await categoryService.getCategory(1);

			expect(apiClient.get).toHaveBeenCalledWith('/categories/1');
			expect(categoryStore.updateCategory).toHaveBeenCalledWith(mockCategory);
			expect(result).toEqual(mockCategory);
		});

		it('should return cached category when available', async () => {
			vi.mocked(categoryStore.getCategory).mockReturnValue(mockCategory);

			const result = await categoryService.getCategory(1);

			expect(apiClient.get).not.toHaveBeenCalled();
			expect(result).toEqual(mockCategory);
		});

		it('should force refresh when requested', async () => {
			vi.mocked(categoryStore.getCategory).mockReturnValue(mockCategory);
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: mockCategory }
			});

			const result = await categoryService.getCategory(1, true);

			expect(apiClient.get).toHaveBeenCalledWith('/categories/1');
			expect(result).toEqual(mockCategory);
		});

		it('should throw error if category not found', async () => {
			vi.mocked(categoryStore.getCategory).mockReturnValue(null);
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: null }
			});

			await expect(categoryService.getCategory(999)).rejects.toThrow('Category not found');
		});
	});

	describe('getCategoriesWithStats', () => {
		it('should fetch categories with statistics', async () => {
			vi.mocked(categoryStore.hasCategories).mockReturnValue(false);
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: mockCategories }
			});

			const result = await categoryService.getCategoriesWithStats();

			expect(apiClient.get).toHaveBeenCalledWith('/categories/stats');
			expect(categoryStore.setCategories).toHaveBeenCalledWith(mockCategories);
			expect(result).toEqual(mockCategories);
		});

		it('should use cache if available and no force refresh', async () => {
			vi.mocked(categoryStore.hasCategories).mockReturnValue(true);
			vi.mocked(categoryStore.getAllCategories).mockReturnValue(mockCategories);

			const result = await categoryService.getCategoriesWithStats();

			expect(apiClient.get).not.toHaveBeenCalled();
			expect(result).toEqual(mockCategories);
		});
	});

	describe('getPopularCategories', () => {
		it('should fetch popular categories with default limit', async () => {
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: mockCategories }
			});

			const result = await categoryService.getPopularCategories();

			expect(apiClient.get).toHaveBeenCalledWith('/categories/popular', {
				params: { limit: 10 }
			});
			expect(result).toEqual(mockCategories);
		});

		it('should fetch popular categories with custom limit', async () => {
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: mockCategories.slice(0, 5) }
			});

			const result = await categoryService.getPopularCategories(5);

			expect(apiClient.get).toHaveBeenCalledWith('/categories/popular', {
				params: { limit: 5 }
			});
			expect(result).toHaveLength(3);
		});

		it('should return empty array on error', async () => {
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: false, data: null }
			});

			const result = await categoryService.getPopularCategories();

			expect(result).toEqual([]);
		});
	});

	// ========================================================================
	// Category Management (Admin)
	// ========================================================================

	describe('createCategory', () => {
		const createData: CreateCategoryDTO = {
			name: 'New Category',
			description: 'Test category',
			iconUrl: 'https://cdn.example.com/icons/new.svg'
		};

		it('should create a new category', async () => {
			const newCategory = { ...mockCategory, id: 4, ...createData };
			vi.mocked(apiClient.post).mockResolvedValue({
				data: { success: true, data: newCategory }
			});

			const result = await categoryService.createCategory(createData);

			expect(apiClient.post).toHaveBeenCalledWith('/categories', createData);
			expect(categoryStore.addCategory).toHaveBeenCalledWith(newCategory);
			expect(result).toEqual(newCategory);
		});

		it('should throw error if creation fails', async () => {
			vi.mocked(apiClient.post).mockResolvedValue({
				data: { success: false, data: null }
			});

			await expect(categoryService.createCategory(createData)).rejects.toThrow(
				'Failed to create category'
			);
		});

		it('should handle API errors', async () => {
			vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

			await expect(categoryService.createCategory(createData)).rejects.toThrow();
		});
	});

	describe('updateCategory', () => {
		const updateData: UpdateCategoryDTO = {
			name: 'Updated Electronics',
			description: 'Updated description'
		};

		it('should update an existing category', async () => {
			const updatedCategory = { ...mockCategory, ...updateData };
			vi.mocked(apiClient.put).mockResolvedValue({
				data: { success: true, data: updatedCategory }
			});

			const result = await categoryService.updateCategory(1, updateData);

			expect(apiClient.put).toHaveBeenCalledWith('/categories/1', updateData);
			expect(categoryStore.updateCategory).toHaveBeenCalledWith(updatedCategory);
			expect(result).toEqual(updatedCategory);
		});

		it('should throw error if update fails', async () => {
			vi.mocked(apiClient.put).mockResolvedValue({
				data: { success: false, data: null }
			});

			await expect(categoryService.updateCategory(1, updateData)).rejects.toThrow(
				'Failed to update category'
			);
		});
	});

	describe('deleteCategory', () => {
		it('should delete a category', async () => {
			vi.mocked(apiClient.delete).mockResolvedValue({
				data: { success: true }
			});

			await categoryService.deleteCategory(1);

			expect(apiClient.delete).toHaveBeenCalledWith('/categories/1');
			expect(categoryStore.removeCategory).toHaveBeenCalledWith(1);
		});

		it('should not remove from store if API fails', async () => {
			vi.mocked(apiClient.delete).mockResolvedValue({
				data: { success: false }
			});

			await categoryService.deleteCategory(1);

			expect(categoryStore.removeCategory).not.toHaveBeenCalled();
		});
	});

	describe('reorderCategories', () => {
		it('should reorder categories', async () => {
			const categoryIds = [3, 1, 2];
			vi.mocked(apiClient.post).mockResolvedValue({
				data: { success: true }
			});
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: mockCategories }
			});

			await categoryService.reorderCategories(categoryIds);

			expect(apiClient.post).toHaveBeenCalledWith('/categories/reorder', { categoryIds });
			expect(apiClient.get).toHaveBeenCalledWith('/categories');
		});
	});

	// ========================================================================
	// Category Search & Filter
	// ========================================================================

	describe('searchCategories', () => {
		it('should search categories by query', async () => {
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: [mockCategory] }
			});

			const result = await categoryService.searchCategories('elect');

			expect(apiClient.get).toHaveBeenCalledWith('/categories/search', {
				params: { q: 'elect' }
			});
			expect(result).toEqual([mockCategory]);
		});

		it('should return empty array for empty query', async () => {
			const result = await categoryService.searchCategories('  ');

			expect(apiClient.get).not.toHaveBeenCalled();
			expect(result).toEqual([]);
		});

		it('should handle API errors gracefully', async () => {
			vi.mocked(apiClient.get).mockRejectedValue(new Error('Search failed'));

			await expect(categoryService.searchCategories('test')).rejects.toThrow();
		});
	});

	describe('getCategoriesByIds', () => {
		it('should return empty array for empty input', async () => {
			const result = await categoryService.getCategoriesByIds([]);

			expect(apiClient.post).not.toHaveBeenCalled();
			expect(result).toEqual([]);
		});

		it('should return cached categories if all found', async () => {
			vi.mocked(categoryStore.getCategory)
				.mockReturnValueOnce(mockCategories[0])
				.mockReturnValueOnce(mockCategories[1]);

			const result = await categoryService.getCategoriesByIds([1, 2]);

			expect(apiClient.post).not.toHaveBeenCalled();
			expect(result).toEqual([mockCategories[0], mockCategories[1]]);
		});

		it('should fetch from API if some categories not cached', async () => {
			vi.mocked(categoryStore.getCategory)
				.mockReturnValueOnce(mockCategories[0])
				.mockReturnValueOnce(null);
			vi.mocked(apiClient.post).mockResolvedValue({
				data: { success: true, data: mockCategories.slice(0, 2) }
			});

			const result = await categoryService.getCategoriesByIds([1, 2]);

			expect(apiClient.post).toHaveBeenCalledWith('/categories/batch', {
				categoryIds: [1, 2]
			});
			expect(result).toEqual(mockCategories.slice(0, 2));
		});
	});

	// ========================================================================
	// Cache Management
	// ========================================================================

	describe('refreshCategories', () => {
		it('should force refresh categories', async () => {
			vi.mocked(apiClient.get).mockResolvedValue({
				data: { success: true, data: mockCategories }
			});

			await categoryService.refreshCategories();

			expect(apiClient.get).toHaveBeenCalledWith('/categories');
		});
	});

	describe('clearCategoriesCache', () => {
		it('should clear categories cache', () => {
			categoryService.clearCategoriesCache();

			expect(categoryStore.clearCategories).toHaveBeenCalled();
		});
	});

	describe('hasCachedCategories', () => {
		it('should return true if categories are cached', () => {
			vi.mocked(categoryStore.hasCategories).mockReturnValue(true);

			const result = categoryService.hasCachedCategories();

			expect(result).toBe(true);
		});

		it('should return false if no categories are cached', () => {
			vi.mocked(categoryStore.hasCategories).mockReturnValue(false);

			const result = categoryService.hasCachedCategories();

			expect(result).toBe(false);
		});
	});

	// ========================================================================
	// Utility Functions
	// ========================================================================

	describe('getCategoryName', () => {
		it('should return category name by ID', () => {
			vi.mocked(categoryStore.getCategory).mockReturnValue(mockCategory);

			const result = categoryService.getCategoryName(1);

			expect(result).toBe('Electronics');
		});

		it('should return null if category not found', () => {
			vi.mocked(categoryStore.getCategory).mockReturnValue(null);

			const result = categoryService.getCategoryName(999);

			expect(result).toBeNull();
		});
	});

	describe('getCategoryIcon', () => {
		it('should return category icon URL by ID', () => {
			vi.mocked(categoryStore.getCategory).mockReturnValue(mockCategory);

			const result = categoryService.getCategoryIcon(1);

			expect(result).toBe('https://cdn.example.com/icons/electronics.svg');
		});

		it('should return null if category not found', () => {
			vi.mocked(categoryStore.getCategory).mockReturnValue(null);

			const result = categoryService.getCategoryIcon(999);

			expect(result).toBeNull();
		});
	});

	describe('getTotalPostCount', () => {
		it('should return total post count across all categories', () => {
			vi.mocked(categoryStore.getAllCategories).mockReturnValue(mockCategories);

			const result = categoryService.getTotalPostCount();

			expect(result).toBe(126); // 42 + 28 + 56
		});

		it('should return 0 if no categories', () => {
			vi.mocked(categoryStore.getAllCategories).mockReturnValue([]);

			const result = categoryService.getTotalPostCount();

			expect(result).toBe(0);
		});
	});

	describe('sortCategoriesByName', () => {
		it('should sort categories by name ascending', () => {
			const result = categoryService.sortCategoriesByName(mockCategories);

			expect(result[0].name).toBe('Clothing');
			expect(result[1].name).toBe('Electronics');
			expect(result[2].name).toBe('Furniture');
		});

		it('should sort categories by name descending', () => {
			const result = categoryService.sortCategoriesByName(mockCategories, false);

			expect(result[0].name).toBe('Furniture');
			expect(result[1].name).toBe('Electronics');
			expect(result[2].name).toBe('Clothing');
		});
	});

	describe('sortCategoriesByPostCount', () => {
		it('should sort categories by post count descending (default)', () => {
			const result = categoryService.sortCategoriesByPostCount(mockCategories);

			expect(result[0].postCount).toBe(56);
			expect(result[1].postCount).toBe(42);
			expect(result[2].postCount).toBe(28);
		});

		it('should sort categories by post count ascending', () => {
			const result = categoryService.sortCategoriesByPostCount(mockCategories, true);

			expect(result[0].postCount).toBe(28);
			expect(result[1].postCount).toBe(42);
			expect(result[2].postCount).toBe(56);
		});
	});

	describe('filterCategoriesByMinPosts', () => {
		it('should filter categories with minimum post count', () => {
			const result = categoryService.filterCategoriesByMinPosts(mockCategories, 30);

			expect(result).toHaveLength(2);
			expect(result[0].postCount).toBe(42);
			expect(result[1].postCount).toBe(56);
		});

		it('should return all categories if min is 0', () => {
			const result = categoryService.filterCategoriesByMinPosts(mockCategories, 0);

			expect(result).toHaveLength(3);
		});

		it('should return empty array if min is too high', () => {
			const result = categoryService.filterCategoriesByMinPosts(mockCategories, 100);

			expect(result).toHaveLength(0);
		});
	});
});
