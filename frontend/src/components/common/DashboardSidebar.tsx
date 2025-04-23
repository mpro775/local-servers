"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

export type SidebarItem = {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tab: string;
};

type Props = {
  userName?: string;
  items: SidebarItem[];
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
};

const DashboardSidebar: React.FC<Props> = ({
  userName = "مستخدم",
  items,
  activeTab,
  onChangeTab,
}) => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* زر القائمة الجانبية للجوال */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-6 w-6 text-blue-600" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-blue-600" />
        )}
      </button>

      {/* الشريط الجانبي */}
      <aside
        className={`w-full md:w-72 bg-white/90 backdrop-blur-lg shadow-xl fixed md:relative h-screen flex flex-col z-40 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 border-b border-blue-100">
          <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-2 rounded-lg">👋</span>
            مرحبًا {userName}
          </h2>
        </div>

        {/* عناصر القائمة */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          {items.map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                onChangeTab?.(item.tab);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center p-4 space-x-3 rounded-xl mb-2
                transition-all duration-200 ${
                  activeTab === item.tab
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              <item.icon
                className={`h-6 w-6 ${activeTab === item.tab ? "text-white" : "text-current"}`}
              />
              <span className="text-lg font-medium">{item.name}</span>
            </button>
          ))}

          {/* رابط الصفحة الرئيسية */}
          <Link
            href="/"
            className="w-full flex items-center p-4 space-x-3 rounded-xl mb-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            <HomeIcon className="h-6 w-6" />
            <span className="text-lg font-medium">الصفحة الرئيسية</span>
          </Link>
        </nav>

        {/* تسجيل الخروج */}
        <div className="p-4 border-t border-blue-100 bg-white/80">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-3 text-red-600 
              hover:bg-red-50 p-3 rounded-xl transition-all duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* خلفية القائمة في الجوال */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;
