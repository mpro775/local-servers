import React, { useState } from "react";
import {  useQuery, useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { ACCEPT_BOOKING, GET_PROVIDER_BOOKINGS_ALL, REJECT_BOOKING } from "@/lib/repositories/BookingRepository";
import { BookingRow } from "@/types";




const statusArabic: Record<string, string> = {
  PENDING: "قيد الانتظار",
  ACCEPTED: "مقبول",
  REJECTED: "مرفوض",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
  COMPLETED: "bg-sky-100 text-sky-800",
  CANCELLED: "bg-slate-100 text-slate-800",
};

export function AllBookingsTable() {
  const { data, loading, error, refetch } = useQuery(GET_PROVIDER_BOOKINGS_ALL);
  const [acceptBooking, { loading: accepting }] = useMutation(ACCEPT_BOOKING);
  const [rejectBooking, { loading: rejecting }] = useMutation(REJECT_BOOKING);
  const [sortConfig, setSortConfig] = useState<{ key: keyof BookingRow; direction: "asc" | "desc" } | null>(null);
    const sortedRows = [...(data?.providerBookings || [])].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key;
    if (a[key] < b[key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

    const requestSort = (key: keyof BookingRow) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

   if (loading) return (
    <div className="flex justify-center p-8">
      <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 p-6 rounded-xl flex flex-col items-center gap-4">
      <p className="text-rose-600 font-medium">فشل تحميل البيانات</p>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2"
      >
        <ArrowPathIcon className="h-5 w-5" />
        إعادة المحاولة
      </button>
    </div>
  );

  if (sortedRows.length === 0) return (
    <div className="bg-slate-50 p-8 rounded-2xl text-center">
      <p className="text-slate-600">لا توجد حجوزات لعرضها حالياً</p>
    </div>
  );


   return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["service.title", "user.name", "bookingDate", "status"].map((key) => (
                <th
                  key={key}
                  className="px-6 py-4 text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => requestSort(key as keyof BookingRow)}
                >
                  <div className="flex items-center gap-1">
                    {{
                      "service.title": "الخدمة",
                      "user.name": "العميل",
                      "bookingDate": "التاريخ",
                      "status": "الحالة",
                    }[key]}
                    <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedRows.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {booking.service.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.user.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(booking.bookingDate).toLocaleDateString("ar-SA", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}
                  >
                    {statusArabic[booking.status]}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {booking.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          await acceptBooking({ variables: { id: booking.id } });
                          refetch();
                        }}
                        disabled={accepting}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {accepting ? (
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4" />
                        )}
                        قبول
                      </button>
                      <button
                        onClick={async () => {
                          await rejectBooking({ variables: { id: booking.id } });
                          refetch();
                        }}
                        disabled={rejecting}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {rejecting ? (
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircleIcon className="h-4 w-4" />
                        )}
                        رفض
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </motion.div>
  );
}