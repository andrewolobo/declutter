/**
 * Category Controller
 * Handles category management operations
 */
import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../types/category/category.types";

export class CategoryController {
  /**
   * Get all categories
   * GET /api/v1/categories
   */
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.getAllCategories();

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single category by ID
   * GET /api/v1/categories/:id
   */
  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = parseInt(req.params.id);
      const result = await categoryService.getCategoryById(categoryId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new category (admin only)
   * POST /api/v1/categories
   */
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: CreateCategoryDTO = req.body;
      const result = await categoryService.createCategory(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a category (admin only)
   * PUT /api/v1/categories/:id
   */
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = parseInt(req.params.id);
      const dto: UpdateCategoryDTO = req.body;
      const result = await categoryService.updateCategory(categoryId, dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a category (admin only)
   * DELETE /api/v1/categories/:id
   */
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = parseInt(req.params.id);
      const result = await categoryService.deleteCategory(categoryId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
