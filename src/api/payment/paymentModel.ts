import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Payment = z.infer<typeof PaymentSchema>;
export const PaymentSchema = z.object({
  amount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET payment/:amount' endpoint
export const GetUserSchema = z.object({
  params: z.object({ amount: commonValidations.amount }),
});

export const GetPaymentStatusSchema = z.object({
  params: z.object({
    paymentId: z.string().uuid("Invalid paymentId format"), 
  }),
});
