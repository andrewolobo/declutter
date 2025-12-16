import { Router } from "express";
import { paymentController } from "../controllers";
import { authenticate, validate, validateParams } from "../middleware";
import {
  createLimiter,
  readLimiter,
} from "../middleware/rate-limit.middleware";
import {
  createPaymentSchema,
  confirmPaymentSchema,
  paymentIdSchema,
  postIdSchema,
} from "../validation/payment.validation";

const router = Router();

/**
 * @route   POST /api/v1/payments
 * @desc    Create a new payment intent
 * @access  Private
 */
router.post(
  "/",
  authenticate,
  createLimiter,
  validate(createPaymentSchema),
  paymentController.createPayment
);

/**
 * @route   POST /api/v1/payments/:id/confirm
 * @desc    Confirm payment and process transaction
 * @access  Private
 */
router.post(
  "/:id/confirm",
  authenticate,
  createLimiter,
  validateParams(paymentIdSchema),
  validate(confirmPaymentSchema),
  paymentController.confirmPayment
);

/**
 * @route   POST /api/v1/payments/:id/cancel
 * @desc    Cancel a pending payment
 * @access  Private
 */
router.post(
  "/:id/cancel",
  authenticate,
  createLimiter,
  validateParams(paymentIdSchema),
  paymentController.cancelPayment
);

/**
 * @route   GET /api/v1/payments/:id
 * @desc    Get payment details by ID
 * @access  Private (owner only)
 */
router.get(
  "/:id",
  authenticate,
  readLimiter,
  validateParams(paymentIdSchema),
  paymentController.getPaymentById
);

/**
 * @route   GET /api/v1/payments/user/history
 * @desc    Get current user's payment history
 * @access  Private
 */
router.get(
  "/user/history",
  authenticate,
  readLimiter,
  paymentController.getUserPaymentHistory
);

/**
 * @route   GET /api/v1/payments/post/:postId
 * @desc    Get payments for a specific post
 * @access  Private (post owner only)
 */
router.get(
  "/post/:postId",
  authenticate,
  readLimiter,
  validateParams(postIdSchema),
  paymentController.getPostPayments
);

export default router;
