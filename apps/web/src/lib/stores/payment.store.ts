/**
 * Payment Store (Stub)
 *
 * Manages payment state, pricing tiers, and pending payment tracking.
 *
 * STATUS: STUB IMPLEMENTATION
 * Basic state management is implemented. Advanced features like
 * real-time WebSocket updates will be added later.
 *
 * @module stores/payment
 */

import { writable, derived, type Readable } from 'svelte/store';
import type { PaymentResponseDTO, PricingTierDTO, PaymentStatus } from '$lib/types/payment.types';

// ============================================================================
// Types
// ============================================================================

export interface PaymentStoreState {
	payments: Map<number, PaymentResponseDTO>;
	pricingTiers: Map<number, PricingTierDTO>;
	pendingPayments: Set<number>;
	loading: boolean;
	error: string | null;
}

// ============================================================================
// Store Creation
// ============================================================================

/**
 * Create payment store with state management
 */
function createPaymentStore() {
	const initialState: PaymentStoreState = {
		payments: new Map(),
		pricingTiers: new Map(),
		pendingPayments: new Set(),
		loading: false,
		error: null
	};

	const { subscribe, set, update } = writable<PaymentStoreState>(initialState);

	return {
		subscribe,

		/**
		 * Set loading state
		 */
		setLoading(loading: boolean): void {
			update((state) => ({ ...state, loading }));
		},

		/**
		 * Set error state
		 */
		setError(error: string | null): void {
			update((state) => ({ ...state, error, loading: false }));
		},

		/**
		 * Set pricing tiers
		 */
		setPricingTiers(tiers: PricingTierDTO[]): void {
			update((state) => {
				const newTiers = new Map<number, PricingTierDTO>();
				tiers.forEach((tier) => {
					newTiers.set(tier.id, tier);
				});

				return {
					...state,
					pricingTiers: newTiers
				};
			});
		},

		/**
		 * Update a single pricing tier
		 */
		updatePricingTier(tier: PricingTierDTO): void {
			update((state) => {
				const newTiers = new Map(state.pricingTiers);
				newTiers.set(tier.id, tier);

				return {
					...state,
					pricingTiers: newTiers
				};
			});
		},

		/**
		 * Add a payment
		 */
		addPayment(payment: PaymentResponseDTO): void {
			update((state) => {
				const newPayments = new Map(state.payments);
				newPayments.set(payment.id, payment);

				return {
					...state,
					payments: newPayments
				};
			});
		},

		/**
		 * Update a payment
		 */
		updatePayment(payment: PaymentResponseDTO): void {
			update((state) => {
				const existing = state.payments.get(payment.id);
				if (!existing) {
					const newPayments = new Map(state.payments);
					newPayments.set(payment.id, payment);
					return { ...state, payments: newPayments };
				}

				const newPayments = new Map(state.payments);
				newPayments.set(payment.id, {
					...existing,
					...payment
				});

				return {
					...state,
					payments: newPayments
				};
			});
		},

		/**
		 * Add to pending payments
		 */
		addPendingPayment(paymentId: number): void {
			update((state) => {
				const newPending = new Set(state.pendingPayments);
				newPending.add(paymentId);

				return {
					...state,
					pendingPayments: newPending
				};
			});
		},

		/**
		 * Remove from pending payments
		 */
		removePendingPayment(paymentId: number): void {
			update((state) => {
				const newPending = new Set(state.pendingPayments);
				newPending.delete(paymentId);

				return {
					...state,
					pendingPayments: newPending
				};
			});
		},

		/**
		 * Clear all payments
		 */
		clearPayments(): void {
			update((state) => ({
				...state,
				payments: new Map(),
				pendingPayments: new Set()
			}));
		},

		/**
		 * Clear pricing tiers
		 */
		clearPricingTiers(): void {
			update((state) => ({
				...state,
				pricingTiers: new Map()
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
		 * Get a payment by ID
		 */
		getPayment(paymentId: number): PaymentResponseDTO | null {
			let payment: PaymentResponseDTO | null = null;
			subscribe((state) => {
				payment = state.payments.get(paymentId) ?? null;
			})();
			return payment;
		},

		/**
		 * Get all payments as array
		 */
		getAllPayments(): PaymentResponseDTO[] {
			let payments: PaymentResponseDTO[] = [];
			subscribe((state) => {
				payments = Array.from(state.payments.values());
			})();
			return payments;
		},

		/**
		 * Get a pricing tier by ID
		 */
		getPricingTier(tierId: number): PricingTierDTO | null {
			let tier: PricingTierDTO | null = null;
			subscribe((state) => {
				tier = state.pricingTiers.get(tierId) ?? null;
			})();
			return tier;
		},

		/**
		 * Get all pricing tiers as array
		 */
		getPricingTiers(): PricingTierDTO[] {
			let tiers: PricingTierDTO[] = [];
			subscribe((state) => {
				tiers = Array.from(state.pricingTiers.values());
			})();
			return tiers;
		},

		/**
		 * Check if payment is pending
		 */
		isPaymentPending(paymentId: number): boolean {
			let isPending = false;
			subscribe((state) => {
				isPending = state.pendingPayments.has(paymentId);
			})();
			return isPending;
		},

		/**
		 * Get pending payment IDs
		 */
		getPendingPaymentIds(): number[] {
			let pending: number[] = [];
			subscribe((state) => {
				pending = Array.from(state.pendingPayments);
			})();
			return pending;
		}
	};
}

// ============================================================================
// Store Instance
// ============================================================================

export const paymentStore = createPaymentStore();

// ============================================================================
// Derived Stores
// ============================================================================

/**
 * All payments as an array
 */
export const payments: Readable<PaymentResponseDTO[]> = derived(paymentStore, ($store) =>
	Array.from($store.payments.values())
);

/**
 * Pending payments
 */
export const pendingPayments: Readable<PaymentResponseDTO[]> = derived(payments, ($payments) =>
	$payments.filter((p) => p.paymentStatus === 'Pending')
);

/**
 * Confirmed payments
 */
export const confirmedPayments: Readable<PaymentResponseDTO[]> = derived(payments, ($payments) =>
	$payments.filter((p) => p.paymentStatus === 'Confirmed')
);

/**
 * Failed payments
 */
export const failedPayments: Readable<PaymentResponseDTO[]> = derived(payments, ($payments) =>
	$payments.filter((p) => p.paymentStatus === 'Failed')
);

/**
 * All pricing tiers as an array
 */
export const pricingTiers: Readable<PricingTierDTO[]> = derived(paymentStore, ($store) =>
	Array.from($store.pricingTiers.values())
);

/**
 * Pricing tiers sorted by price (ascending)
 */
export const pricingTiersByPrice: Readable<PricingTierDTO[]> = derived(pricingTiers, ($tiers) =>
	[...$tiers].sort((a, b) => a.price - b.price)
);

/**
 * Pricing tiers sorted by duration (ascending)
 */
export const pricingTiersByDuration: Readable<PricingTierDTO[]> = derived(pricingTiers, ($tiers) =>
	[...$tiers].sort((a, b) => a.durationDays - b.durationDays)
);

/**
 * Loading state
 */
export const paymentsLoading: Readable<boolean> = derived(paymentStore, ($store) => $store.loading);

/**
 * Error state
 */
export const paymentsError: Readable<string | null> = derived(
	paymentStore,
	($store) => $store.error
);

/**
 * Number of pending payments
 */
export const pendingPaymentCount: Readable<number> = derived(
	paymentStore,
	($store) => $store.pendingPayments.size
);

/**
 * Has pending payments
 */
export const hasPendingPayments: Readable<boolean> = derived(
	pendingPaymentCount,
	($count) => $count > 0
);

/**
 * Total amount spent (confirmed payments)
 */
export const totalSpent: Readable<number> = derived(confirmedPayments, ($confirmed) =>
	$confirmed.reduce((sum, p) => sum + p.amount, 0)
);

/**
 * Payment statistics
 */
export const paymentStats: Readable<{
	total: number;
	pending: number;
	confirmed: number;
	failed: number;
	totalAmount: number;
}> = derived(
	[payments, pendingPayments, confirmedPayments, failedPayments, totalSpent],
	([$payments, $pending, $confirmed, $failed, $totalSpent]) => ({
		total: $payments.length,
		pending: $pending.length,
		confirmed: $confirmed.length,
		failed: $failed.length,
		totalAmount: $totalSpent
	})
);

/**
 * Cheapest pricing tier
 */
export const cheapestTier: Readable<PricingTierDTO | null> = derived(
	pricingTiersByPrice,
	($tiers) => $tiers[0] ?? null
);

/**
 * Most expensive pricing tier
 */
export const premiumTier: Readable<PricingTierDTO | null> = derived(
	pricingTiersByPrice,
	($tiers) => $tiers[$tiers.length - 1] ?? null
);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get payment by ID (convenience function)
 */
export function getPayment(paymentId: number): PaymentResponseDTO | null {
	return paymentStore.getPayment(paymentId);
}

/**
 * Get pricing tier by ID (convenience function)
 */
export function getPricingTier(tierId: number): PricingTierDTO | null {
	return paymentStore.getPricingTier(tierId);
}

/**
 * Check if payment exists
 */
export function hasPayment(paymentId: number): boolean {
	return paymentStore.getPayment(paymentId) !== null;
}

/**
 * Get payment status by ID
 */
export function getPaymentStatus(paymentId: number): PaymentStatus | null {
	const payment = paymentStore.getPayment(paymentId);
	return payment?.paymentStatus ?? null;
}

/**
 * Get payments by post ID (local filter)
 */
export function getPaymentsByPostId(postId: number): PaymentResponseDTO[] {
	const allPayments = paymentStore.getAllPayments();
	return allPayments.filter((p) => p.postId === postId);
}

/**
 * Get confirmed payment for post
 */
export function getConfirmedPaymentForPost(postId: number): PaymentResponseDTO | null {
	const postPayments = getPaymentsByPostId(postId);
	return postPayments.find((p) => p.paymentStatus === 'Confirmed') ?? null;
}

/**
 * Check if post has confirmed payment
 */
export function hasConfirmedPayment(postId: number): boolean {
	return getConfirmedPaymentForPost(postId) !== null;
}

// ============================================================================
// Export Types
// ============================================================================

export type { PaymentStoreState };
