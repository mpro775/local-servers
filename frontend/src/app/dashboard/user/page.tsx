'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import {
  UserCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

import DashboardSidebar, { SidebarItem } from '@/components/common/DashboardSidebar';
import EditProfileForm from '@/components/dashboard/user/EditProfileForm';
import MyBookingsList from '@/components/dashboard/user/Booking/MyBookingsList';
import LoadingSpinner from '@/components/common/LoadingSpinner';



export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bookings');

  const navigation: SidebarItem[] = [
    { name: 'حجوزاتي', icon: CalendarIcon, tab: 'bookings' },
    { name: 'الملف الشخصي', icon: UserCircleIcon, tab: 'profile' },
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col md:flex-row">
      {/* Sidebar */}
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
            <h1 className="text-3xl font-bold text-blue-800">
              {navigation.find((item) => item.tab === activeTab)?.name}
            </h1>
          </div>

          {activeTab === 'bookings' && <MyBookingsList />}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <EditProfileForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
