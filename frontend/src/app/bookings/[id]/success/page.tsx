'use client';
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">تم الدفع بنجاح!</h1>
        <p className="text-gray-600 mb-6">
          تم تأكيد عملية الدفع بنجاح، يمكنك تتبع حالة الحجز في لوحة التحكم
        </p>
        <Link 
          href="/user/dashboard"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}