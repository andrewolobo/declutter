/**
 * Post Controller
 * Handles post creation, retrieval, updates, and interactions
 */
import { Request, Response, NextFunction } from "express";
import { postService } from "../services";
import {
  CreatePostDTO,
  UpdatePostDTO,
  SchedulePostDTO,
  FeedOptionsDTO,
  SearchOptionsDTO,
} from "../types/post/post.types";

export class PostController {
  /**
   * Create a new post
   * POST /api/v1/posts
   */
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const dto: CreatePostDTO = req.body;
      const result = await postService.createPost(userId, dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single post by ID
   * GET /api/v1/posts/:id
   */
  async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.id);
      const viewerId = req.user?.userId; // Optional authentication
      const result = await postService.getPost(postId, viewerId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a post
   * PUT /api/v1/posts/:id
   */
  async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const dto: UpdatePostDTO = req.body;
      const result = await postService.updatePost(postId, userId, dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a post
   * DELETE /api/v1/posts/:id
   */
  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const result = await postService.deletePost(postId, userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get post feed (paginated)
   * GET /api/v1/posts
   */
  async getFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const options: FeedOptionsDTO = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        categoryId: req.query.categoryId
          ? parseInt(req.query.categoryId as string)
          : undefined,
        userId: req.query.userId
          ? parseInt(req.query.userId as string)
          : undefined,
      };
      const result = await postService.getFeed(options);

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search posts
   * GET /api/v1/posts/search
   */
  async searchPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const options: SearchOptionsDTO = {
        query: req.query.query as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        categoryId: req.query.categoryId
          ? parseInt(req.query.categoryId as string)
          : undefined,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
        location: req.query.location as string | undefined,
      };
      const result = await postService.searchPosts(options);

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle like on a post
   * POST /api/v1/posts/:id/like
   */
  async toggleLike(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const result = await postService.toggleLike(postId, userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Schedule a post for future publication
   * POST /api/v1/posts/:id/schedule
   */
  async schedulePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const dto: SchedulePostDTO = {
        scheduledTime: new Date(req.body.scheduledTime),
      };
      const result = await postService.schedulePost(postId, userId, dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish a draft or scheduled post
   * POST /api/v1/posts/:id/publish
   */
  async publishPost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const result = await postService.publishPost(postId, userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get posts by a specific user
   * GET /api/v1/users/:userId/posts
   */
  async getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId);
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const result = await postService.getUserPosts(userId, page, limit);

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
