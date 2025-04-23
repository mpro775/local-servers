"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardSidebar, { SidebarItem } from "@/components/common/DashboardSidebar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { GET_STATS } from "@/lib/repositories/BaseRepository";
import {  ChartBarIcon, DocumentTextIcon, TagIcon, UsersIcon ,BriefcaseIcon} from "@heroicons/react/24/solid";
import DashboardStats from "@/components/dashboard/admin/DashboardStats";
import CategoriesSection from "@/components/dashboard/admin/CategoriesSection";
import ServicesSection from "@/components/dashboard/admin/ServicesSection";
import UsersSection from "@/components/dashboard/admin/UsersSection";
import BookingsSection from "@/components/dashboard/admin/BookingsSection";

const navigation: SidebarItem[] = [
  { name: "الاحصائيات", icon: ChartBarIcon, tab: "dashboard" },
  { name: "المستخدمين", icon: UsersIcon, tab: "users" },
  { name: "الخدمات", icon: DocumentTextIcon, tab: "services" },
  { name: "الفئات", icon: TagIcon, tab: "categories" },
  { name: "الطلبات", icon: BriefcaseIcon, tab: "bookings" },
];

export default function AdminDashboardPage() {
  const { user, loading} = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: statsData } = useQuery(GET_STATS);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <DashboardSidebar
        userName={user?.name}
        items={navigation}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 transition-all duration-300 md:ml-72">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {navigation.find((item) => item.tab === activeTab)?.name}
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            {activeTab === "dashboard" && <DashboardStats stats={statsData?.dashboardStats} />}
            {activeTab === "categories" && <CategoriesSection />}
            {activeTab === "bookings" && <BookingsSection />}

            {activeTab === "services" && <ServicesSection />}
            {activeTab === "users" && <UsersSection />}
          </div>
        </div>
      </main>
    </div>
  );
}