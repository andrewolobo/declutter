import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import * as postService from './post.service';
import { postStore } from '$lib/stores/post.store';
import { apiClient } from './api.client';
import type { PostResponseDTO, CreatePostDTO, PostStatus } from '$types/post.types';

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

describe('Post Service', () => {
	// Sample test data
	const mockPost: PostResponseDTO = {
		id: 1,
		title: 'Test Post',
		description: 'Test Description',
		price: 100,
		location: 'Test Location',
		contactNumber: '1234567890',
		status: 'Active' as PostStatus,
		user: {
			id: 1,
			fullName: 'Test User',
			profilePictureUrl: 'https://example.com/avatar.jpg'
		},
		category: {
			id: 1,
			name: 'Electronics'
		},
		images: [
			{
				id: 1,
				imageUrl: 'https://example.com/image.jpg',
				displayOrder: 1
			}
		],
		likeCount: 5,
		viewCount: 10,
		isLiked: false,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const mockCreatePostData: CreatePostDTO = {
		title: 'New Post',
		categoryId: 1,
		description: 'New Description',
		price: 150,
		location: 'New Location',
		contactNumber: '9876543210'
	};

	beforeEach(() => {
		// Reset store before each test
		postStore.reset();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('CRUD Operations', () => {
		describe('createPost', () => {
			it('should create a post and update store', async () => {
				const response = {
					data: {
						success: true,
						data: mockPost,
						message: 'Post created'
					}
				};

				vi.mocked(apiClient.post).mockResolvedValue(response);

				const result = await postService.createPost(mockCreatePostData);

				expect(result.success).toBe(true);
				expect(result.data).toEqual(mockPost);
				expect(apiClient.post).toHaveBeenCalledWith('/posts', mockCreatePostData);

				// Check store updates
				const storeState = get(postStore);
				expect(storeState.myPosts).toContainEqual(mockPost);
				expect(storeState.posts[mockPost.id]).toEqual(mockPost);
			});

			it('should handle create post error', async () => {
				const error = new Error('Failed to create post');
				vi.mocked(apiClient.post).mockRejectedValue(error);

				await expect(postService.createPost(mockCreatePostData)).rejects.toThrow();
			});
		});

		describe('getPost', () => {
			it('should fetch a post and cache it', async () => {
				const response = {
					data: {
						success: true,
						data: mockPost,
						message: 'Post retrieved'
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await postService.getPost(1);

				expect(result.success).toBe(true);
				expect(result.data).toEqual(mockPost);
				expect(apiClient.get).toHaveBeenCalledWith('/posts/1');

				// Check cache
				const storeState = get(postStore);
				expect(storeState.posts[1]).toEqual(mockPost);
			});

			it('should return cached post without API call', async () => {
				// Pre-populate cache
				postStore.setPost(mockPost);

				const result = await postService.getPost(1, false);

				expect(result.success).toBe(true);
				expect(result.data).toEqual(mockPost);
				expect(apiClient.get).not.toHaveBeenCalled();
			});

			it('should force refresh even with cached data', async () => {
				// Pre-populate cache
				postStore.setPost(mockPost);

				const response = {
					data: {
						success: true,
						data: { ...mockPost, title: 'Updated Title' },
						message: 'Post retrieved'
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await postService.getPost(1, true);

				expect(result.success).toBe(true);
				expect(result.data?.title).toBe('Updated Title');
				expect(apiClient.get).toHaveBeenCalled();
			});

			it('should handle get post error', async () => {
				const error = new Error('Post not found');
				vi.mocked(apiClient.get).mockRejectedValue(error);

				await expect(postService.getPost(999)).rejects.toThrow();

				const storeState = get(postStore);
				expect(storeState.postError[999]).toBeTruthy();
			});
		});

		describe('updatePost', () => {
			it('should update a post and sync store', async () => {
				const updatedPost = { ...mockPost, title: 'Updated Title' };
				const response = {
					data: {
						success: true,
						data: updatedPost,
						message: 'Post updated'
					}
				};

				vi.mocked(apiClient.put).mockResolvedValue(response);

				const result = await postService.updatePost(1, { title: 'Updated Title' });

				expect(result.success).toBe(true);
				expect(result.data?.title).toBe('Updated Title');

				const storeState = get(postStore);
				expect(storeState.posts[1]).toEqual(updatedPost);
			});
		});

		describe('deletePost', () => {
			it('should delete a post and remove from store', async () => {
				// Pre-populate store
				postStore.setPost(mockPost);
				postStore.addMyPost(mockPost);

				const response = {
					data: {
						success: true,
						message: 'Post deleted'
					}
				};

				vi.mocked(apiClient.delete).mockResolvedValue(response);

				const result = await postService.deletePost(1);

				expect(result.success).toBe(true);

				const storeState = get(postStore);
				expect(storeState.posts[1]).toBeUndefined();
				expect(storeState.myPosts).not.toContainEqual(mockPost);
			});
		});
	});

	describe('Feed Operations', () => {
		describe('getFeed', () => {
			it('should fetch feed and update store', async () => {
				const posts = [mockPost, { ...mockPost, id: 2 }];
				const response = {
					data: {
						success: true,
						data: {
							data: posts,
							pagination: {
								page: 1,
								limit: 20,
								total: 2,
								pages: 1
							}
						}
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				const result = await postService.getFeed({ page: 1, limit: 20 });

				expect(result.success).toBe(true);
				expect(apiClient.get).toHaveBeenCalled();

				const storeState = get(postStore);
				expect(storeState.feedPosts).toHaveLength(2);
				expect(storeState.feedHasMore).toBe(false);
			});

			it('should append posts for pagination', async () => {
				// Set initial posts
				postStore.setFeedPosts([mockPost], true);

				const newPost = { ...mockPost, id: 2 };
				const response = {
					data: {
						success: true,
						data: {
							data: [newPost],
							pagination: {
								page: 2,
								limit: 20,
								total: 2,
								pages: 2
							}
						}
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				await postService.getFeed({ page: 2, limit: 20 });

				const storeState = get(postStore);
				expect(storeState.feedPosts).toHaveLength(2);
				expect(storeState.feedPosts[1].id).toBe(2);
			});

			it('should handle feed error', async () => {
				const error = new Error('Failed to load feed');
				vi.mocked(apiClient.get).mockRejectedValue(error);

				await expect(postService.getFeed()).rejects.toThrow();

				const storeState = get(postStore);
				expect(storeState.feedError).toBeTruthy();
				expect(storeState.feedLoading).toBe(false);
			});
		});

		describe('searchPosts', () => {
			it('should search posts and update store', async () => {
				const posts = [mockPost];
				const response = {
					data: {
						success: true,
						data: {
							data: posts,
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

				const result = await postService.searchPosts({
					query: 'test',
					page: 1,
					limit: 20
				});

				expect(result.success).toBe(true);

				const storeState = get(postStore);
				expect(storeState.searchResults).toHaveLength(1);
				expect(storeState.lastSearchQuery).toBe('test');
			});
		});
	});

	describe('Like Operations', () => {
		describe('likePost', () => {
			it('should optimistically like a post', async () => {
				postStore.setPost(mockPost);

				const response = {
					data: {
						success: true,
						data: {
							liked: true,
							likeCount: 6
						}
					}
				};

				vi.mocked(apiClient.post).mockResolvedValue(response);

				const result = await postService.likePost(1);

				expect(result.success).toBe(true);

				const storeState = get(postStore);
				const post = storeState.posts[1];
				expect(post.isLiked).toBe(true);
				expect(post.likeCount).toBe(6);
			});

			it('should revert optimistic update on error', async () => {
				postStore.setPost({ ...mockPost, isLiked: false, likeCount: 5 });

				const error = new Error('Failed to like post');
				vi.mocked(apiClient.post).mockRejectedValue(error);

				await expect(postService.likePost(1)).rejects.toThrow();

				const storeState = get(postStore);
				const post = storeState.posts[1];
				expect(post.isLiked).toBe(false);
				expect(post.likeCount).toBe(5);
			});
		});

		describe('unlikePost', () => {
			it('should optimistically unlike a post', async () => {
				postStore.setPost({ ...mockPost, isLiked: true, likeCount: 6 });

				const response = {
					data: {
						success: true,
						data: {
							liked: false,
							likeCount: 5
						}
					}
				};

				vi.mocked(apiClient.delete).mockResolvedValue(response);

				const result = await postService.unlikePost(1);

				expect(result.success).toBe(true);

				const storeState = get(postStore);
				const post = storeState.posts[1];
				expect(post.isLiked).toBe(false);
				expect(post.likeCount).toBe(5);
			});

			it('should revert optimistic update on error', async () => {
				postStore.setPost({ ...mockPost, isLiked: true, likeCount: 6 });

				const error = new Error('Failed to unlike post');
				vi.mocked(apiClient.delete).mockRejectedValue(error);

				await expect(postService.unlikePost(1)).rejects.toThrow();

				const storeState = get(postStore);
				const post = storeState.posts[1];
				expect(post.isLiked).toBe(true);
				expect(post.likeCount).toBe(6);
			});
		});

		describe('togglePostLike', () => {
			it('should like when post is not liked', async () => {
				postStore.setPost({ ...mockPost, isLiked: false });

				const response = {
					data: {
						success: true,
						data: { liked: true, likeCount: 6 }
					}
				};

				vi.mocked(apiClient.post).mockResolvedValue(response);

				await postService.togglePostLike(1);

				expect(apiClient.post).toHaveBeenCalledWith('/posts/1/like');
			});

			it('should unlike when post is liked', async () => {
				postStore.setPost({ ...mockPost, isLiked: true });

				const response = {
					data: {
						success: true,
						data: { liked: false, likeCount: 4 }
					}
				};

				vi.mocked(apiClient.delete).mockResolvedValue(response);

				await postService.togglePostLike(1);

				expect(apiClient.delete).toHaveBeenCalledWith('/posts/1/like');
			});
		});
	});

	describe('Draft Operations', () => {
		describe('saveDraft', () => {
			it('should save draft and add to store', async () => {
				const draftPost = { ...mockPost, status: 'DRAFT' as PostStatus };
				const response = {
					data: {
						success: true,
						data: draftPost
					}
				};

				vi.mocked(apiClient.post).mockResolvedValue(response);

				const result = await postService.saveDraft(mockCreatePostData);

				expect(result.success).toBe(true);

				const storeState = get(postStore);
				expect(storeState.drafts).toContainEqual(draftPost);
			});
		});

		describe('publishPost', () => {
			it('should publish draft and move to my posts', async () => {
				const draftPost = { ...mockPost, id: 2, status: 'DRAFT' as PostStatus };
				postStore.addDraft(draftPost);

				const publishedPost = { ...draftPost, status: 'Active' as PostStatus };
				const response = {
					data: {
						success: true,
						data: publishedPost
					}
				};

				vi.mocked(apiClient.post).mockResolvedValue(response);

				const result = await postService.publishPost(2);

				expect(result.success).toBe(true);

				const storeState = get(postStore);
				expect(storeState.drafts).not.toContainEqual(draftPost);
				expect(storeState.myPosts).toContainEqual(publishedPost);
			});
		});
	});

	describe('Utility Functions', () => {
		describe('hasMorePages', () => {
			it('should return true when more pages exist', () => {
				const response = {
					data: [mockPost],
					pagination: {
						page: 1,
						limit: 20,
						total: 50,
						pages: 3
					}
				};

				expect(postService.hasMorePages(response)).toBe(true);
			});

			it('should return false on last page', () => {
				const response = {
					data: [mockPost],
					pagination: {
						page: 3,
						limit: 20,
						total: 50,
						pages: 3
					}
				};

				expect(postService.hasMorePages(response)).toBe(false);
			});
		});

		describe('getNextPage', () => {
			it('should return next page number', () => {
				const response = {
					data: [mockPost],
					pagination: {
						page: 1,
						limit: 20,
						total: 50,
						pages: 3
					}
				};

				expect(postService.getNextPage(response)).toBe(2);
			});

			it('should return null on last page', () => {
				const response = {
					data: [mockPost],
					pagination: {
						page: 3,
						limit: 20,
						total: 50,
						pages: 3
					}
				};

				expect(postService.getNextPage(response)).toBeNull();
			});
		});

		describe('setupInfiniteScroll', () => {
			it('should setup intersection observer', () => {
				const mockElement = document.createElement('div');
				const mockCallback = vi.fn();

				const cleanup = postService.setupInfiniteScroll(mockElement, mockCallback);

				expect(typeof cleanup).toBe('function');

				// Cleanup
				cleanup();
			});
		});

		describe('Cache Management', () => {
			it('should refresh feed', async () => {
				postStore.setFeedPosts([mockPost], true);

				const response = {
					data: {
						success: true,
						data: {
							data: [],
							pagination: {
								page: 1,
								limit: 20,
								total: 0,
								pages: 0
							}
						}
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				await postService.refreshFeed();

				const storeState = get(postStore);
				expect(storeState.feedPage).toBe(1);
			});

			it('should clear post cache', () => {
				postStore.setPost(mockPost);
				postStore.setFeedPosts([mockPost], true);

				postService.clearPostCache();

				const storeState = get(postStore);
				expect(storeState.posts).toEqual({});
				expect(storeState.feedPosts).toEqual([]);
			});

			it('should preload a post', () => {
				const response = {
					data: {
						success: true,
						data: mockPost
					}
				};

				vi.mocked(apiClient.get).mockResolvedValue(response);

				postService.preloadPost(1);

				expect(apiClient.get).toHaveBeenCalledWith('/posts/1');
			});
		});
	});
});
