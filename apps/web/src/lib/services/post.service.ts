import { apiClient } from './api.client';
import type { ApiResponse, PaginatedResponse } from '$types/api.types';
import type {
	CreatePostDTO,
	UpdatePostDTO,
	PostResponseDTO,
	FeedOptionsDTO,
	SearchOptionsDTO,
	SchedulePostDTO,
	LikeResponseDTO
} from '$types/post.types';

/**
 * Post Service
 * Handles all post-related API calls
 */

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Create a new post
 */
export async function createPost(data: CreatePostDTO): Promise<ApiResponse<PostResponseDTO>> {
	const response = await apiClient.post<ApiResponse<PostResponseDTO>>('/posts', data);
	return response.data;
}

/**
 * Get a single post by ID
 */
export async function getPost(postId: number): Promise<ApiResponse<PostResponseDTO>> {
	const response = await apiClient.get<ApiResponse<PostResponseDTO>>(`/posts/${postId}`);
	return response.data;
}

/**
 * Update an existing post
 */
export async function updatePost(
	postId: number,
	data: UpdatePostDTO
): Promise<ApiResponse<PostResponseDTO>> {
	const response = await apiClient.put<ApiResponse<PostResponseDTO>>(`/posts/${postId}`, data);
	return response.data;
}

/**
 * Delete a post
 */
export async function deletePost(postId: number): Promise<ApiResponse<void>> {
	const response = await apiClient.delete<ApiResponse<void>>(`/posts/${postId}`);
	return response.data;
}

// ============================================================================
// Feed & Discovery
// ============================================================================

/**
 * Get main feed with pagination
 * Supports infinite scroll by passing page parameter
 */
export async function getFeed(
	options: FeedOptionsDTO = {}
): Promise<ApiResponse<PaginatedResponse<PostResponseDTO>>> {
	const { page = 1, limit = 20, categoryId, userId } = options;

	const params = new URLSearchParams({
		page: page.toString(),
		limit: limit.toString()
	});

	if (categoryId) params.append('categoryId', categoryId.toString());
	if (userId) params.append('userId', userId.toString());

	const response = await apiClient.get<ApiResponse<PaginatedResponse<PostResponseDTO>>>(
		`/posts/feed?${params.toString()}`
	);
	return response.data;
}

/**
 * Search posts with filters
 */
export async function searchPosts(
	options: SearchOptionsDTO
): Promise<ApiResponse<PaginatedResponse<PostResponseDTO>>> {
	const { query, page = 1, limit = 20, categoryId, minPrice, maxPrice, location, sort } = options;

	const params = new URLSearchParams({
		query,
		page: page.toString(),
		limit: limit.toString()
	});

	if (categoryId) params.append('categoryId', categoryId.toString());
	if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
	if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
	if (location) params.append('location', location);
	if (sort?.field) params.append('sortBy', sort.field);
	if (sort?.order) params.append('sortOrder', sort.order);

	const response = await apiClient.get<ApiResponse<PaginatedResponse<PostResponseDTO>>>(
		`/posts/search?${params.toString()}`
	);
	return response.data;
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(
	categoryId: number,
	options: { page?: number; limit?: number } = {}
): Promise<ApiResponse<PaginatedResponse<PostResponseDTO>>> {
	return getFeed({ ...options, categoryId });
}

/**
 * Get posts by user
 */
export async function getPostsByUser(
	userId: number,
	options: { page?: number; limit?: number } = {}
): Promise<ApiResponse<PaginatedResponse<PostResponseDTO>>> {
	return getFeed({ ...options, userId });
}

/**
 * Get current user's posts
 */
export async function getMyPosts(
	options: { page?: number; limit?: number } = {}
): Promise<ApiResponse<PaginatedResponse<PostResponseDTO>>> {
	const { page = 1, limit = 20 } = options;

	const params = new URLSearchParams({
		page: page.toString(),
		limit: limit.toString()
	});

	const response = await apiClient.get<ApiResponse<PaginatedResponse<PostResponseDTO>>>(
		`/posts/my-posts?${params.toString()}`
	);
	return response.data;
}

/**
 * Get similar posts based on a post ID
 */
export async function getSimilarPosts(
	postId: number,
	limit: number = 5
): Promise<ApiResponse<PostResponseDTO[]>> {
	const response = await apiClient.get<ApiResponse<PostResponseDTO[]>>(
		`/posts/${postId}/similar?limit=${limit}`
	);
	return response.data;
}

// ============================================================================
// Post Actions
// ============================================================================

/**
 * Like a post
 */
export async function likePost(postId: number): Promise<ApiResponse<LikeResponseDTO>> {
	const response = await apiClient.post<ApiResponse<LikeResponseDTO>>(`/posts/${postId}/like`);
	return response.data;
}

/**
 * Unlike a post
 */
export async function unlikePost(postId: number): Promise<ApiResponse<LikeResponseDTO>> {
	const response = await apiClient.delete<ApiResponse<LikeResponseDTO>>(`/posts/${postId}/like`);
	return response.data;
}

/**
 * Increment view count for a post
 */
export async function incrementViewCount(postId: number): Promise<ApiResponse<void>> {
	const response = await apiClient.post<ApiResponse<void>>(`/posts/${postId}/view`);
	return response.data;
}

/**
 * Schedule a post for later publication
 */
export async function schedulePost(
	postId: number,
	data: SchedulePostDTO
): Promise<ApiResponse<PostResponseDTO>> {
	const response = await apiClient.post<ApiResponse<PostResponseDTO>>(
		`/posts/${postId}/schedule`,
		data
	);
	return response.data;
}

/**
 * Publish a draft post immediately
 */
export async function publishPost(postId: number): Promise<ApiResponse<PostResponseDTO>> {
	const response = await apiClient.post<ApiResponse<PostResponseDTO>>(`/posts/${postId}/publish`);
	return response.data;
}

/**
 * Save post as draft
 */
export async function saveDraft(data: CreatePostDTO): Promise<ApiResponse<PostResponseDTO>> {
	const response = await apiClient.post<ApiResponse<PostResponseDTO>>('/posts/draft', data);
	return response.data;
}

/**
 * Update draft post
 */
export async function updateDraft(
	postId: number,
	data: UpdatePostDTO
): Promise<ApiResponse<PostResponseDTO>> {
	const response = await apiClient.put<ApiResponse<PostResponseDTO>>(
		`/posts/draft/${postId}`,
		data
	);
	return response.data;
}

// ============================================================================
// Admin Operations
// ============================================================================

/**
 * Get posts pending approval (admin only)
 */
export async function getPendingPosts(
	options: { page?: number; limit?: number } = {}
): Promise<ApiResponse<PaginatedResponse<PostResponseDTO>>> {
	const { page = 1, limit = 20 } = options;

	const params = new URLSearchParams({
		page: page.toString(),
		limit: limit.toString()
	});

	const response = await apiClient.get<ApiResponse<PaginatedResponse<PostResponseDTO>>>(
		`/posts/pending?${params.toString()}`
	);
	return response.data;
}

/**
 * Approve a post (admin only)
 */
export async function approvePost(postId: number): Promise<ApiResponse<PostResponseDTO>> {
	const response = await apiClient.post<ApiResponse<PostResponseDTO>>(`/posts/${postId}/approve`);
	return response.data;
}

/**
 * Reject a post (admin only)
 */
export async function rejectPost(
	postId: number,
	reason?: string
): Promise<ApiResponse<PostResponseDTO>> {
	const response = await apiClient.post<ApiResponse<PostResponseDTO>>(`/posts/${postId}/reject`, {
		reason
	});
	return response.data;
}

// ============================================================================
// Analytics
// ============================================================================

/**
 * Get post analytics (views, likes, engagement)
 */
export async function getPostAnalytics(postId: number): Promise<
	ApiResponse<{
		views: number;
		likes: number;
		shares: number;
		engagement: number;
		viewsByDay: Array<{ date: string; count: number }>;
	}>
> {
	const response = await apiClient.get(`/posts/${postId}/analytics`);
	return response.data;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Build query string for feed options
 */
export function buildFeedQueryString(options: FeedOptionsDTO): string {
	const params = new URLSearchParams();

	if (options.page) params.append('page', options.page.toString());
	if (options.limit) params.append('limit', options.limit.toString());
	if (options.categoryId) params.append('categoryId', options.categoryId.toString());
	if (options.userId) params.append('userId', options.userId.toString());

	return params.toString();
}

/**
 * Calculate if there are more pages to load
 */
export function hasMorePages(response: PaginatedResponse<any>): boolean {
	return response.pagination.page < response.pagination.pages;
}

/**
 * Get next page number
 */
export function getNextPage(response: PaginatedResponse<any>): number | null {
	return hasMorePages(response) ? response.pagination.page + 1 : null;
}
