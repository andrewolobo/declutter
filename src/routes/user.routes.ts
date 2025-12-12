import { Router } from "express";
import { userController } from "../controllers";
import { authenticate, validate, validateParams } from "../middleware";
import {
  createLimiter,
  readLimiter,
} from "../middleware/rate-limit.middleware";
import {
  updateProfileSchema,
  changePasswordSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "../validation/user.validation";

const router = Router();

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/profile", authenticate, readLimiter, userController.getProfile);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put(
  "/profile",
  authenticate,
  createLimiter,
  validate(updateProfileSchema),
  userController.updateProfile
);

/**
 * @route   POST /api/v1/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  "/change-password",
  authenticate,
  createLimiter,
  validate(changePasswordSchema),
  userController.changePassword
);

/**
 * @route   DELETE /api/v1/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete(
  "/account",
  authenticate,
  createLimiter,
  userController.deleteAccount
);

/**
 * @route   GET /api/v1/users/posts-summary
 * @desc    Get user's posts summary (counts by status)
 * @access  Private
 */
router.get(
  "/posts-summary",
  authenticate,
  readLimiter,
  userController.getPostsSummary
);

/**
 * @route   POST /api/v1/users/request-password-reset
 * @desc    Request password reset email
 * @access  Public
 */
router.post(
  "/request-password-reset",
  createLimiter,
  validate(resetPasswordRequestSchema),
  userController.requestPasswordReset
);

/**
 * @route   POST /api/v1/users/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  "/reset-password",
  createLimiter,
  validate(resetPasswordSchema),
  userController.resetPassword
);

/**
 * @route   POST /api/v1/users/verify-email
 * @desc    Verify email address with token
 * @access  Public
 */
router.post("/verify-email", createLimiter, userController.verifyEmail);

/**
 * @route   POST /api/v1/users/verify-phone
 * @desc    Verify phone number with code
 * @access  Private
 */
router.post(
  "/verify-phone",
  authenticate,
  createLimiter,
  userController.verifyPhone
);

export default router;
