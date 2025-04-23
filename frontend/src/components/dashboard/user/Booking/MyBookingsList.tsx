// app/user/dashboard/MyBookingsList.tsx
"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { Booking } from "@/types";
import BookingCard from "./BookingCard";
import { GET_MY_BOOKINGS } from "@/lib/repositories/BookingRepository";



export default function MyBookingsList() {
  const {  error, data, refetch } = useQuery<{ myBookings: Booking[] }>(GET_MY_BOOKINGS);
  if (error) return (
    <div className="text-red-500 p-4 rounded-lg bg-red-50">
      خطأ في تحميل البيانات: {error.message}
      <button 
        onClick={() => refetch()}
        className="ml-2 text-blue-600 hover:underline"
      >
        إعادة المحاولة
      </button>
    </div>
  );

  if (!data) return <p>جارٍ التحميل...</p>;
  if (data.myBookings.length === 0)
    return <p className="text-center py-4">لا توجد حجوزات حتى الآن.</p>;

  return (
    <div className="space-y-4">
      {data.myBookings.map((b: Booking) => (
        <BookingCard key={b.id} booking={b} onUpdate={refetch} />
      ))}
    </div>
  );
}
