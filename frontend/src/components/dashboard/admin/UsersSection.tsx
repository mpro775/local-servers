"use client";

import { IProvider } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import AddUserModal from "./AddUserModal";
import {
  GET_USERS,
  TOGGLE_USER_STATUS,
} from "@/lib/repositories/UserRepository";

export default function UsersSection() {
  const { data, loading, refetch } = useQuery(GET_USERS);
  const [toggleStatus] = useMutation(TOGGLE_USER_STATUS);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggle = async (id: string) => {
    setActionUserId(id);
    try {
      await toggleStatus({ variables: { id } });
      refetch();
    } catch (error) {
      console.error("خطأ أثناء تحديث حالة المستخدم", error);
    } finally {
      setActionUserId(null);
    }
  };

  if (loading) return <p>جاري تحميل المستخدمين...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">إدارة المستخدمين</h2>
      <button
        onClick={() => setShowAddForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        إضافة مستخدم
      </button>
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium text-gray-700">فلتر حسب الدور:</label>
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            refetch({ role: e.target.value || undefined });
          }}
          className="border rounded px-4 py-2"
        >
          <option value="">الكل</option>
          <option value="USER">المستخدمين</option>
          <option value="PROVIDER">مزودي الخدمات</option>
        </select>
      </div>
      {showAddForm && (
        <AddUserModal
          onClose={() => {
            setShowAddForm(false);
            refetch();
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                الاسم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                البريد الإلكتروني
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                الدور
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                إجراء
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.adminUsers?.map((user: IProvider) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isActive ? "نشط" : "موقوف"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role !== "ADMIN" && (
                    <button
                      onClick={() => handleToggle(user.id)}
                      disabled={actionUserId === user.id}
                      className={`px-4 py-1 rounded text-white text-sm transition ${
                        user.isActive
                          ? "bg-red-600 hover:bg-red-500"
                          : "bg-green-600 hover:bg-green-500"
                      }`}
                    >
                      {user.isActive ? "إيقاف" : "تفعيل"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
