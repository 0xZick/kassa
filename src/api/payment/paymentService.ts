import { StatusCodes } from "http-status-codes";
import axios from 'axios'
import uuid from 'generate-unique-id'

import { logger } from "@/server";
import { SECRET_KEY, SHOP_ID } from "@/common/constants/yookassa";
import { ServiceResponse } from "@/common/models/serviceResponse";

type Response = {
  "id": "23d93cac-000f-5000-8000-126628f15141",
  "status": "pending",
  "paid": false,
  "confirmation": {
    "type": "redirect",
    "confirmation_url": "https://yoomoney.ru/api-pages/v2/payment-confirm/epl?orderId=23d93cac-000f-5000-8000-126628f15141"
  },
  "test": false
}


export class PaymentService {
  constructor() {}

  async createPayment(amount: number): Promise<ServiceResponse<string | null>> {
    try {
      const { data } = await axios.post<Response>('https://api.yookassa.ru/v3/payments', {
        amount: {
          value: `${amount}`,
          currency: "RUB"
        },
        confirmation: {
          type: "redirect",
          return_url: "http://localhost:3000/"
        },
        capture: true,
        description: "Заказ M&A"
      }, {
        headers: {
          'Idempotence-Key': uuid(),
        },
        auth: {
          username: `${SHOP_ID}`,
          password: `${SECRET_KEY}`,
        }
      })

      if (!data.confirmation.confirmation_url) {
        return ServiceResponse.failure("Payment failed", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<string>("Payment success", data.confirmation.confirmation_url);

    } catch (ex) {
      console.log(ex)

      const errorMessage = `Error finding payment:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding payment.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getPaymentStatus(paymentId: string): Promise<ServiceResponse<string | null>> {
    try {
      const {data} = await axios.get(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
        auth: {
          username: `${SHOP_ID}`, 
          password: `${SECRET_KEY}`,    
        }
      });
      console.log('data.status', data.status );

      if (!data.status) {
        return ServiceResponse.failure("Payment status not found", null, StatusCodes.NOT_FOUND);
      }
      
      return ServiceResponse.success<string>("Payment status received", data.status);

    } catch (ex) {
      const errorMessage = `Error getting payment status:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while retrieving payment status.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const paymentService = new PaymentService();
