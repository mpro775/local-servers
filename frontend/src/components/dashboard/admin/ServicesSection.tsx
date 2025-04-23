"use client";

import {
  GET_SERVICES_ADMIN,
  TOGGLE_SERVICE_STATUS,
} from "@/lib/repositories/ServiceRepository";
import { Service } from "@/types";
import { useMutation, useQuery } from "@apollo/client";

export default function ServicesSection() {
  const { data, loading } = useQuery(GET_SERVICES_ADMIN);
  const [toggleServiceStatus] = useMutation(TOGGLE_SERVICE_STATUS);

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleServiceStatus({ variables: { id } });
    } catch (error) {
      console.error("فشل التبديل:", error);
    }
  };

  if (loading)
    return <p className="text-center py-4">جارٍ تحميل البيانات...</p>;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">قائمة الخدمات</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                الخدمة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                الفئة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                المزود
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                السعر
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                الاحداث
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.allServices?.map((service: Service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">{service.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {service.category?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {service.provider?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {service.price} ر.س
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {" "}
                  <button
                    onClick={() => handleToggleStatus(service.id)}
                    className={`px-3 py-1 rounded text-white text-sm transition ${
                      service.status === "SUSPENDED"
                        ? "bg-green-600 hover:bg-green-500"
                        : "bg-yellow-600 hover:bg-yellow-500"
                    }`}
                  >
                    {service.status === "SUSPENDED" ? "تفعيل" : "إيقاف"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
