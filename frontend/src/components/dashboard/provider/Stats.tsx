// src/components/provider/Stats.tsx
import React from 'react';
import {
  BriefcaseIcon,
  ClockIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface StatsProps {
  data: {
    totalServices: number;
    activeBookings: number;
    completedBookings: number;
    totalEarnings: number;
  };
}

export const DashboardStats: React.FC<StatsProps> = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Total Services Card */}
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-xl group-hover:rotate-12 transition-transform">
          <BriefcaseIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-sm text-blue-600 font-medium">إجمالي الخدمات</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {new Intl.NumberFormat().format(data.totalServices)}
          </p>
        </div>
      </div>
    </div>

    {/* Active Bookings Card */}
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-green-600 rounded-xl group-hover:rotate-12 transition-transform">
          <ClockIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-sm text-green-600 font-medium">الحجوزات النشطة</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {new Intl.NumberFormat().format(data.activeBookings)}
          </p>
        </div>
      </div>
    </div>

    {/* Completed Bookings Card */}
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-600 rounded-xl group-hover:rotate-12 transition-transform">
          <CheckBadgeIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-sm text-purple-600 font-medium">الحجوزات المكتملة</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {new Intl.NumberFormat().format(data.completedBookings)}
          </p>
        </div>
      </div>
    </div>

    {/* Total Earnings Card */}
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-amber-600 rounded-xl group-hover:rotate-12 transition-transform">
          <CurrencyDollarIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-sm text-amber-600 font-medium">إجمالي الأرباح</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(data.totalEarnings)}
          </p>
        </div>
      </div>
    </div>
  </div>
);