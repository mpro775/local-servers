// app/user/bookings/[id]/payment.tsx
'use client';
import {  useParams } from 'next/navigation';

export default function PaymentPage() {
  const { id } = useParams();
  // يمكن جلب تفاصيل الدفع من الـquery واستخدامه هنا
  // عرض نموذج الدفع أو إيصال.
  return <div>تفاصيل الدفع للحجز {id}</div>;
}
