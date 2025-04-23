// src/models/User.ts
import { Schema, model, Document, Types } from "mongoose";
import { Role } from "../types"; // استيراد الـ Enum

const profileSchema = new Schema(
  {
    phone: String,
    address: String,
    description: String,
    serviceCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    ratings: [Number],
  },
  { _id: false } // ضروري لأن profile ليس وثيقة مستقلة
);

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  firebaseUID: string;

  password: string;
  role: Role; // استخدام الـ Enum
  name?: string;
  isActive: boolean;
  services?: Types.ObjectId[]; // إضافة للعلاقة مع الخدمات
  createdAt: Date;
  profile?: {
    phone?: string;
    address?: string;
    description?: string;
    serviceCategories?: Types.ObjectId[];
    ratings?: number[];
  };
  walletBalance: number;

  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firebaseUID: {
      type: String,
      required: false, // اجعله غير مطلوب
      unique: true,
      sparse: true, // هذا مفيد لمنع الخطأ عند وجود أكثر من null
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: Object.values(Role), // استخدام قيم الـ Enum
      default: Role.USER,
    },
    walletBalance: { type: Number, default: 0 },

    name: { type: String },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }], // علاقة مع الخدمات
    profile: { type: profileSchema, default: {} },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString(); // تحويل ObjectId إلى String
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default model<IUser>("User", userSchema);
