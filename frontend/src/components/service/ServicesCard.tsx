// components/service/ServiceCard.tsx
import { Service } from "@/types";
import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { motion } from "framer-motion";

const ServiceCard = ({ service, layout }: { service: Service, layout: "grid" | "list" }) => {
  const imageUrl = service.images?.[0]?.url || "/images/service-placeholder.jpg";
  const rating = service.provider?.avgRating?.toFixed(1);
  const providerName = service.provider?.name || "مزود مجهول";
  const isBusy = service.status === "BUSY";

  const StatusBadge = () => (
    <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 shadow-md">
      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      <span>مشغول</span>
    </div>
  );

  return (
    <Link prefetch={true} href={`/services/${service.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className={`group bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden 
          ${layout === "list" ? "flex gap-4 p-4" : "h-full flex flex-col"}`}
      >
        {/* التعديل على حجم الصورة في العرض الشبكي */}
        <div className={`relative ${layout === "list" 
          ? "w-24 h-24 flex-shrink-0 rounded-md overflow-hidden" 
          : "h-40 sm:h-48 overflow-hidden"}`}>
          <img
            src={imageUrl}
            alt={service.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              layout === "grid" ? "max-h-40 sm:max-h-48" : ""
            }`}
            loading="lazy"
          />
          {isBusy && <StatusBadge />}
        </div>

        <div className={`flex flex-col justify-between ${layout === "list" ? "flex-1 py-1" : "p-3 space-y-1"}`}>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{service.title}</h4>
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
              <StarIcon className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-blue-700">{rating || "جديد"}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-medium">
                {providerName[0]}
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-white rounded-full" />
              </div>
              <span className="text-gray-700 truncate max-w-[100px]">{providerName}</span>
            </div>
            <span className="text-blue-700 font-semibold">
              {service.price.toLocaleString()} ر.س
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ServiceCard;