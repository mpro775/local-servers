// components/ServiceBadge.tsx
import { ServiceStatus } from '@/types';
import { cn } from '@/utils/utils';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { JSX } from 'react';


interface ServiceBadgeProps {
  status: ServiceStatus | string; // 2. السماح بقيم إضافية ك string
  className?: string;
}

export default function ServiceBadge({ status, className }: ServiceBadgeProps) {
  const statusConfig: Record<string, {
    text: string;
    bg: string;
    textColor: string;
    icon: JSX.Element;
  }> = {
    ACTIVE: {
      text: 'متاح الآن',
      bg: 'bg-green-100',
      textColor: 'text-green-800',
      icon: <ExclamationTriangleIcon className="w-4 h-4" />,
    },
    BUSY: {
      text: 'مشغول حالياً',
      bg: 'bg-amber-100',
      textColor: 'text-amber-800',
      icon: <ExclamationTriangleIcon className="w-4 h-4" />,
    },
    INACTIVE: {
      text: 'غير متاح',
      bg: 'bg-red-100',
      textColor: 'text-red-800',
      icon: <ExclamationTriangleIcon className="w-4 h-4" />,
    },
    // 4. إضافة حالة افتراضية للقيم غير المعروفة
    UNKNOWN: {
      text: 'حالة غير معروفة',
      bg: 'bg-gray-100',
      textColor: 'text-gray-800',
      icon: <ExclamationTriangleIcon className="w-4 h-4" />,
    }
  };

  // 5. التحقق من وجود الحالة في الكائن
  const configKey = status in statusConfig ? status : 'UNKNOWN';
  
  const { text, bg, textColor, icon } = statusConfig[configKey];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
        bg,
        textColor,
        className
      )}
    >
      {icon}
      {text}
    </div>
  );
}