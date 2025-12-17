import { faker } from '@faker-js/faker';
import type { ApiResponse, ApiError, PaginatedResponse, ErrorCode } from '$types/api.types';
import type {
	AuthResponse,
	AuthUserDTO,
	AuthTokens,
	RegisterDTO,
	LoginDTO
} from '$types/auth.types';
import type { UserProfileDTO } from '$types/user.types';
import type { PostResponseDTO, CategoryDTO, PostUserDTO, PostImageDTO } from '$types/post.types';
import { PostStatus } from '$types/post.types';
import type { AxiosError } from 'axios';

/**
 * Create a mock user profile
 */
export function createMockUser(overrides: Partial<UserProfileDTO> = {}): UserProfileDTO {
	return {
		id: faker.number.int({ min: 1, max: 10000 }),
		fullName: faker.person.fullName(),
		emailAddress: faker.internet.email(),
		phoneNumber: faker.phone.number('+256#########'),
		profilePictureUrl: faker.image.avatar(),
		location: faker.location.city() + ', Uganda',
		bio: faker.lorem.sentence(),
		isEmailVerified: faker.datatype.boolean(),
		isPhoneVerified: faker.datatype.boolean(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.recent(),
		...overrides
	};
}

/**
 * Create a mock auth user (simpler version for tokens)
 */
export function createMockAuthUser(overrides: Partial<AuthUserDTO> = {}): AuthUserDTO {
	return {
		id: faker.number.int({ min: 1, max: 10000 }),
		fullName: faker.person.fullName(),
		emailAddress: faker.internet.email(),
		profilePictureUrl: faker.image.avatar(),
		isEmailVerified: faker.datatype.boolean(),
		...overrides
	};
}

/**
 * Create mock authentication tokens
 */
export function createMockTokens(overrides: Partial<AuthTokens> = {}): AuthTokens {
	return {
		accessToken: faker.string.alphanumeric(64),
		refreshToken: faker.string.alphanumeric(64),
		...overrides
	};
}

/**
 * Create a mock auth response
 */
export function createMockAuthResponse(overrides: Partial<AuthResponse> = {}): AuthResponse {
	return {
		user: createMockAuthUser(),
		tokens: createMockTokens(),
		...overrides
	};
}

/**
 * Create mock register DTO
 */
export function createMockRegisterDTO(overrides: Partial<RegisterDTO> = {}): RegisterDTO {
	return {
		emailAddress: faker.internet.email(),
		password: faker.internet.password(),
		fullName: faker.person.fullName(),
		phoneNumber: faker.phone.number('+256#########'),
		...overrides
	};
}

/**
 * Create mock login DTO
 */
export function createMockLoginDTO(overrides: Partial<LoginDTO> = {}): LoginDTO {
	return {
		emailAddress: faker.internet.email(),
		password: faker.internet.password(),
		...overrides
	};
}

/**
 * Create a mock category
 */
export function createMockCategory(overrides: Partial<CategoryDTO> = {}): CategoryDTO {
	return {
		id: faker.number.int({ min: 1, max: 100 }),
		name: faker.commerce.department(),
		description: faker.commerce.productDescription(),
		...overrides
	};
}

/**
 * Create a mock post user
 */
export function createMockPostUser(overrides: Partial<PostUserDTO> = {}): PostUserDTO {
	return {
		id: faker.number.int({ min: 1, max: 10000 }),
		fullName: faker.person.fullName(),
		profilePictureUrl: faker.image.avatar(),
		...overrides
	};
}

/**
 * Create a mock post image
 */
export function createMockPostImage(overrides: Partial<PostImageDTO> = {}): PostImageDTO {
	return {
		id: faker.number.int({ min: 1, max: 10000 }),
		imageUrl: faker.image.url(),
		displayOrder: faker.number.int({ min: 0, max: 10 }),
		...overrides
	};
}

/**
 * Create a mock post
 */
export function createMockPost(overrides: Partial<PostResponseDTO> = {}): PostResponseDTO {
	const status: PostStatus = overrides.status || PostStatus.ACTIVE;

	return {
		id: faker.number.int({ min: 1, max: 10000 }),
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		price: faker.number.int({ min: 10000, max: 10000000 }),
		location: faker.location.city() + ', Uganda',
		brand: faker.company.name(),
		deliveryMethod: faker.helpers.arrayElement(['Pickup', 'Delivery', 'Both']),
		contactNumber: faker.phone.number('+256#########'),
		emailAddress: faker.internet.email(),
		status,
		user: createMockPostUser(),
		category: createMockCategory(),
		images: [createMockPostImage({ displayOrder: 0 })],
		likeCount: faker.number.int({ min: 0, max: 1000 }),
		viewCount: faker.number.int({ min: 0, max: 10000 }),
		isLiked: faker.datatype.boolean(),
		scheduledPublishTime: status === PostStatus.SCHEDULED ? faker.date.future() : undefined,
		publishedAt: status === PostStatus.ACTIVE ? faker.date.past() : undefined,
		expiresAt: status === PostStatus.ACTIVE ? faker.date.future() : undefined,
		createdAt: faker.date.past(),
		updatedAt: faker.date.recent(),
		...overrides
	};
}

/**
 * Create a mock API response
 */
export function createMockApiResponse<T>(
	data: T,
	success: boolean = true,
	error?: ApiError
): ApiResponse<T> {
	return {
		success,
		data: success ? data : undefined,
		error: error || (!success ? createMockApiError() : undefined),
		message: success ? 'Success' : 'Error occurred'
	};
}

/**
 * Create a mock paginated response
 */
export function createMockPaginatedResponse<T>(
	items: T[],
	page: number = 1,
	limit: number = 20,
	total?: number
): PaginatedResponse<T> {
	const totalItems = total !== undefined ? total : items.length;
	const pages = Math.ceil(totalItems / limit);

	return {
		success: true,
		data: items,
		pagination: {
			page,
			limit,
			total: totalItems,
			pages
		}
	};
}

/**
 * Create a mock API error
 */
export function createMockApiError(overrides: Partial<ApiError> = {}): ApiError {
	return {
		code: (overrides.code as ErrorCode) || 'INTERNAL_ERROR',
		message: overrides.message || 'An error occurred',
		statusCode: overrides.statusCode || 500,
		timestamp: overrides.timestamp || new Date(),
		details: overrides.details
	};
}

/**
 * Create a mock Axios error
 */
export function createMockAxiosError(
	status: number = 400,
	message: string = 'Bad Request',
	code?: string,
	data?: any
): AxiosError {
	const error: any = new Error(message);
	error.isAxiosError = true;
	error.code = code || `ERR_${status}`;
	error.response = {
		status,
		statusText: message,
		data: data || {
			success: false,
			error: {
				code: code || 'ERROR',
				message,
				statusCode: status
			}
		},
		headers: {},
		config: {
			headers: {} as any
		}
	};
	error.config = {
		headers: {} as any
	};
	error.request = {};
	error.toJSON = () => ({});

	return error as AxiosError;
}

/**
 * Create multiple mock posts
 */
export function createMockPosts(count: number = 5): PostResponseDTO[] {
	return Array.from({ length: count }, () => createMockPost());
}

/**
 * Create multiple mock users
 */
export function createMockUsers(count: number = 5): UserProfileDTO[] {
	return Array.from({ length: count }, () => createMockUser());
}
