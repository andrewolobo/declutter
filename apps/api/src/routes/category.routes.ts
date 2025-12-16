import { Router } from "express";
import { categoryController } from "../controllers";
import {
  authenticate,
  requireAdmin,
  validate,
  validateParams,
} from "../middleware";
import {
  createLimiter,
  readLimiter,
} from "../middleware/rate-limit.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "../validation/category.validation";

const router = Router();

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories with hierarchy
 * @access  Public
 */
router.get("/", readLimiter, categoryController.getAllCategories);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by ID with children
 * @access  Public
 */
router.get(
  "/:id",
  readLimiter,
  validateParams(categoryIdSchema),
  categoryController.getCategoryById
);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authenticate,
  requireAdmin,
  createLimiter,
  validate(createCategorySchema),
  categoryController.createCategory
);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a category
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  createLimiter,
  validateParams(categoryIdSchema),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category
 * @access  Private (Admin only)
 */
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  createLimiter,
  validateParams(categoryIdSchema),
  categoryController.deleteCategory
);

export default router;
