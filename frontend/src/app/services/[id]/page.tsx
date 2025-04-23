"use client";
import { ApolloError } from "@apollo/client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  StarIcon,
  MapPinIcon,
  UserCircleIcon,
  TagIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { Review, Service } from "@/types";
import ServiceBadge from "@/components/service-details/ServiceBadge";
import ImageGallery from "@/components/service-details/ImageGallery";
import { toast } from "react-toastify";
import {
  CREATE_BOOKING,
  GET_MY_BOOKING_FOR_SERVICE,
} from "@/lib/repositories/BookingRepository";
import { GET_SERVICE } from "@/lib/repositories/ServiceRepository";
import { GET_REVIEWS } from "@/lib/repositories/ReviewRepository";
import ReviewForm from "@/components/service-details/ReviewForm";
import { useAuth } from "@/contexts/AuthContext";

export default function ServiceDetailsPage() {
  const params = useParams();
  const [hasReviewed, setHasReviewed] = useState(false);
  const { user } = useAuth(); 

  const id = params?.id as string;
  const { data: myBookingData } = useQuery(GET_MY_BOOKING_FOR_SERVICE, {
    variables: { serviceId: id },
    skip: !id,
  });
  const existingBooking = myBookingData?.getMyBookingForService;
  const serviceId = id;

  const { data: revData } = useQuery<{ reviews: Review[] }>(GET_REVIEWS, {
    variables: { serviceId },
  });

  useEffect(() => {
    if (user && revData?.reviews) {
      setHasReviewed(revData.reviews.some((r) => r.user.id === user.id));
    }
  }, [user, revData]);

  const { data, loading, error } = useQuery<{ service: Service }>(GET_SERVICE, {
    variables: { id },
    skip: !id,
  });

  const [createBooking, { loading: bookingLoading }] =
    useMutation(CREATE_BOOKING);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="فشل في تحميل تفاصيل الخدمة" />;
  if (!data?.service) return <ErrorMessage message="لم تُعثر على هذه الخدمة" />;

  const { service } = data;
  const coords = service.location?.coordinates;
  const providerRating = service.provider?.avgRating?.toFixed(1);

  const handleBooking = async () => {
    try {
      const { data } = await createBooking({
        variables: { serviceId: service.id },
      });

      if (data?.createBooking) {
        toast.success(
          "🎉 تم إرسال طلب الحجز بنجاح! الرجاء انتظار رد مزود الخدمة."
        );
      }
    } catch (error) {
      const err = error as ApolloError;
      const message = err.graphQLErrors?.[0]?.message;

      if (message?.includes("حجز سابق")) {
        toast.info("📌 لديك طلب حجز لهذه الخدمة قيد المراجعة.");
      } else {
        toast.error("❌ حدث خطأ أثناء الحجز، حاول مرة أخرى.");
      }

      console.error("Booking error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* العنوان والتصنيف */}
      <div className="mb-8 pb-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {service.title}
          </h1>
          <div className="flex items-center gap-4">
            <ServiceBadge status={service.status} />
            <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full">
              <StarIcon className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-700">
                {providerRating || "جديد"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-8">
        {/* معرض الصور */}
        <ImageGallery images={service.images} />

        {/* الجانب الأيمن */}
        <div className="space-y-6">
          {/* بطاقة الحجز */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-3xl font-extrabold text-blue-600 mb-1">
                  {service.price?.toLocaleString()} ر.س
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  شامل جميع الرسوم
                </p>
              </div>
              <TagIcon className="w-10 h-10 text-emerald-100 p-2 bg-emerald-500/10 rounded-lg" />
            </div>

            {existingBooking ? (
              <div className="w-full bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-xl text-sm text-center">
                لقد قمت مسبقًا بطلب هذه الخدمة، وحالتها الحالية:{" "}
                <span className="font-semibold">
                  {translateStatus(existingBooking.status)}
                </span>
                .
              </div>
            ) : (
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
              >
                {bookingLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <ClockIcon className="w-5 h-5 animate-spin" />
                    جاري إتمام الحجز...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    تأكيد الحجز الآن
                  </span>
                )}
              </button>
            )}
          </div>
          {service.status === "COMPLETED" &&
            existingBooking?.status === "COMPLETED" &&
            !hasReviewed && (
              <ReviewForm
                serviceId={service.id}
                bookingId={existingBooking.id}
                onSuccess={() => setHasReviewed(true)}
              />
            )}
          {/* معلومات المزود */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-semibold mb-5 flex items-center gap-3 text-gray-800">
              <UserCircleIcon className="w-7 h-7 text-blue-500" />
              <span>معلومات المزود</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
                    {service.provider?.name?.[0] || "?"}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-400 border-2 border-white rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {service.provider?.name}
                  </p>
                  <p className="text-sm text-gray-500">مزود معتمد</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-3">
                <span className="text-sm text-gray-600">التقييم العام</span>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 text-amber-400" />
                  <span className="font-medium text-gray-700">
                    {providerRating || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* الموقع */}
          {coords && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-5 flex items-center gap-3 text-gray-800">
                <MapPinIcon className="w-7 h-7 text-red-500" />
                <span>موقع تنفيذ الخدمة</span>
              </h3>
              <div className="aspect-video rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  className="w-full h-full"
                  src={`https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${coords[1]},${coords[0]}&zoom=16`}
                  loading="lazy"
                />
              </div>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                <span className="font-medium">العنوان الدقيق:</span>{" "}
                {service.address}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* التفاصيل الإضافية */}
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">تفاصيل الخدمة</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <DetailItem
              icon={<TagIcon className="w-6 h-6 text-blue-500" />}
              title="التصنيف"
              value={service.category?.name}
            />
            <DetailItem
              icon={<ClockIcon className="w-6 h-6 text-blue-500" />}
              title="تاريخ الإضافة"
              value={
                service.createdAt
                  ? new Date(service.createdAt).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "غير متوفر"
              }
            />
          </div>
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                وصف الخدمة
              </h3>
              {service.description ? (
                <p className="whitespace-pre-line">{service.description}</p>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 italic">
                    لا يوجد وصف مفصل متاح لهذه الخدمة حالياً
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 p-6 bg-blue-50 rounded-full">
            <svg
              className="w-16 h-16 text-blue-400 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            قسم التعليقات والمراجعات
          </h3>

          <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
            نحن نعمل بجد لتطوير تجربة أفضل لتقييم الخدمات. هذا القسم قيد التطوير
            حالياً وسيكون متاحاً قريباً بميزات رائعة!
          </p>

          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <ClockIcon className="w-5 h-5" />
            <span>انتظرونا قريباً</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value?: string;
}) => (
  <div className="flex items-start gap-5 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
    <div className="p-3 bg-white rounded-lg shadow-sm text-emerald-500">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
      <p className="text-lg font-semibold text-gray-800">
        {value || "غير متوفر"}
      </p>
    </div>
  </div>
);
function translateStatus(status: string) {
  switch (status) {
    case "PENDING":
      return "قيد الانتظار";
    case "ACCEPTED":
      return "تم القبول";
    case "PAID":
      return "تم الدفع";
    case "REJECTED":
      return "مرفوض";
    case "COMPLETED":
      return "مكتمل";
    case "CANCELLED":
      return "ملغي";
    default:
      return status;
  }
}
