import type { Request, RequestHandler, Response } from "express";

import { paymentService } from "@/api/payment/paymentService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class PaymentController {

  public createPayment: RequestHandler = async (req: Request, res: Response) => {
    const amount = Number.parseInt(req.params.amount as string, 10);
    const serviceResponse = await paymentService.createPayment(amount);
    return handleServiceResponse(serviceResponse, res);
  };

    public getPaymentStatus: RequestHandler = async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId as string;
    const serviceResponse = await paymentService.getPaymentStatus(paymentId);
    return handleServiceResponse(serviceResponse, res);
  };

}

export const paymentController = new PaymentController();
