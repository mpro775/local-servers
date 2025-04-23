import Link from "next/link";

export default function Footer() {
  const SocialIcon = ({ href, icon }: { href: string; icon: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d={icon} />
      </svg>
    </a>
  );

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-white">
                Local<span className="text-blue-500">Services</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              منصة رائدة لتوصيل العملاء بأفضل مزودي الخدمات المحلية بكل سهولة
              وأمان.
            </p>
            <div className="mt-6 md:mt-0">
              <h4 className="text-white font-semibold mb-4 text-lg">تابعنا</h4>
              <div className="flex items-center gap-4">
                <SocialIcon
                  href="https://facebook.com"
                  icon="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
                <SocialIcon
                  href="https://youtube.com"
                  icon="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .498 6.186C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
                <SocialIcon
                  href="https://instagram.com"
                  icon="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">الروابط</h4>
            <ul className="space-y-2">
              {["الخدمات", "المزودون", "المدونة"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">الدعم</h4>
            <ul className="space-y-2">
              {[
                { name: "الأسئلة الشائعة", path: "/faq" },
                { name: "تواصل معنا", path: "/contact" },
                { name: "الشروط والأحكام", path: "/terms" },
                { name: "سياسة الخصوصية", path: "/privacy" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="hover:text-blue-400 transition text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">
              النشرة البريدية
            </h4>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="bg-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 px-4 text-sm transition-colors"
              >
                اشترك الآن
              </button>
            </form>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div>
              © {new Date().getFullYear()} Eng. Muhammed Murad. جميع الحقوق
              محفوظة.
            </div>
            <div className="flex items-center gap-4">
              <img
                src="https://user-images.githubusercontent.com/52581/44514079-4219bb80-a713-11e8-83a4-88f26bd07e2a.png"
                alt="Payment Methods"
                className="h-8 opacity-75"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
