// src/app/auth/register/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  LockClosedIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function RegisterPage() {
  const { register: signup, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      // نمرر بيانات افتراضية لـ providerData و firebaseUID
await signup({
  email,
  password,
  name,
  role: "USER",
  phone: "",         // أو يمكنك طلب رقم تليفون هنا إذا أردت
  description: ""    // أو تركها فارغة
});

      router.push("/");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("حدث خطأ غير متوقع");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-50 pt-24 pb-12">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-white">
        {/* الجانب الترويجي */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex flex-col justify-center items-center">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold mb-4">مرحبًا بك في مجتمعنا!</h1>
            <p className="text-lg leading-relaxed">
              انضم إلى آلاف العملاء الراضين واستفد من أفضل الخدمات المحلية بكل سهولة وأمان.
            </p>
            <p className="text-sm mt-4">
              هل أنت مزود خدمة؟
              <Link
                href="/auth/register-provider"
                className="ml-2 font-semibold underline hover:text-blue-200"
              >
                سجّل هنا
              </Link>
            </p>
            <p className="text-sm mt-2">
              لديك حساب بالفعل؟
              <Link
                href="/auth/login"
                className="ml-2 font-semibold underline hover:text-blue-200"
              >
                سجّل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* نموذج التسجيل */}
        <div className="md:w-1/2 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              إنشاء حساب عميل
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <UserIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="أحمد محمد"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-gray-500 text-xs mt-2">
                يجب أن تحتوي على 6 أحرف على الأقل
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className={`w-full ${
                isSubmitting || authLoading
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2`}
            >
              {(isSubmitting || authLoading) && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>
                {isSubmitting || authLoading
                  ? "جاري التسجيل..."
                  : "إنشاء حساب عميل"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
