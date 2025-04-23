'use client';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import  Button  from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ApolloClient } from '@apollo/client';

export default function CheckoutForm({ bookingId }: { bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      elements.getElement(CardElement)!, {
        payment_method: {
          card: elements.getElement(CardElement)!
        }
      }
    );

    if (error) {
      console.error(error);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      await ApolloClient.mutate({
        mutation: gql`
          mutation ConfirmPayment($bookingId: ID!, $paymentId: ID!) {
            confirmStripePayment(bookingId: $bookingId, paymentId: $paymentId) {
              id
              status
            }
          }
        `,
        variables: {
          bookingId,
          paymentId: paymentIntent.id
        }
      });

      router.push(`/payment/success/${bookingId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-4 border rounded-lg" />
      <Button type="submit" className="mt-4 w-full">
        تأكيد الدفع
      </Button>
    </form>
  );
}