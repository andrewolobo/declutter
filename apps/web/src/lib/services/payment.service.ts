/**
 * Payment Service (Stub)
 *
 * Handles payment operations for post listing tiers via mobile money.
 * This is a stub implementation designed to work with the Android companion app
 * that monitors mobile money SMS messages for payment confirmation.
 *
 * STATUS: STUB IMPLEMENTATION
 * Core payment flow is implemented, but advanced features like
 * real-time status updates via WebSocket will be added later.
 *
 * @module services/payment
 */

import { apiClient } from './api.client';
import { paymentStore } from '$lib/stores/payment.store';
import { handleApiError } from '$lib/utils/error-handler';
import type { ApiResponse } from '$lib/types/api.types';
import type {
	CreatePaymentDTO,
	PaymentResponseDTO,
	PaymentConfirmationDTO,
	UserPaymentHistoryDTO,
	PricingTierDTO,
	PaymentMethod,
	PaymentStatus
} from '$lib/types/payment.types';

// ============================================================================
// Pricing Tiers
// ============================================================================

/**
 * Get all available pricing tiers
 *
 * @returns Promise resolving to array of pricing tiers
 *
 * @example
 * ```typescript
 * const tiers = await getPricingTiers();
 * console.log(`${tiers.length} tiers available`);
 * ```
 */
export async function getPricingTiers(): Promise<PricingTierDTO[]> {
	try {
		// Check cache first
		const cached = paymentStore.getPricingTiers();
		if (cached.length > 0) {
			return cached;
		}

		const response = await apiClient.get<ApiResponse<PricingTierDTO[]>>('/pricing-tiers');

		if (response.data.success && response.data.data) {
			paymentStore.setPricingTiers(response.data.data);
			return response.data.data;
		}

		return [];
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Get a specific pricing tier by ID
 *
 * @param tierId - The pricing tier ID
 * @returns Promise resolving to pricing tier
 *
 * @example
 * ```typescript
 * const tier = await getPricingTier(1);
 * console.log(`${tier.name}: ${tier.price} UGX for ${tier.durationDays} days`);
 * ```
 */
export async function getPricingTier(tierId: number): Promise<PricingTierDTO> {
	try {
		// Check cache first
		const cached = paymentStore.getPricingTier(tierId);
		if (cached) {
			return cached;
		}

		const response = await apiClient.get<ApiResponse<PricingTierDTO>>(`/pricing-tiers/${tierId}`);

		if (response.data.success && response.data.data) {
			paymentStore.updatePricingTier(response.data.data);
			return response.data.data;
		}

		throw new Error('Pricing tier not found');
	} catch (error) {
		throw handleApiError(error);
	}
}

// ============================================================================
// Payment Creation
// ============================================================================

/**
 * Create a payment for a post listing
 *
 * Initiates payment process. User will receive instructions to send
 * mobile money to the designated phone number. The Android companion app
 * will monitor for payment confirmation SMS.
 *
 * @param data - Payment creation data
 * @returns Promise resolving to payment details
 *
 * @example
 * ```typescript
 * const payment = await createPayment({
 *   postId: 123,
 *   pricingTierId: 1,
 *   paymentMethod: PaymentMethod.MOBILE_MONEY
 * });
 *
 * console.log('Payment ID:', payment.id);
 * console.log('Amount:', payment.amount, 'UGX');
 * console.log('Status:', payment.paymentStatus);
 * ```
 */
export async function createPayment(data: CreatePaymentDTO): Promise<PaymentResponseDTO> {
	try {
		paymentStore.setLoading(true);

		const response = await apiClient.post<ApiResponse<PaymentResponseDTO>>('/payments', data);

		if (response.data.success && response.data.data) {
			const payment = response.data.data;

			// Add to store
			paymentStore.addPayment(payment);

			// Add to pending payments for status polling
			if (payment.paymentStatus === 'Pending') {
				paymentStore.addPendingPayment(payment.id);
			}

			paymentStore.setLoading(false);
			return payment;
		}

		throw new Error('Failed to create payment');
	} catch (error) {
		paymentStore.setLoading(false);
		throw handleApiError(error);
	}
}

// ============================================================================
// Payment Status & Confirmation
// ============================================================================

/**
 * Get payment by ID
 *
 * @param paymentId - The payment ID
 * @param forceRefresh - Force fetch from API
 * @returns Promise resolving to payment details
 *
 * @example
 * ```typescript
 * const payment = await getPayment(456);
 * console.log('Status:', payment.paymentStatus);
 * ```
 */
export async function getPayment(
	paymentId: number,
	forceRefresh = false
): Promise<PaymentResponseDTO> {
	try {
		// Check cache first
		if (!forceRefresh) {
			const cached = paymentStore.getPayment(paymentId);
			if (cached) {
				return cached;
			}
		}

		const response = await apiClient.get<ApiResponse<PaymentResponseDTO>>(`/payments/${paymentId}`);

		if (response.data.success && response.data.data) {
			const payment = response.data.data;
			paymentStore.updatePayment(payment);

			// Remove from pending if status changed
			if (payment.paymentStatus !== 'Pending') {
				paymentStore.removePendingPayment(paymentId);
			}

			return payment;
		}

		throw new Error('Payment not found');
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Check payment status
 *
 * Poll for payment status updates. Useful for checking if the mobile
 * companion app has detected the payment confirmation SMS.
 *
 * @param paymentId - The payment ID
 * @returns Promise resolving to current payment status
 *
 * @example
 * ```typescript
 * const status = await checkPaymentStatus(456);
 * if (status === PaymentStatus.CONFIRMED) {
 *   console.log('Payment confirmed!');
 * }
 * ```
 */
export async function checkPaymentStatus(paymentId: number): Promise<PaymentStatus> {
	try {
		const payment = await getPayment(paymentId, true);
		return payment.paymentStatus;
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Confirm payment (admin/companion app only)
 *
 * Called by the Android companion app when it detects a payment
 * confirmation SMS from the mobile money provider.
 *
 * @param data - Payment confirmation data
 * @returns Promise resolving to updated payment
 *
 * @example
 * ```typescript
 * await confirmPayment({
 *   paymentId: 456,
 *   transactionReference: 'MTN-123456789'
 * });
 * ```
 */
export async function confirmPayment(data: PaymentConfirmationDTO): Promise<PaymentResponseDTO> {
	try {
		const response = await apiClient.post<ApiResponse<PaymentResponseDTO>>(
			`/payments/${data.paymentId}/confirm`,
			data
		);

		if (response.data.success && response.data.data) {
			const payment = response.data.data;
			paymentStore.updatePayment(payment);
			paymentStore.removePendingPayment(payment.id);
			return payment;
		}

		throw new Error('Failed to confirm payment');
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Poll payment status until confirmed or timeout
 *
 * Continuously checks payment status at intervals until confirmation
 * or timeout. Useful for showing real-time payment status updates.
 *
 * @param paymentId - The payment ID
 * @param intervalMs - Polling interval in milliseconds (default: 5000)
 * @param timeoutMs - Timeout in milliseconds (default: 300000 = 5 minutes)
 * @param onStatusChange - Callback for status changes
 * @returns Promise resolving to final payment status
 *
 * @example
 * ```typescript
 * const status = await pollPaymentStatus(456, 5000, 300000, (status) => {
 *   console.log('Status update:', status);
 * });
 * ```
 */
export async function pollPaymentStatus(
	paymentId: number,
	intervalMs = 5000,
	timeoutMs = 300000,
	onStatusChange?: (status: PaymentStatus) => void
): Promise<PaymentStatus> {
	const startTime = Date.now();

	return new Promise((resolve, reject) => {
		const poll = async () => {
			try {
				const status = await checkPaymentStatus(paymentId);

				if (onStatusChange) {
					onStatusChange(status);
				}

				// If confirmed or failed, stop polling
				if (status === 'Confirmed' || status === 'Failed') {
					resolve(status);
					return;
				}

				// Check timeout
				if (Date.now() - startTime > timeoutMs) {
					resolve(status);
					return;
				}

				// Continue polling
				setTimeout(poll, intervalMs);
			} catch (error) {
				reject(error);
			}
		};

		poll();
	});
}

// ============================================================================
// Payment History
// ============================================================================

/**
 * Get current user's payment history
 *
 * @returns Promise resolving to payment history
 *
 * @example
 * ```typescript
 * const history = await getUserPaymentHistory();
 * console.log(`Total spent: ${history.totalSpent} UGX`);
 * console.log(`Total payments: ${history.totalPayments}`);
 * ```
 */
export async function getUserPaymentHistory(): Promise<UserPaymentHistoryDTO> {
	try {
		const response =
			await apiClient.get<ApiResponse<UserPaymentHistoryDTO>>('/payments/user/history');

		if (response.data.success && response.data.data) {
			const history = response.data.data;

			// Update store with payments
			history.payments.forEach((payment) => {
				paymentStore.addPayment(payment);
			});

			return history;
		}

		return {
			payments: [],
			totalSpent: 0,
			totalPayments: 0
		};
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Get payments for a specific post
 *
 * @param postId - The post ID
 * @returns Promise resolving to array of payments
 *
 * @example
 * ```typescript
 * const payments = await getPostPayments(123);
 * console.log(`${payments.length} payments for this post`);
 * ```
 */
export async function getPostPayments(postId: number): Promise<PaymentResponseDTO[]> {
	try {
		const response = await apiClient.get<ApiResponse<PaymentResponseDTO[]>>(
			`/payments/post/${postId}`
		);

		if (response.data.success && response.data.data) {
			const payments = response.data.data;

			// Update store
			payments.forEach((payment) => {
				paymentStore.addPayment(payment);
			});

			return payments;
		}

		return [];
	} catch (error) {
		throw handleApiError(error);
	}
}

// ============================================================================
// Payment Instructions
// ============================================================================

/**
 * Get payment instructions for mobile money
 *
 * Returns instructions for sending payment via mobile money.
 * The actual payment phone number is configured on the backend.
 *
 * @param paymentId - The payment ID
 * @returns Promise resolving to payment instructions
 *
 * @example
 * ```typescript
 * const instructions = await getPaymentInstructions(456);
 * console.log(instructions.phoneNumber); // e.g., "0700123456"
 * console.log(instructions.amount); // e.g., 5000
 * ```
 */
export async function getPaymentInstructions(paymentId: number): Promise<{
	phoneNumber: string;
	amount: number;
	currency: string;
	reference: string;
	provider: string;
	instructions: string;
}> {
	try {
		const response = await apiClient.get<
			ApiResponse<{
				phoneNumber: string;
				amount: number;
				currency: string;
				reference: string;
				provider: string;
				instructions: string;
			}>
		>(`/payments/${paymentId}/instructions`);

		if (response.data.success && response.data.data) {
			return response.data.data;
		}

		throw new Error('Failed to get payment instructions');
	} catch (error) {
		throw handleApiError(error);
	}
}

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Refresh pricing tiers from API
 *
 * @example
 * ```typescript
 * await refreshPricingTiers();
 * ```
 */
export async function refreshPricingTiers(): Promise<void> {
	try {
		const response = await apiClient.get<ApiResponse<PricingTierDTO[]>>('/pricing-tiers');

		if (response.data.success && response.data.data) {
			paymentStore.setPricingTiers(response.data.data);
		}
	} catch (error) {
		throw handleApiError(error);
	}
}

/**
 * Clear payment cache
 *
 * @example
 * ```typescript
 * clearPaymentCache();
 * ```
 */
export function clearPaymentCache(): void {
	paymentStore.clearPayments();
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format currency amount
 *
 * @param amount - Amount in UGX
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * formatCurrency(5000); // "UGX 5,000"
 * ```
 */
export function formatCurrency(amount: number): string {
	return `UGX ${amount.toLocaleString()}`;
}

/**
 * Calculate pricing tier total
 *
 * @param tier - Pricing tier
 * @returns Total price
 */
export function calculateTierTotal(tier: PricingTierDTO): number {
	return tier.price;
}

/**
 * Get pricing tier recommendation
 *
 * @param postValue - Estimated post value
 * @returns Recommended tier
 */
export function getRecommendedTier(
	postValue: number,
	tiers: PricingTierDTO[]
): PricingTierDTO | null {
	if (tiers.length === 0) return null;

	// Recommend tier based on post value
	// Higher value items get longer visibility
	if (postValue >= 1000000) {
		// 1M+ UGX - premium tier
		return tiers[tiers.length - 1];
	} else if (postValue >= 500000) {
		// 500K+ UGX - mid tier
		return tiers[Math.floor(tiers.length / 2)];
	} else {
		// Basic tier
		return tiers[0];
	}
}

/**
 * Check if payment is expired
 *
 * @param payment - Payment object
 * @param expiryMinutes - Expiry time in minutes (default: 30)
 * @returns True if payment is expired
 */
export function isPaymentExpired(payment: PaymentResponseDTO, expiryMinutes = 30): boolean {
	if (payment.paymentStatus !== 'Pending') {
		return false;
	}

	const createdAt = new Date(payment.createdAt);
	const now = new Date();
	const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

	return diffMinutes > expiryMinutes;
}

// ============================================================================
// Export Default Service Object
// ============================================================================

export const paymentService = {
	// Pricing tiers
	getPricingTiers,
	getPricingTier,

	// Payment creation
	createPayment,

	// Payment status
	getPayment,
	checkPaymentStatus,
	confirmPayment,
	pollPaymentStatus,

	// Payment history
	getUserPaymentHistory,
	getPostPayments,

	// Payment instructions
	getPaymentInstructions,

	// Cache
	refreshPricingTiers,
	clearPaymentCache,

	// Utilities
	formatCurrency,
	calculateTierTotal,
	getRecommendedTier,
	isPaymentExpired
};

export default paymentService;
