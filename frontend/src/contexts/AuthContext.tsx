"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { IUser, LoginOptions, RegisterArgs } from "@/types";
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
} from "@/lib/repositories/UserRepository";

// --- أنواع السياق ---
interface AuthContextProps {
  user: IUser | null;
  loading: boolean;
  register: (data: RegisterArgs) => Promise<void>;
  login: (
    email: string,
    password: string,
    options?: LoginOptions
  ) => Promise<void>;
  logout: () => Promise<void>;
}

// --- إنشاء السياق ---
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  // ✅ لا تقم بتسجيل خروج الأدمن بسبب onAuthStateChanged
  useEffect(() => {
    const localToken = localStorage.getItem("token");

    const checkAdminSession = async () => {
      try {
        // ✅ إرسال طلب خاص للتحقق من جلسة الأدمن
        const { data } = await loginMutation({
          variables: { input: { adminSessionCheck: true } },
          context: { headers: { Authorization: `Bearer ${localToken}` } },
        });

        if (data?.login?.user?.role === "ADMIN") {
          const u = data.login.user;
          setUser({
            id: u.id,
            email: u.email,
            role: u.role,
            name: u.name,
            phone: u.profile?.phone,
            description: u.profile?.description,
          });
          return;
        }
      } catch (err) {
        console.error("Admin session check failed:", err);
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    };

    if (localToken && !user) {
      checkAdminSession();
      return; // توقف هنا لتجنب تنفيذ Firebase listener
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (user?.role === "ADMIN") return; // تجاهل إذا كان أدمن

      if (fbUser) {
        try {
          const { data } = await loginMutation({
            variables: { input: { firebaseUID: fbUser.uid } },
          });

          if (data?.login) {
            localStorage.setItem("token", data.login.token);
            const u = data.login.user;
            setUser({
              id: u.id,
              email: u.email,
              role: u.role,
              name: u.name,
              phone: u.profile?.phone,
              description: u.profile?.description,
            });
          }
        } catch (err) {
          console.error("Firebase auto-login failed:", err);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [loginMutation, user?.role]);

  // --- تسجيل مستخدم جديد ---
  const register = async ({
    email,
    password,
    name,
    role,
    phone,
    description,
  }: RegisterArgs) => {
    const fbCred = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUID = fbCred.user.uid;

    const { data } = await registerMutation({
      variables: {
        input: {
          email,
          password,
          name,
          role,
          phone,
          description,
          firebaseUID,
        },
      },
    });

    if (data?.register) {
      const { token, user: u } = data.register;
      localStorage.setItem("token", token);
      const usr: IUser = {
        id: u.id,
        email: u.email,
        role: u.role,
        name: u.name,
        phone: u.profile?.phone,
        description: u.profile?.description,
      };
      setUser(usr);
      router.push(role === "PROVIDER" ? "/dashboard/provider" : "/");
    }
  };

  // --- تسجيل الدخول ---
  const login = async (
    email: string,
    password: string,
    options?: { useFirebase?: boolean }
  ) => {
    try {
      let firebaseUID: string | undefined;

      // 1. تسجيل الدخول عبر Firebase للمستخدمين العاديين
      if (options?.useFirebase) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        firebaseUID = userCredential.user.uid;
      }

      // 2. إرسال طلب تسجيل الدخول للخادم
      const { data } = await loginMutation({
        variables: {
          input: {
            email,
            password,
            firebaseUID,
          },
        },
      });

      if (data?.login) {
        // 3. حفظ التوكن في localStorage
        localStorage.setItem("token", data.login.token);
        const u = data.login.user;

        // 4. معالجة حالة الأدمن
        if (u.role === "ADMIN") {
          setUser({
            id: u.id,
            email: u.email,
            role: u.role,
            name: u.name,
            phone: u.profile?.phone,
            description: u.profile?.description,
          });
          router.push("/dashboard/admin");
          return;
        }

        // 5. معالجة المستخدمين العاديين
        setUser({
          id: u.id,
          email: u.email,
          role: u.role,
          name: u.name,
          phone: u.profile?.phone,
          description: u.profile?.description,
        });

        // 6. التوجيه حسب نوع المستخدم
        router.push(u.role === "PROVIDER" ? "/dashboard/provider" : "/");
      }
    } catch (err) {
      // 7. معالجة الأخطاء
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("بيانات الدخول غير صحيحة");
    }
  };

  // --- تسجيل الخروج ---
  const logout = async () => {
    if (user?.role !== "ADMIN") {
      await firebaseSignOut(auth).catch(() => {});
    }
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
