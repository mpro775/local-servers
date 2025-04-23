// src/pages/provider/dashboard.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useQuery } from '@apollo/client';
import { Service } from '@/types';
import DashboardSidebar, { SidebarItem } from '@/components/common/DashboardSidebar';
import { NewServiceForm } from '@/components/dashboard/provider/Services/NewServiceForm';
import { DashboardStats } from '@/components/dashboard/provider/Stats';
import { ServicesList } from '@/components/dashboard/provider/Services/ServicesList';
import { AllBookingsTable } from '@/components/dashboard/provider/BookingsPanel';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  UserCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import EditProfileForm from '@/components/dashboard/user/EditProfileForm';
import { GET_CATEGORIES } from '@/lib/repositories/CategoryRepository';
import { GET_DASHBOARD_DATA } from '@/lib/repositories/ProvidersRepository';




const navigation: SidebarItem[] = [
  { name: 'الإحصائيات', icon: ChartBarIcon, tab: 'stats' },
  { name: 'الخدمات', icon: DocumentTextIcon, tab: 'services' },
  { name: 'الحجوزات', icon: CalendarIcon, tab: 'bookings' },
  { name: 'الملف الشخصي', icon: UserCircleIcon, tab: 'profile' },
];

export default function ProviderDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stats');
  const [showNewServiceForm, setShowNewServiceForm] = useState(false);

  const { 
    loading: dataLoading, 
    error, 
    data, 
    refetch 
  } = useQuery(GET_DASHBOARD_DATA);

  const { 
    data: categoriesData,

  } = useQuery(GET_CATEGORIES);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'PROVIDER')) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleRefetch = () => refetch();

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
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-800">
              {navigation.find((item) => item.tab === activeTab)?.name}
            </h1>
            
            {activeTab === 'services' && (
              <button
                onClick={() => setShowNewServiceForm(!showNewServiceForm)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all"
              >
                {showNewServiceForm ? 'إغلاق النموذج' : 'خدمة جديدة'}
              </button>
            )}
          </div>

          {/* Content */}
          {error ? (
            <div className="bg-red-100 p-4 rounded-lg text-red-700">
              خطأ في تحميل البيانات
              <button onClick={handleRefetch} className="mr-2 text-blue-600 hover:underline">
                إعادة المحاولة
              </button>
            </div>
          ) : dataLoading ? (
            <div className="space-y-8 animate-pulse">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200/80 rounded-xl" />
                ))}
              </div>
              <div className="h-96 bg-gray-200/80 rounded-xl" />
            </div>
          ) : (
            <>
              {activeTab === 'stats' && <DashboardStats data={data?.providerDashboard} />}
              
              {activeTab === 'services' && (
                <div className="space-y-8">
                  {showNewServiceForm && (
                     <NewServiceForm 
                          onSuccess={() => {
                            handleRefetch();
                            setShowNewServiceForm(false);
                          }}
                          onCancel={() => setShowNewServiceForm(false)}
                          categories={categoriesData?.allCategories || []}
                        />
                  )}
                  <ServicesList 
                    services={data?.myServices as Service[]} 
                    onUpdate={handleRefetch}
                  />
                </div>
              )}

              {activeTab === 'bookings' && <AllBookingsTable />}
              
              {activeTab === 'profile' && <EditProfileForm />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}