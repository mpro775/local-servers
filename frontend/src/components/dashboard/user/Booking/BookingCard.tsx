import {  useMutation } from '@apollo/client';
import { Booking } from "@/types";
import  Button  from "@/components/ui/button";
import  Badge  from "@/components/ui/badge";
import { Loader2, X,  Wallet } from "lucide-react";
import Link from "next/link";
import { toast } from 'react-toastify';
import { CANCEL_BOOKING, PAY_BOOKING } from '@/lib/repositories/BookingRepository';


export default function BookingCard({ booking, onUpdate }: { booking: Booking, onUpdate: () => void }) {
  const [cancelBooking, { loading: cancelling }] = useMutation(CANCEL_BOOKING);
  const [payBooking, { loading: paying }] = useMutation(PAY_BOOKING);

  const statusBadge = {
    PENDING: { color: 'bg-amber-100 text-amber-800', label: 'قيد الانتظار' },
    ACCEPTED: { color: 'bg-blue-100 text-blue-800', label: 'مقبول' },
    PAID: { color: 'bg-green-100 text-green-800', label: ' مكتمل و مدفوع' },
    COMPLETED: { color: 'bg-purple-100 text-purple-800', label: 'مكتمل وغير مدفوع'  },
    CANCELLED: { color: 'bg-red-100 text-red-800', label: 'ملغي' },
    REJECTED: { color: 'bg-red-100 text-red-800', label: 'مرفوض' }
  };

  const handleCancel = async () => {
    try {
      await cancelBooking({ variables: { id: booking.id } });
      toast.success("تم الإلغاء بنجاح");
      onUpdate();
    } catch  {
      toast.error("فشل في الإلغاء");
    }
  };

  const handlePayment = async () => {
    try {
      await payBooking({ variables: { id: booking.id } });
      toast.success("تم بدء عملية الدفع");
    const paymentWindow = window.open(
        `/payment/${booking.id}`, 
        '_blank',
        'width=600,height=800'
      );
        
        // تفقد حالة النافذة كل 500 مللي ثانية
      const checkWindow = setInterval(() => {
        if (paymentWindow?.closed) {
          clearInterval(checkWindow);
        
      onUpdate();
    }
       }, 500);
    } catch  {
      toast.error("فشل في بدء الدفع");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{booking.service.title}</h3>
            <Badge className={statusBadge[booking.status].color}>
              {statusBadge[booking.status].label}
            </Badge>
            {booking.isPaid && <Badge >مدفوع</Badge>}
          </div>
          
          <p className="text-gray-600">
            المزود: {booking.service.provider.name}
          </p>
          
          <p className="text-sm text-gray-500">
            {new Date(booking.bookingDate).toLocaleDateString('ar-SA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <p className="text-xl font-bold text-blue-600">
            {booking.service.price.toLocaleString('ar-SA')} ر.س
          </p>

          <div className="flex gap-2">
            {booking.status === 'PENDING' && (
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? <Loader2 className="animate-spin mr-2" /> : <X className="mr-2" />}
                إلغاء الحجز
              </Button>
            )}

            {booking.status === 'ACCEPTED' && !booking.isPaid && (
              <Button
                onClick={handlePayment}
                disabled={paying}
              >
                {paying ? <Loader2 className="animate-spin mr-2" /> : <Wallet className="mr-2" />}
                ادفع الآن
              </Button>
            )}

            {booking.status === 'PAID' && (
              <Link href={`/bookings/${booking.id}/review`}>
                <Button variant="outline">
                  أضف تقييمًا
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}