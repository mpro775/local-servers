import { CREATE_USER } from "@/lib/repositories/UserRepository";
import { useMutation } from "@apollo/client";
import { useState } from "react";

export default function AddUserModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    isActive: true,
  });
  const [createUser, { loading }] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ variables: { input: form } });
      onClose();
    } catch {
      alert("خطأ أثناء إضافة المستخدم");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4">
        <h2 className="text-xl font-bold">إضافة مستخدم جديد</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input"
            placeholder="الاسم"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="input"
          >
            <option value="USER">مستخدم</option>
            <option value="PROVIDER">مزود خدمة</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            نشط
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:underline"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
