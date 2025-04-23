"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-95" />

      <div className="relative text-center px-4 max-w-4xl mx-4">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 xs:mb-4 sm:mb-6 leading-snug xs:leading-tight sm:leading-tight">
          اكتشف أفضل الخدمات المحلية بكل سهولة
        </h2>

        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-blue-100/90 mb-4 xs:mb-6 sm:mb-8 px-2 xs:px-0">
          تواصل مع محترفين معتمدين في مجالات الكهرباء، التعليم، الصيانة وغيرها
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            href="/services"
            className="px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-full 
                     text-base sm:text-lg font-semibold 
                     hover:bg-blue-50 transition-all 
                     shadow-lg"
          >
            ابحث عن خدمات
          </Link>

          <Link
            href="/auth/register-provider"
            className="px-6 sm:px-8 py-3 border-2 border-white text-white rounded-full 
                     text-base sm:text-lg font-semibold 
                     hover:bg-white hover:text-blue-600 transition-all"
          >
            كن مزود خدمة
          </Link>
        </div>
      </div>
    </section>
  );
}
