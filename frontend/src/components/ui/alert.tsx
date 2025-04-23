// src/components/ui/alert.tsx
export const Alert = ({ 
  variant = 'default',
  className,
  children 
}: { 
  variant?: 'default' | 'destructive',
  className?: string,
  children: React.ReactNode 
}) => (
  <div className={`p-4 rounded-lg ${
    variant === 'destructive' 
      ? 'bg-red-100 text-red-700' 
      : 'bg-blue-100 text-blue-700'
  } ${className}`}>
    {children}
  </div>
);

export const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm">{children}</p>
);