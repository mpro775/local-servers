"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const oobCode = searchParams.get("oobCode");

  const handleReset = async () => {
    if (!oobCode) return toast.error("رابط غير صالح");
    if (password.length < 6) return toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    if (password !== confirm) return toast.error("كلمتا المرور غير متطابقتين");

    try {
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, password);
      toast.success("تم تغيير كلمة المرور بنجاح");
      router.push("/auth/login");
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("فشل في إعادة تعيين كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
      <div className="max-w-md bg-white p-6 rounded shadow-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          إعادة تعيين كلمة المرور
        </h2>
        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          {loading ? "جارٍ إعادة التعيين..." : "إعادة تعيين"}
        </button>
      </div>
    </div>
  );
}
