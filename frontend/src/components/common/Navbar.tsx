"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Transition } from "@headlessui/react";
import { 
  ChevronDownIcon, 
  UserCircleIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserPlusIcon, 
  ArrowRightStartOnRectangleIcon 
} from "@heroicons/react/24/outline";
import { useEffect, useState, Fragment } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface User {
  name?:string;
  email: string;
  role?: 'USER' | 'ADMIN' | 'PROVIDER'; 
}

interface UserMenuProps {
  user: User;
  logout: () => void;
  isScrolled: boolean;
  dashboardLink: string;
}

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [pathname]);

  const getDashboardLink = () => {
    if (!user?.role) return '#'; // التحقق من وجود role
    return `/dashboard/${user.role.toLowerCase()}`;
  };

  const headerClasses = clsx(
    "fixed w-full z-50 transition-all duration-300",
    isScrolled ? "bg-white shadow-lg" : "bg-transparent",
    pathname === '/' ? 'absolute' : 'relative'
  );

  const logoColor = clsx(
    "text-xl md:text-2xl font-bold transition-colors",
    isScrolled || pathname !== '/' ? "text-blue-600" : "text-white"
  );

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 lg:px-8 py-3 md:py-4 flex justify-between items-center">
        
        <Link href="/" className="flex items-center gap-2" prefetch>
          <h1 className={logoColor}>
            LocalServices<span className="text-blue-500">Pro</span>
          </h1>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <XMarkIcon className={clsx("h-6 w-6", isScrolled ? "text-gray-700" : "text-white")} />
          ) : (
            <Bars3Icon className={clsx("h-6 w-6", isScrolled ? "text-gray-700" : "text-white")} />
          )}
        </button>

<nav className={clsx(
  "md:flex items-center gap-4",
  "absolute md:static top-full left-0 right-0 bg-white md:bg-transparent",
  "shadow-lg md:shadow-none transition-all duration-300",
  "overflow-hidden md:overflow-visible", 
          isMenuOpen ? "max-h-screen py-4 overflow-visible" : "max-h-0 md:max-h-screen overflow-hidden", "md:overflow-visible")}>
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            
            <Link 
              href="/services" 
              className={clsx(
                "text-sm md:text-base hover:text-blue-500 transition-colors",
                isScrolled ? "text-gray-700" : "md:text-white"
              )}
              prefetch
            >
              الخدمات
            </Link>

            {!loading && (
      user ? (
        <UserMenu 
          user={user} 
          logout={logout} 
          isScrolled={isScrolled || pathname !== '/'} 
          dashboardLink={getDashboardLink()}
        />
      ) : (
        <AuthLinks isScrolled={isScrolled || pathname !== '/'} />
      )
    )}
          </div>
        </nav>
      </div>
    </header>
  );
};

const UserMenu = ({ user, logout, isScrolled, dashboardLink }: UserMenuProps) => (
  <Menu as="div" className="relative">
    <Menu.Button className={clsx(
      "flex items-center gap-2 hover:text-blue-500 transition-colors",
      isScrolled ? "text-gray-700" : "md:text-white"
    )}>
      <UserCircleIcon className="h-7 w-7" />
      <div className="text-left">
        <p className="font-medium text-sm leading-tight">
          {{
  'USER': 'مستخدم',
  'ADMIN': 'مدير',
  'PROVIDER': 'مزود خدمة'
          }[user.role || 'USER']}
        </p>
        <p className="text-xs opacity-75 max-w-[120px] truncate">
          {user.name?.split('@')[0] || 'اسم غير معرّف'} 
        </p>
      </div>
      <ChevronDownIcon className="h-4 w-4" />
    </Menu.Button>

    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black/5">
        <div className="p-2 space-y-1">
          <Menu.Item>
            {({ active }) => (
              <Link
                href={dashboardLink}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm",
                  active && "bg-blue-50 text-blue-600"
                )}
                prefetch
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                لوحة التحكم
              </Link>
            )}
          </Menu.Item>
          
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile"
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm",
                  active && "bg-blue-50 text-blue-600"
                )}
                prefetch
              >
                <UserCircleIcon className="h-5 w-5" />
                الملف الشخصي
              </Link>
            )}
          </Menu.Item>
          
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={logout}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm",
                  active && "bg-blue-50 text-blue-600"
                )}
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                تسجيل الخروج
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
);

const AuthLinks = ({ isScrolled }: { isScrolled: boolean }) => (
  <div className="flex flex-col md:flex-row gap-2 md:gap-4">
    <Link
      href="/auth/login"
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
        "text-sm md:text-base",
        isScrolled 
          ? "text-gray-700 hover:bg-gray-100" 
          : "text-blue-600 bg-white/90 hover:bg-white"
      )}
      prefetch
    >
      <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
      تسجيل الدخول
    </Link>

    <Link
      href="/auth/register"
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
        "text-sm md:text-base",
        isScrolled
          ? "bg-blue-600 text-white hover:bg-blue-500"
          : "bg-white text-blue-600 hover:bg-blue-50"
      )}
      prefetch
    >
      <UserPlusIcon className="h-5 w-5" />
      إنشاء حساب
    </Link>
  </div>
);

export default Navbar;