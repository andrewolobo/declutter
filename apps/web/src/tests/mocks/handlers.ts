import { http, HttpResponse } from 'msw';
import {
	createMockApiResponse,
	createMockPaginatedResponse,
	createMockAuthResponse,
	createMockUser,
	createMockPost,
	createMockPosts,
	createMockTokens
} from '../mockData/factories';

const API_URL = 'http://localhost:3000/api/v1';

export const handlers = [
	// ============================================================================
	// Authentication Endpoints
	// ============================================================================

	// Register
	http.post(`${API_URL}/auth/register`, async ({ request }) => {
		const body = (await request.json()) as any;
		return HttpResponse.json(
			createMockApiResponse(
				createMockAuthResponse({
					user: {
						id: 1,
						fullName: body.fullName,
						emailAddress: body.emailAddress,
						profilePictureUrl: undefined,
						isEmailVerified: false
					}
				})
			)
		);
	}),

	// Login
	http.post(`${API_URL}/auth/login`, async () => {
		return HttpResponse.json(createMockApiResponse(createMockAuthResponse()));
	}),

	// OAuth
	http.post(`${API_URL}/auth/oauth`, async () => {
		return HttpResponse.json(createMockApiResponse(createMockAuthResponse()));
	}),

	// Refresh token
	http.post(`${API_URL}/auth/refresh`, async () => {
		return HttpResponse.json(createMockApiResponse(createMockTokens()));
	}),

	// Logout
	http.post(`${API_URL}/auth/logout`, async () => {
		return HttpResponse.json(createMockApiResponse(null));
	}),

	// Verify phone
	http.post(`${API_URL}/auth/verify-phone`, async () => {
		return HttpResponse.json(createMockApiResponse(null));
	}),

	// Forgot password
	http.post(`${API_URL}/auth/forgot-password`, async () => {
		return HttpResponse.json(createMockApiResponse(null));
	}),

	// Reset password
	http.post(`${API_URL}/auth/reset-password`, async () => {
		return HttpResponse.json(createMockApiResponse(null));
	}),

	// Resend verification email
	http.post(`${API_URL}/auth/resend-verification`, async () => {
		return HttpResponse.json(createMockApiResponse(null));
	}),

	// Verify email
	http.get(`${API_URL}/auth/verify-email/:token`, async () => {
		return HttpResponse.json(createMockApiResponse(null));
	}),

	// ============================================================================
	// User Endpoints
	// ============================================================================

	// Get profile
	http.get(`${API_URL}/users/profile`, () => {
		return HttpResponse.json(createMockApiResponse(createMockUser()));
	}),

	// Update profile
	http.put(`${API_URL}/users/profile`, async ({ request }) => {
		const body = (await request.json()) as any;
		return HttpResponse.json(createMockApiResponse(createMockUser(body)));
	}),

	// Get user by ID
	http.get(`${API_URL}/users/:userId`, ({ params }) => {
		return HttpResponse.json(createMockApiResponse(createMockUser({ id: Number(params.userId) })));
	}),

	// Change password
	http.post(`${API_URL}/users/change-password`, () => {
		return HttpResponse.json(createMockApiResponse(null));
	}),

	// Delete account
	http.delete(`${API_URL}/users/account`, () => {
		return HttpResponse.json(createMockApiResponse(null));
	}),

	// Get posts summary
	http.get(`${API_URL}/users/posts-summary`, () => {
		return HttpResponse.json(
			createMockApiResponse({
				totalPosts: 45,
				activePosts: 30,
				expiredPosts: 10,
				draftPosts: 5
			})
		);
	}),

	// ============================================================================
	// Post Endpoints
	// ============================================================================

	// Create post
	http.post(`${API_URL}/posts`, async ({ request }) => {
		const body = (await request.json()) as any;
		return HttpResponse.json(createMockApiResponse(createMockPost({ title: body.title })));
	}),

	// Get post
	http.get(`${API_URL}/posts/:postId`, ({ params }) => {
		return HttpResponse.json(createMockApiResponse(createMockPost({ id: Number(params.postId) })));
	}),

	// Update post
	http.put(`${API_URL}/posts/:postId`, async ({ request, params }) => {
		const body = (await request.json()) as any;
		return HttpResponse.json(
			createMockApiResponse(createMockPost({ id: Number(params.postId), ...body }))
		);
	}),

	// Delete post
	http.delete(`${API_URL}/posts/:postId`, () => {
		return HttpResponse.json(createMockApiResponse(null));
	}),

	// Get feed
	http.get(`${API_URL}/posts/feed`, ({ request }) => {
		const url = new URL(request.url);
		const page = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('limit')) || 20;

		return HttpResponse.json(createMockPaginatedResponse(createMockPosts(limit), page, limit, 100));
	}),

	// Search posts
	http.get(`${API_URL}/posts/search`, ({ request }) => {
		const url = new URL(request.url);
		const page = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('limit')) || 20;

		return HttpResponse.json(createMockPaginatedResponse(createMockPosts(limit), page, limit, 50));
	}),

	// Get my posts
	http.get(`${API_URL}/posts/my-posts`, ({ request }) => {
		const url = new URL(request.url);
		const page = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('limit')) || 20;

		return HttpResponse.json(createMockPaginatedResponse(createMockPosts(limit), page, limit, 30));
	}),

	// Like post
	http.post(`${API_URL}/posts/:postId/like`, () => {
		return HttpResponse.json(
			createMockApiResponse({
				liked: true,
				likeCount: 42
			})
		);
	}),

	// Unlike post
	http.delete(`${API_URL}/posts/:postId/like`, () => {
		return HttpResponse.json(
			createMockApiResponse({
				liked: false,
				likeCount: 41
			})
		);
	}),

	// Schedule post
	http.post(`${API_URL}/posts/:postId/schedule`, async ({ params }) => {
		return HttpResponse.json(
			createMockApiResponse(
				createMockPost({
					id: Number(params.postId),
					status: 'Scheduled' as any
				})
			)
		);
	}),

	// Publish post
	http.post(`${API_URL}/posts/:postId/publish`, async ({ params }) => {
		return HttpResponse.json(
			createMockApiResponse(
				createMockPost({
					id: Number(params.postId),
					status: 'Active' as any
				})
			)
		);
	}),

	// ============================================================================
	// Upload Endpoints
	// ============================================================================

	// Upload single image
	http.post(`${API_URL}/upload/image`, () => {
		return HttpResponse.json(
			createMockApiResponse({
				url: 'https://example.com/uploads/image.jpg',
				filename: 'image.jpg',
				size: 102400,
				mimeType: 'image/jpeg'
			})
		);
	}),

	// Upload multiple images
	http.post(`${API_URL}/upload/images`, () => {
		return HttpResponse.json(
			createMockApiResponse([
				{
					url: 'https://example.com/uploads/image1.jpg',
					filename: 'image1.jpg',
					size: 102400,
					mimeType: 'image/jpeg'
				},
				{
					url: 'https://example.com/uploads/image2.jpg',
					filename: 'image2.jpg',
					size: 98304,
					mimeType: 'image/jpeg'
				}
			])
		);
	})
];
