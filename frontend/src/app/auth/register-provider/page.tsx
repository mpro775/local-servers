// src/app/provider/register/page.tsx (أو المسار الذي تستخدمه)
"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  LockClosedIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  description: string;
}

export default function ProviderRegistration() {
  const router = useRouter();
  const { register: signup, loading: authLoading } = useAuth();
  const {
    register: rhfRegister,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setErrorMessage("");
    setLoading(true);
    try {
      await signup({
        email: data.email,
        password: data.password,
        name: data.name,
        role: "PROVIDER",
        phone: data.phone,
        description: data.description,
      });
   router.push('/dashboard/provider');

    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage("حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-50 pt-24 pb-12">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-white">
        {/* الجانب الترويجي */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex flex-col justify-center items-center">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold mb-4">انضم كخبير محترف!</h1>
            <p className="text-lg leading-relaxed">
              عزز وجودك الرقمي ووصل بآلاف العملاء المحتملين في منطقتك.
              استفد من منصتنا لإدارة طلبات الخدمة وزيادة دخلك.
            </p>
            <p className="text-sm mt-4">
              لديك حساب بالفعل؟{" "}
              <Link
                href="/auth/login"
                className="font-semibold underline hover:text-blue-200"
              >
                سجل الدخول هنا
              </Link>
            </p>
          </div>
        </div>

        {/* نموذج التسجيل */}
        <div className="md:w-1/2 p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                تسجيل مزود خدمة
              </h2>
              <p className="text-gray-600 mt-2">
                املأ البيانات اللازمة لبدء تقديم خدماتك
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* الاسم الكامل */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <UserIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  {...rhfRegister("name", { required: "حقل مطلوب" })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="اسم المؤسسة أو الاسم التجاري"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  {...rhfRegister("email", {
                    required: "حقل مطلوب",
                    pattern: {
                      value:
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "بريد إلكتروني غير صحيح",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="example@provider.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  {...rhfRegister("password", {
                    required: "حقل مطلوب",
                    minLength: {
                      value: 8,
                      message: "الحد الأدنى 8 أحرف",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* رقم الجوال */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                رقم الجوال
              </label>
              <div className="relative">
                <PhoneIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "حقل مطلوب" }}
                  render={({ field, fieldState }) => (
                    <div className="pl-10">
                      <PhoneInput
                        international
                        defaultCountry="SA"
                        {...field}
                        onChange={(value) =>
                          field.onChange(value || "")
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* وصف الخدمة */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                وصف الخدمة
              </label>
              <div className="relative">
                <DocumentTextIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <textarea
                  {...rhfRegister("description", {
                    required: "حقل مطلوب",
                    minLength: {
                      value: 50,
                      message: "الحد الأدنى 50 حرف",
                    },
                  })}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="وصف مختصر عن الخدمات المقدمة..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* زر التسجيل */}
            <button
              type="submit"
              disabled={loading || authLoading}
              className={`w-full ${
                loading || authLoading
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium py-3 px-4 rounded-lg transition-all flex justify-center items-center gap-2`}
            >
              {loading || authLoading ? (
                <>
                  <span>جاري التسجيل...</span>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                <span>تسجيل كمزود خدمة</span>
              )}
            </button>

            {/* الشروط والأحكام */}
            <p className="text-center text-sm text-gray-600 mt-4">
              بالاستمرار فإنك توافق على{" "}
              <Link
                href="/terms"
                className="text-blue-600 hover:underline"
              >
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:underline"
              >
                سياسة الخصوصية
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
