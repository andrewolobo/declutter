import { Router } from "express";
import { authController } from "../controllers";
import { validate } from "../middleware";
import { authLimiter } from "../middleware/rate-limit.middleware";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  oauthSchema,
} from "../validation/auth.validation";

const router = Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", validate(registerSchema), authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and get tokens
 * @access  Public
 */
router.post("/login", validate(loginSchema), authController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken
);

/**
 * @route   POST /api/v1/auth/oauth/google
 * @desc    Authenticate with Google OAuth
 * @access  Public
 */
router.post("/oauth/google", validate(oauthSchema), authController.oauthGoogle);

/**
 * @route   POST /api/v1/auth/oauth/microsoft
 * @desc    Authenticate with Microsoft OAuth
 * @access  Public
 */
router.post(
  "/oauth/microsoft",
  validate(oauthSchema),
  authController.oauthMicrosoft
);

/**
 * @route   POST /api/v1/auth/oauth/facebook
 * @desc    Authenticate with Facebook OAuth
 * @access  Public
 */
router.post(
  "/oauth/facebook",
  validate(oauthSchema),
  authController.oauthFacebook
);

/**
 * @route   GET /api/v1/auth/check-phone
 * @desc    Check if phone number is available for registration
 * @access  Public
 */
router.get("/check-phone", authController.checkPhoneAvailability);

export default router;
