import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import User, { IUser } from "./../../models/User";
import { generateToken } from "../../utils/auth";
import { LoginInput, RegisterInput } from "../../types";
import Service from "../../models/Service";
import Booking from "../../models/Booking";
import jwt from "jsonwebtoken";

interface Context {
  user?: { id: string; email: string; role: "USER" | "PROVIDER" | "ADMIN" };
}

const userResolvers = {
  Query: {
    me: async (
      _: unknown,
      __: unknown,
      { user }: Context
    ): Promise<IUser | null> => {
      if (!user)
        throw new GraphQLError("غير مصرح", {
          extensions: { code: "UNAUTHORIZED" },
        });
      return await User.findById(user.id);
    },

    adminUsers: async (
      _: any,
      { role }: { role?: string },
      { user }: Context
    ) => {
      if (!user || user.role !== "ADMIN") throw new GraphQLError("غير مصرح");
      const filter: any = {};
      if (role) filter.role = role;
      return await User.find(filter);
    },

    allProviders: async (_: unknown, __: unknown, { user }: Context) => {
      if (!user || user.role !== "ADMIN")
        throw new GraphQLError("غير مصرح", {
          extensions: { code: "FORBIDDEN" },
        });
      return await User.find({ role: "PROVIDER" });
    },

    dashboardStats: async () => {
      const totalUsers = await User.countDocuments({ role: "USER" });
      const totalProviders = await User.countDocuments({ role: "PROVIDER" });
      const totalServices = await Service.countDocuments();
      const totalBookings = await Booking.countDocuments();

      return { totalUsers, totalProviders, totalServices, totalBookings };
    },
  },

  User: {
    avgRating: async (parent: IUser) => {
      const ratings = parent.profile?.ratings || [];
      if (ratings.length === 0) return 0;
      return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    },
  },

  Mutation: {
    register: async (_: unknown, { input }: { input: RegisterInput }) => {
      const existingUser = await User.findOne({
        $or: [{ email: input.email }, { firebaseUID: input.firebaseUID }],
      });

      if (existingUser) throw new Error("البريد الإلكتروني مسجل مسبقاً");

      const hashed = await bcrypt.hash(input.password, 12);

      const user = await User.create({
        email: input.email,
        password: hashed,
        name: input.name,
        role: input.role,
        firebaseUID: input.firebaseUID,
        profile: {
          phone: input.phone,
          description: input.description,
        },
      });

      return {
        token: generateToken(user),
        user: user.toObject(),
      };
    },

    login: async (
      _: unknown,
      { input }: { input: LoginInput },
      context: { token?: string } // إضافة context كمعامل
    ) => {
      let user: IUser | null = null;

      if (input.adminSessionCheck) {
        // التحقق من وجود التوكن في السياق
        if (!context.token) {
          throw new GraphQLError("طلب غير مصرح - توكن مفقود");
        }

        // فك تشفير التوكن
        const decoded = verifyToken(context.token.replace("Bearer ", ""));

        // البحث عن المستخدم
        user = await User.findById(decoded.userId);

        if (!user || user.role !== "ADMIN") {
          throw new GraphQLError("صلاحيات غير كافية");
        }

        return {
          token: context.token,
          user: user.toJSON(),
        };
      }

      // باقي منطق الدخول للمستخدمين العاديين
      if (input.firebaseUID) {
        user = await User.findOne({ firebaseUID: input.firebaseUID });
      } else if (input.email && input.password) {
        user = await User.findOne({ email: input.email }).select("+password");

        if (!user || !(await bcrypt.compare(input.password, user.password))) {
          throw new GraphQLError("بيانات الدخول غير صحيحة");
        }
      }

      if (!user) {
        throw new GraphQLError("المستخدم غير موجود");
      }

      if (!user.isActive && user.role !== "ADMIN") {
        throw new GraphQLError("الحساب معطل - يرجى التواصل مع الدعم");
      }

      // إنشاء توكن جديد للمستخدمين العاديين
      const newToken = generateToken(user);

      return {
        token: newToken,
        user: user.toJSON(),
      };
    },

    registerAdmin: async (
      _: unknown,
      {
        email,
        password,
        name,
      }: { email: string; password: string; name?: string }
    ) => {
      if (await User.findOne({ email }))
        throw new GraphQLError("البريد الإلكتروني مسجل مسبقاً");

      const hashed = await bcrypt.hash(password, 12);
      return await User.create({
        email,
        password: hashed,
        name,
        role: "ADMIN",
      });
    },

    toggleUserStatus: async (
      _: unknown,
      { id }: { id: string },
      { user }: Context
    ) => {
      if (!user || user.role !== "ADMIN")
        throw new GraphQLError("غير مصرح", {
          extensions: { code: "FORBIDDEN" },
        });

      const target = await User.findById(id);
      if (!target) throw new GraphQLError("المستخدم غير موجود");
      if (target.role === "ADMIN")
        throw new GraphQLError("لا يمكن تغيير حالة الأدمن");

      target.isActive = !target.isActive;
      await target.save();
      return target.isActive;
    },
    createUserAsAdmin: async (
      _: any,
      {
        input,
      }: {
        input: {
          name: string;
          email: string;
          password: string;
          role: "USER" | "PROVIDER";
          isActive?: boolean;
        };
      },
      { user }: Context
    ) => {
      if (!user || user.role !== "ADMIN") throw new GraphQLError("غير مصرح");

      const existing = await User.findOne({ email: input.email });
      if (existing) throw new GraphQLError("البريد الإلكتروني مستخدم بالفعل");

      const hashedPassword = await bcrypt.hash(input.password, 12);

      const newUser = await User.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role,
        isActive: input.isActive ?? true,
      });

      return newUser;
    },
    updateMyProfile: async (_: unknown, { input }: any, { user }: Context) => {
      if (!user) throw new GraphQLError("غير مصرح");

      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        {
          $set: {
            name: input.name,
            "profile.phone": input.profile?.phone,
            "profile.address": input.profile?.address,
            "profile.description": input.profile?.description,
          },
        },
        {
          new: true, // إعادة المستند المحدث
          runValidators: true, // تشغيل التحقق من الصحة
          projection: { _id: 1, name: 1, profile: 1 }, // إرجاع الحقول المطلوبة فقط
        }
      )
        .lean() // تحويل إلى كائن عادي
        .select("_id name profile"); // تحديد الحقول المراد إرجاعها

      if (!updatedUser) throw new GraphQLError("فشل في التحديث");

      // تحويل _id إلى id لتتناسب مع المخطط
      return {
        ...updatedUser,
        id: updatedUser._id.toString(),
        profile: updatedUser.profile || {},
      };
    },
  },
};

export default userResolvers;

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
  } catch (error) {
    throw new GraphQLError("جلسة منتهية - يرجى تسجيل الدخول مرة أخرى");
  }
};