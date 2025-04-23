'use client'

import { FormEvent, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'


export default function LoginPage() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError('');
  try {
    const isAdmin = email.startsWith('admin@');
    await login(email, password, { useFirebase: !isAdmin });
  } catch (err) {
    setError(err instanceof Error ? err.message : 'فشل في تسجيل الدخول');
  }
};

  return (
    <div className="min-h-screen flex items-center bg-gray-50 pt-24 pb-12">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-white">
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex flex-col justify-center items-center relative">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold mb-4">مرحبًا بعودتك!</h1>
            <p className="text-lg leading-relaxed">
              استمتع بإدارة خدماتك وابني علاقات مع العملاء من خلال منصتنا المتكاملة
            </p>
            <div className="mt-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                alt="Login Illustration"
                width={400}
                height={400}
                className="mx-auto"
              />
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-sm">ليس لديك حساب؟</p>
              <Link 
                href="/auth/register" 
                className="inline-block mt-2 px-6 py-2 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                انشاء حساب جديد
              </Link>
            </div>
          </div>
        </div>

        {/* نموذج تسجيل الدخول */}
        <div className="md:w-1/2 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">تسجيل الدخول</h2>
              <p className="text-gray-600 mt-2">أدخل بياناتك للوصول إلى حسابك</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* حقل البريد الإلكتروني */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@domain.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              <div className="text-right mt-2">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <span>جاري تسجيل الدخول...</span>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                <span>تسجيل الدخول</span>
              )}
            </button>

            {/* خيارات إضافية */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>

            {/* روابط إضافية */}
            <div className="text-center text-sm text-gray-600 mt-4">
              بالاستمرار فإنك توافق على{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                الشروط والأحكام
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}