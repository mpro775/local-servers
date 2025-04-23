import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import  Button  from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {  useMutation } from "@apollo/client";
import { CONFIRM_PAYMENT } from "@/lib/repositories/BookingRepository";



export default function CheckoutForm({
  paymentId,
  bookingId,
  clientSecret, // إضافة هذا البروب

}: {
  paymentId: string;
  bookingId: string;
    clientSecret: string; // تحديد نوع البروب

}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirmPayment] = useMutation(CONFIRM_PAYMENT);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error: stripeError } = await stripe.confirmCardPayment(
      clientSecret, // استخدام الـ clientSecret هنا
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message || "حدث خطأ غير متوقع");
      return;
    }

    try {
      await confirmPayment({ variables: { paymentId } });
      router.push(`/payment/success/${bookingId}`);
    } catch  {
      setError("فشل في تأكيد الدفع");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-4 border rounded-lg" />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full">
        أكمل الدفع
      </Button>
    </form>
  );
}