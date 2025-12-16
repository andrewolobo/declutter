/**
 * User Controller
 * Handles user profile management and account operations
 */
import { Request, Response, NextFunction } from "express";
import { userService } from "../services";
import {
  UpdateProfileDTO,
  ChangePasswordDTO,
  ResetPasswordRequestDTO,
  ResetPasswordDTO,
} from "../types/user/user.types";

export class UserController {
  /**
   * Get current user profile
   * GET /api/v1/users/me
   */
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await userService.getProfile(userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * PUT /api/v1/users/me
   */
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const dto: UpdateProfileDTO = req.body;
      const result = await userService.updateProfile(userId, dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user password
   * PUT /api/v1/users/me/password
   */
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const dto: ChangePasswordDTO = req.body;
      const result = await userService.changePassword(userId, dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user account
   * DELETE /api/v1/users/me
   */
  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await userService.deleteAccount(userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's posts summary
   * GET /api/v1/users/me/posts/summary
   */
  async getPostsSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await userService.getPostsSummary(userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset
   * POST /api/v1/users/password/reset-request
   */
  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: ResetPasswordRequestDTO = req.body;
      const result = await userService.requestPasswordReset(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password with token
   * POST /api/v1/users/password/reset
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: ResetPasswordDTO = req.body;
      const result = await userService.resetPassword(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify email address
   * POST /api/v1/users/me/verify-email
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await userService.verifyEmail(userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify phone number
   * POST /api/v1/users/me/verify-phone
   */
  async verifyPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await userService.verifyPhone(userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
