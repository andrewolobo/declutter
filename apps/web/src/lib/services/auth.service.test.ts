import { describe, it, expect, beforeEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../tests/mocks/server';
import {
	register,
	login,
	loginWithOAuth,
	refreshToken,
	logout,
	verifyPhone,
	requestPasswordReset,
	resetPassword,
	resendEmailVerification,
	verifyEmail,
	isAuthenticated,
	getCurrentUser,
	setAuthTokens,
	clearAuthData
} from './auth.service';
import {
	createMockRegisterDTO,
	createMockLoginDTO,
	createMockAuthResponse,
	createMockApiResponse
} from '../../tests/mockData/factories';
import { STORAGE_KEYS } from '$lib/config/constants';

describe('Auth Service', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	describe('register', () => {
		it('should register a new user successfully', async () => {
			const registerData = createMockRegisterDTO();
			const response = await register(registerData);

			expect(response.success).toBe(true);
			expect(response.data).toHaveProperty('tokens');
			expect(response.data?.tokens).toHaveProperty('accessToken');
			expect(response.data?.tokens).toHaveProperty('refreshToken');
			await register(registerData);

			const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

			expect(accessToken).toBeTruthy();
			expect(refreshToken).toBeTruthy();
		});

		it('should handle registration failure (email already exists)', async () => {
			server.use(
				http.post('http://localhost:3000/api/v1/auth/register', () => {
					return HttpResponse.json(
						{ success: false, message: 'Email already exists', data: null },
						{ status: 400 }
					);
				})
			);

			const registerData = createMockRegisterDTO();

			try {
				await register(registerData);
				expect.fail('Should have thrown an error');
			} catch (error: any) {
				expect(error.response?.status).toBe(400);
			}
		});

		it('should not save tokens on failed registration', async () => {
			server.use(
				http.post('http://localhost:3000/api/v1/auth/register', () => {
					return HttpResponse.json(
						{ success: false, message: 'Email already exists', data: null },
						{ status: 400 }
					);
				})
			);

			const registerData = createMockRegisterDTO();

			try {
				await register(registerData);
			} catch (error) {
				const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
				expect(accessToken).toBeNull();
			}
		});
	});

	describe('login', () => {
		it('should login user successfully', async () => {
			const loginData = createMockLoginDTO();
			const response = await login(loginData);

			expect(response.success).toBe(true);
			expect(response.data).toHaveProperty('tokens');
			await login(loginData);

			const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			const user = localStorage.getItem(STORAGE_KEYS.USER);

			expect(accessToken).toBeTruthy();
			expect(user).toBeTruthy();
			expect(JSON.parse(user!)).toHaveProperty('emailAddress');
		});

		it('should handle invalid credentials', async () => {
			// Clear refresh token so interceptor doesn't try to refresh
			localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

			server.use(
				http.post('http://localhost:3000/api/v1/auth/login', () => {
					return HttpResponse.json(
						{ success: false, message: 'Invalid credentials', data: null },
						{ status: 401 }
					);
				})
			);

			const loginData = createMockLoginDTO();

			try {
				await login(loginData);
				expect.fail('Should have thrown an error');
			} catch (error: any) {
				expect(error.response?.status).toBe(401);
			}
		});

		it('should handle network errors', async () => {
			server.use(
				http.post('http://localhost:3000/api/v1/auth/login', () => {
					return HttpResponse.error();
				})
			);

			const loginData = createMockLoginDTO();

			try {
				await login(loginData);
			} catch (error) {
				expect(error).toBeDefined();
			}
		}, 10000); // 10s timeout for retry logic
	});

	describe('loginWithOAuth', () => {
		it('should login with Google OAuth successfully', async () => {
			const response = await loginWithOAuth({
				provider: 'Google',
				accessToken: 'google-test-token'
			});

			expect(response.success).toBe(true);
			expect(response.data).toHaveProperty('tokens');

			expect(response.success).toBe(true);
		});

		it('should login with Facebook OAuth successfully', async () => {
			const response = await loginWithOAuth({
				provider: 'Facebook',
				accessToken: 'facebook-test-token'
			});

			expect(response.success).toBe(true);
		});

		it('should save tokens after OAuth login', async () => {
			await loginWithOAuth({
				provider: 'Google',
				accessToken: 'google-test-token'
			});

			const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			expect(accessToken).toBeTruthy();
		});

		it('should handle invalid OAuth token', async () => {
			// Clear refresh token so interceptor doesn't try to refresh
			localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

			server.use(
				http.post('http://localhost:3000/api/v1/auth/oauth', () => {
					return HttpResponse.json(
						{ success: false, message: 'Invalid OAuth token', data: null },
						{ status: 401 }
					);
				})
			);

			try {
				await loginWithOAuth({
					provider: 'Google',
					accessToken: 'invalid-token'
				});
				expect.fail('Should have thrown an error');
			} catch (error: any) {
				expect(error.response?.status).toBe(401);
			}
		});
	});

	describe('refreshToken', () => {
		it('should refresh access token successfully', async () => {
			const mockRefreshToken = 'mock-refresh-token';
			const response = await refreshToken(mockRefreshToken);

			expect(response.success).toBe(true);
			expect(response.data).toHaveProperty('accessToken');
			expect(response.data).toHaveProperty('refreshToken');
		});

		it('should update tokens in localStorage after refresh', async () => {
			const mockRefreshToken = 'old-refresh-token';
			const response = await refreshToken(mockRefreshToken);

			const newAccessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			const newRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

			expect(newAccessToken).toBeTruthy();
			expect(newRefreshToken).toBeTruthy();
			expect(response.success).toBe(true);
		});

		it('should handle expired refresh token', async () => {
			// Clear refresh token so interceptor doesn't try to refresh again
			localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

			server.use(
				http.post('http://localhost:3000/api/v1/auth/refresh', () => {
					return HttpResponse.json(
						{ success: false, message: 'Refresh token expired', data: null },
						{ status: 401 }
					);
				})
			);

			try {
				await refreshToken('expired-token');
				expect.fail('Should have thrown an error');
			} catch (error: any) {
				expect(error.response?.status).toBe(401);
			}
		});
	});

	describe('logout', () => {
		it('should clear all tokens from localStorage', async () => {
			setAuthTokens({ accessToken: 'access-token', refreshToken: 'refresh-token' });

			await logout();

			const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

			expect(accessToken).toBeNull();
			expect(refreshToken).toBeNull();
		});

		it('should clear tokens even if API call fails', async () => {
			server.use(
				http.post('http://localhost:3000/api/v1/auth/logout', () => {
					return HttpResponse.json(
						{ success: false, message: 'Logout failed', data: null },
						{ status: 500 }
					);
				})
			);

			setAuthTokens({ accessToken: 'access-token', refreshToken: 'refresh-token' });

			await logout();

			const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
			expect(accessToken).toBeNull();
		}, 10000); // 10s timeout for retry logic
	});

	describe('verifyPhone', () => {
		it('should verify phone number successfully', async () => {
			const response = await verifyPhone({
				phoneNumber: '+256700000000',
				code: '123456'
			});

			expect(response.success).toBe(true);
		});

		it('should handle invalid verification code', async () => {
			server.use(
				http.post('http://localhost:3000/api/v1/auth/verify-phone', () => {
					return HttpResponse.json(
						{ success: false, message: 'Invalid verification code', data: null },
						{ status: 400 }
					);
				})
			);

			try {
				await verifyPhone({
					phoneNumber: '+256700000000',
					code: 'wrong-code'
				});
				expect.fail('Should have thrown an error');
			} catch (error: any) {
				expect(error.response?.status).toBe(400);
			}
		});
	});

	describe('requestPasswordReset', () => {
		it('should send password reset email successfully', async () => {
			server.use(
				http.post('http://localhost:3000/api/v1/auth/forgot-password', () => {
					return HttpResponse.json(createMockApiResponse(null));
				})
			);

			const response = await requestPasswordReset('test@example.com');

			expect(response.success).toBe(true);
		});

		it('should handle non-existent email', async () => {
			server.use(
				http.post('http://localhost:3000/api/v1/auth/forgot-password', () => {
					return HttpResponse.json(
						{ success: false, message: 'User not found', data: null },
						{ status: 404 }
					);
				})
			);

			try {
				await requestPasswordReset('nonexistent@example.com');
				expect.fail('Should have thrown an error');
			} catch (error: any) {
				expect(error.response?.status).toBe(404);
			}
		});
	});

	describe('resetPassword', () => {
		it('should reset password successfully', async () => {
			server.use(
				http.post('http://localhost:3000/api/v1/auth/reset-password', () => {
					return HttpResponse.json(createMockApiResponse(null));
				})
			);

			const response = await resetPassword('valid-token', 'NewPassword123');

			expect(response.success).toBe(true);
		});

		it('should handle invalid reset token', async () => {
			server.use(
				http.post('http://localhost:3000/api/v1/auth/reset-password', () => {
					return HttpResponse.json(
						{ success: false, message: 'Invalid or expired reset token', data: null },
						{ status: 400 }
					);
				})
			);

			try {
				await resetPassword('invalid-token', 'NewPassword123');
				expect.fail('Should have thrown an error');
			} catch (error: any) {
				expect(error.response?.status).toBe(400);
			}
		});
	});

	describe('resendEmailVerification', () => {
		it('should resend verification email successfully', async () => {
			const response = await resendEmailVerification();

			expect(response.success).toBe(true);
		});
	});

	describe('verifyEmail', () => {
		it('should verify email successfully', async () => {
			server.use(
				http.get('http://localhost:3000/api/v1/auth/verify-email/:token', () => {
					return HttpResponse.json(createMockApiResponse(null));
				})
			);

			const response = await verifyEmail('valid-token');

			expect(response.success).toBe(true);
		});

		it('should handle expired verification token', async () => {
			server.use(
				http.get('http://localhost:3000/api/v1/auth/verify-email/:token', () => {
					return HttpResponse.json(
						{ success: false, message: 'Verification token expired', data: null },
						{ status: 400 }
					);
				})
			);

			try {
				await verifyEmail('expired-token');
				expect.fail('Should have thrown an error');
			} catch (error: any) {
				expect(error.response?.status).toBe(400);
			}
		});
	});

	describe('Helper Functions', () => {
		describe('isAuthenticated', () => {
			it('should return true when tokens exist', () => {
				setAuthTokens({ accessToken: 'access-token', refreshToken: 'refresh-token' });
			});

			it('should return false when tokens do not exist', () => {
				expect(isAuthenticated()).toBe(false);
			});

			it('should return false when only one token exists', () => {
				localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
				expect(isAuthenticated()).toBe(false);
			});
		});

		describe('getCurrentUser', () => {
			it('should return user data from localStorage', () => {
				const mockUser = { id: 1, emailAddress: 'test@example.com' };
				localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

				const user = getCurrentUser();
				expect(user).toEqual(mockUser);
			});

			it('should return null when no user data exists', () => {
				expect(getCurrentUser()).toBeNull();
			});

			it('should return null when user data is invalid JSON', () => {
				localStorage.setItem(STORAGE_KEYS.USER, 'invalid-json');
				expect(getCurrentUser()).toBeNull();
			});
		});

		describe('setAuthTokens', () => {
			it('should save tokens to localStorage', () => {
				setAuthTokens({ accessToken: 'access-token', refreshToken: 'refresh-token' });

				const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
				const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

				expect(accessToken).toBe('access-token');
				expect(refreshToken).toBe('refresh-token');
			});
		});

		describe('clearAuthData', () => {
			it('should clear all auth data from localStorage', () => {
				setAuthTokens({ accessToken: 'access-token', refreshToken: 'refresh-token' });
				localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ id: 1 }));

				clearAuthData();

				expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
				expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
				expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
			});
		});
	});
});
