export interface User {
  id: string;
  email: string;
  role: "USER" | "PROVIDER" | "ADMIN";
  name?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  avgRating?: number;
}

export interface Image {
  url: string;
  key?: string; // مفتاح الملف إن أردت استخدامه في الرفع/الحذف
}

export interface Category {
  id: string;
  name: string;
  image: Image;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface ServicesResult {
  services: Service[]; // المصفوفة الحقيقية هنا
  totalCount: number;
  __typename: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  images: Image[];
  address: string;
  status: string;
  location?: Location;
  category: Category;
  provider: {
    name: string;
    avgRating?: number;
    __typename?: string;
  };
  createdAt?: string | null;
  __typename?: string;
}

export interface Location {
  type: string; // عادة "Point"
  coordinates: [number, number]; // [longitude, latitude]
}

export enum ServiceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BUSY = "BUSY",
}

export interface Booking {
  id: string;
  service: Service;
  user: User;
  bookingDate: Date;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  isPaid: boolean;
  isCancelable: boolean;
  canComplete: boolean;
}

export enum RequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  PAID = "PAID",
}

export interface IProvider {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface UpdateCategoryVariables {
  id: string;
  input: {
    name?: string;
    image?: File;
  };
}

export interface IUser {
  id: string;
  email: string;
  role: "USER" | "PROVIDER" | "ADMIN";
  name?: string;
  phone?: string;
  description?: string;
}

export interface RegisterArgs {
  email: string;
  password: string;
  name: string;
  role: "USER" | "PROVIDER";
  phone: string;
  description: string;
}
export interface LoginOptions {
  useFirebase?: boolean; // نحدد هل نستخدم Firebase أو لا
}

export interface StatsType {
  totalUsers?: number;
  totalProviders?: number;
  totalServices?: number;
  totalBookings?: number;
}
export interface StatCardProps {
  title: string;
  value?: number;
  color: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface BookingRow {
  id: string;
  service: { title: string };
  user:    { name: string };
  bookingDate: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
}