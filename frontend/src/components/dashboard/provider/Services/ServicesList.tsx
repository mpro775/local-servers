// src/components/provider/ServicesList.tsx
import React, { useState } from "react";
import { Service, Category } from "../../../../types";
import {  useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { EditServiceModal } from "./EditServiceModal"; // مكون التعديل
import { GET_CATEGORIES } from "@/lib/repositories/CategoryRepository";
import {
  DELETE_SERVICE,
  UPDATE_SERVICE_STATUS,
} from "@/lib/repositories/ServiceRepository";

interface ServicesListProps {
  services: Service[];
  onUpdate: () => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onUpdate,
}) => {
  const [updateStatus] = useMutation(UPDATE_SERVICE_STATUS);
  const [deleteService] = useMutation(DELETE_SERVICE);
  const { data: catData } = useQuery<{ allCategories: Category[] }>(
    GET_CATEGORIES
  );

  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleStatusChange = async (
    serviceId: string,
    newStatus: Service["status"]
  ) => {
    try {
      await updateStatus({ variables: { id: serviceId, status: newStatus } });
      toast.success("تم تحديث الحالة بنجاح");
      onUpdate();
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    try {
      await deleteService({ variables: { id: serviceId } });
      toast.success("تم حذف الخدمة");
      onUpdate();
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {service.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${statusColors[service.status]}`}
                    >
                      {
                        statusOptions.find((o) => o.value === service.status)
                          ?.label
                      }
                    </span>
                    <span className="text-lg font-medium text-blue-600">
                      {service.price.toLocaleString()} ر.س
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => setEditingService(service)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <select
                  value={service.status}
                  onChange={(e) =>
                    handleStatusChange(
                      service.id,
                      e.target.value as Service["status"]
                    )
                  }
                  className="w-full border px-3 py-2 rounded"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between">
                <span>التصنيف: {service.category.name}</span>
                <span>
                  {service.createdAt}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {editingService && catData?.allCategories && (
        <EditServiceModal
          service={editingService}
          categories={catData.allCategories}
          onClose={() => setEditingService(null)}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
};

const statusColors: Record<Service["status"], string> = {
  ACTIVE: "bg-green-100 text-green-800",
  BUSY: "bg-amber-100 text-amber-800",
  INACTIVE: "bg-gray-100 text-gray-800",
};

const statusOptions = [
  { value: "ACTIVE", label: "نشط" },
  { value: "BUSY", label: "مشغول" },
  { value: "INACTIVE", label: "غير نشط" },
];
