"use client";

import { Booking } from "@/types";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";

const ALL_BOOKINGS_QUERY = gql`
  query AllBookings($status: RequestStatus) {
  allBookings(status: $status) {
    id
    status
    isPaid
    bookingDate
    service {
      title
      provider {
        name
      }
    }
    user {
      name
      email
    }
  }
}
`;

export default function BookingsSection() {

const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
const { data, loading,error, refetch } = useQuery(ALL_BOOKINGS_QUERY, {
  variables: selectedStatus ? { status: selectedStatus } : {},
});

  if (loading) return <p>جار تحميل الطلبات...</p>;
  if (error)
    return (
      <p className="text-red-500">خطأ في تحميل البيانات: {error.message}</p>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">جميع الطلبات</h2>
      <div className="mb-4 flex gap-4">
  <select
    onChange={(e) => setSelectedStatus(e.target.value || null)}
    className="p-2 border rounded"
  >
    <option value="">كل الحالات</option>
    <option value="PENDING">قيد الانتظار</option>
    <option value="ACCEPTED">تم القبول</option>
    <option value="REJECTED">مرفوض</option>
    <option value="COMPLETED">مكتمل</option>
    <option value="CANCELLED">ملغي</option>
    <option value="PAID">مدفوع</option>
  </select>

  <button
    onClick={() => refetch()}
    className="px-4 py-2 bg-blue-600 text-white rounded"
  >
    تحديث
  </button>
</div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                المستخدم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                مزود الخدمة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                الخدمة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                التاريخ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                الحالة
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(data?.allBookings as Booking[])?.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4">{booking.user?.name}</td>
                <td className="px-6 py-4">{booking.service?.provider?.name}</td>
                <td className="px-6 py-4">{booking.service?.title}</td>
                <td className="px-6 py-4">
                  {new Date(booking.bookingDate).toLocaleDateString("ar-EG")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm
          ${
            booking.status === "PENDING"
              ? "bg-yellow-500"
              : booking.status === "ACCEPTED"
                ? "bg-blue-500"
                : booking.status === "COMPLETED"
                  ? "bg-green-600"
                  : booking.status === "CANCELLED"
                    ? "bg-gray-500"
                    : booking.status === "PAID"
                      ? "bg-indigo-500"
                      : "bg-red-600"
          }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
