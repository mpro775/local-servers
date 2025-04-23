import Stripe from "stripe";
import dotenv from "dotenv";
import Booking, { IBooking } from "../models/Booking";
import { GraphQLError } from "graphql";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil", // تحديث لإصدار أحدث
});

export const paymentService = {
  createPaymentIntent: async (bookingId: string, amount: number) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // التحويل لسنتات
        currency: "sar",
        metadata: { bookingId },
        payment_method_types: ["card"],
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentIntent.id,
      };
    } catch (error) {
      throw new GraphQLError("فشل في إنشاء نية الدفع");
    }
  },

  confirmPayment: async (paymentId: string) => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

      if (paymentIntent.status !== "succeeded") {
        throw new Error("لم يكتمل الدفع بعد");
      }

      const booking = await Booking.findByIdAndUpdate(
        paymentIntent.metadata.bookingId,
        { status: "PAID", isPaid: true },
        { new: true }
      ).populate("service");

      if (!booking) {
        throw new GraphQLError("الحجز غير موجود");
      }

      return booking;
    } catch (error) {
      throw new GraphQLError("فشل في تأكيد الدفع");
    }
  },

  handleWebhook: async (payload: any, sigHeader: string) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, sigHeader, webhookSecret);
    } catch (err) {
      throw new GraphQLError(`خطأ في التحقق: ${(err as Error).message}`);
    }

    // تحديد دالة Type Guard
    const isPaymentIntent = (obj: any): obj is Stripe.PaymentIntent => {
      return (
        obj && typeof obj.id === "string" && obj.object === "payment_intent"
      );
    };

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;

        if (!isPaymentIntent(paymentIntent)) {
          throw new GraphQLError("بيانات الدفع غير صالحة");
        }

        await this.confirmPayment(paymentIntent.id); // الخطأ سيختفي الآن
        break;

      default:
        console.log(`حدث غير معالج: ${event.type}`);
    }

    return { success: true };
  },
};
