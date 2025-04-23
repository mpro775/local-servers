import { StatCardProps, StatsType } from "@/types";
import { UsersIcon, BriefcaseIcon, DocumentTextIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";


const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className={`${color} p-6 rounded-xl shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-3xl font-bold mt-2">{value || 0}</p>
      </div>
      <div className={`p-3 rounded-lg ${color.replace("100", "200")}`}>
        <Icon className="h-6 w-6 text-current" />
      </div>
    </div>
  </div>
);

export default function DashboardStats({ stats }: { stats?: StatsType }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="إجمالي المستخدمين" value={stats?.totalUsers} color="bg-blue-100" icon={UsersIcon} />
      <StatCard title="مزودي الخدمات" value={stats?.totalProviders} color="bg-green-100" icon={BriefcaseIcon} />
      <StatCard title="الخدمات المتاحة" value={stats?.totalServices} color="bg-purple-100" icon={DocumentTextIcon} />
      <StatCard title="الطلبات النشطة" value={stats?.totalBookings} color="bg-yellow-100" icon={Cog6ToothIcon} />
    </div>
  );
}
