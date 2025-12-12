/**
 * Payment Controller
 * Handles payment operations and transaction management
 */
import { Request, Response, NextFunction } from "express";
import { paymentService } from "../services";
import {
  CreatePaymentDTO,
  PaymentConfirmationDTO,
} from "../types/payment/payment.types";

export class PaymentController {
  /**
   * Create a new payment
   * POST /api/v1/payments
   */
  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const dto: CreatePaymentDTO = req.body;
      const result = await paymentService.createPayment(userId, dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Confirm a payment (called by mobile app)
   * POST /api/v1/payments/:id/confirm
   */
  async confirmPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentId = parseInt(req.params.id);
      const dto: PaymentConfirmationDTO = {
        paymentId,
        transactionReference: req.body.transactionReference,
      };
      const result = await paymentService.confirmPayment(dto);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment details by ID
   * GET /api/v1/payments/:id
   */
  async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentId = parseInt(req.params.id);
      const result = await paymentService.getPaymentById(paymentId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user's payment history
   * GET /api/v1/payments/me
   */
  async getUserPaymentHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await paymentService.getUserPaymentHistory(userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payments for a specific post
   * GET /api/v1/posts/:postId/payments
   */
  async getPostPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.postId);
      const result = await paymentService.getPostPayments(postId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel a pending payment
   * PUT /api/v1/payments/:id/cancel
   */
  async cancelPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentId = parseInt(req.params.id);
      const userId = req.user!.userId;
      const result = await paymentService.cancelPayment(paymentId, userId);

      if (!result.success) {
        return res.status(result.error!.statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
