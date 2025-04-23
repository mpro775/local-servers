'use client';
import { gql, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import  Button  from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

// const GET_BOOKING_DETAILS = gql`
//   query GetBookingDetails($id: ID!) {
//     booking(id: $id) {
//       id
//       service {
//         title
//         price
//         provider {
//           name
//         }
//       }
//     }
//   }
// `;

const PAY_BOOKING_MUTATION = gql`
  mutation ProcessDummyPayment($id: ID!) {
    processDummyPayment(id: $id) {
      id
      status
      isPaid
    }
  }
`;


export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  // const { data, loading } = useQuery(GET_BOOKING_DETAILS, {
  //   variables: { id: bookingId }
  // });

  const [payBooking, { loading: paying }] = useMutation(PAY_BOOKING_MUTATION);

  const handlePayment = async () => {
    try {
      await payBooking({
        variables: { id: bookingId },
        onCompleted: () => {
          toast.success("تمت عملية الدفع بنجاح!", {
            description: "شكراً لثقتك، سيتم تحويلك إلى صفحة التأكيد",
            action: {
              label: "العودة للرئيسية",
              onClick: () => router.push('/user/dashboard')
            }
          });
                  setTimeout(() => {
            window.close();
          }, 2000);
          router.push(`/payment/${bookingId}/success`);
        }
      });
    } catch  {
      toast.error("فشلت عملية الدفع", {
        description: "يرجى المحاولة مرة أخرى أو التواصل مع الدعم",
      });
    }
  };

  // if (loading) return (
  //   <div className="min-h-screen flex items-center justify-center">
  //     <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* أضف زر الدفع الوهمي */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">الدفع التجريبي</h2>
        
        <div className="space-y-4 mb-8">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-medium">بطاقة اختبارية:</p>
            <p className="text-sm text-gray-600">4242 4242 4242 4242</p>
            <p className="text-sm text-gray-600">أي تاريخ انتهاء/أي CVV</p>
          </div>
        </div>

        <Button 
          onClick={handlePayment}
          className="w-full py-4"
          disabled={paying}
        >
          {paying ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Wallet className="mr-2" />
          )}
          تأكيد الدفع الوهمي
        </Button>
      </div>
    </div>
  );
}