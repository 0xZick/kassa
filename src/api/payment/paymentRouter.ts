import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetPaymentStatusSchema, GetUserSchema, PaymentSchema } from "@/api/payment/paymentModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { paymentController } from "./paymentController";

export const paymentRegistry = new OpenAPIRegistry();
export const paymentRouter: Router = express.Router();


paymentRegistry.register("Payment", PaymentSchema);

//create payment
paymentRegistry.registerPath({
  method: "get",
  path: "/payment/{amount}",
  tags: ["Payment"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(PaymentSchema, "Success"),
});

paymentRouter.get("/:amount", validateRequest(GetUserSchema), paymentController.createPayment);

//get payment status
paymentRegistry.registerPath({
  method: "get",
  path: "/payment/status/{paymentId}",
  tags: ["Payment"],
  request: { params: GetPaymentStatusSchema.shape.params },  
  responses: createApiResponse(PaymentSchema, "Success"),
});

paymentRouter.get("/status/:paymentId", paymentController.getPaymentStatus);