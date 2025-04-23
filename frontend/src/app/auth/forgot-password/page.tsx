"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
   const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return toast.error("يرجى إدخال البريد الإلكتروني");

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error("حدث خطأ أثناء إرسال الرابط");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
        نسيت كلمة المرور؟
      </h2>
      <input
        type="email"
        value={email}
        placeholder="البريد الإلكتروني"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
      />
      <button
        onClick={handleReset}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
      >
        {loading ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
      </button>
    </div>
  );
}