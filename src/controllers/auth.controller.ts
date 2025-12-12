/**
 * Authentication Controller
 * Handles user authentication, registration, and token management
 */
import { Request, Response, NextFunction } from "express";
import { authService } from "../services";
import {
  RegisterDTO,
  LoginDTO,
  OAuthLoginDTO,
  RefreshTokenDTO,
} from "../types/auth/auth.types";

export class AuthController {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: RegisterDTO = req.body;
      const result = await authService.register(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login with email and password
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: LoginDTO = req.body;
      const result = await authService.login(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * OAuth login with Google
   * POST /api/v1/auth/oauth/google
   */
  async oauthGoogle(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: OAuthLoginDTO = {
        provider: "Google",
        accessToken: req.body.accessToken,
      };
      const result = await authService.oauthLogin(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * OAuth login with Microsoft
   * POST /api/v1/auth/oauth/microsoft
   */
  async oauthMicrosoft(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: OAuthLoginDTO = {
        provider: "Microsoft",
        accessToken: req.body.accessToken,
      };
      const result = await authService.oauthLogin(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * OAuth login with Facebook
   * POST /api/v1/auth/oauth/facebook
   */
  async oauthFacebook(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: OAuthLoginDTO = {
        provider: "Facebook",
        accessToken: req.body.accessToken,
      };
      const result = await authService.oauthLogin(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token using refresh token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: RefreshTokenDTO = req.body;
      const result = await authService.refreshToken(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
