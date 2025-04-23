// src/models/Service.ts
import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "./User";
import { ICategory } from "./Category";
import { ServiceStatus } from "../types"; // Enum للحالة

export interface ILocation {
  type: string;
  coordinates: number[];
}

export interface IImage {
  url: string;
  key: string;
}
export interface PopulatedService extends Omit<IService, "provider"> {
  provider: IUser; // When populated
}

export interface IService extends Document {
  title: string;
  category: Types.ObjectId | ICategory;
  description?: string;
  price: number;
  images: IImage[];
  address: string;
  location?: ILocation;
  provider: Types.ObjectId | IUser;
  status: ServiceStatus;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String },
    price: {
      type: Number,
      required: true, // إجباري
    },
    images: [
      {
        url: { type: String, required: true },
        key: { type: String, required: true },
      },
    ],
    address: {
      type: String,
      required: [true, "العنوان مطلوب"],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: [true, "الموقع الجغرافي مطلوب"],
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (coords: number[]) => {
            return (
              coords.length === 2 &&
              coords[0] >= -180 &&
              coords[0] <= 180 && // خط الطول
              coords[1] >= -90 &&
              coords[1] <= 90
            ); // خط العرض
          },
          message: "إحداثيات موقع غير صالحة",
        },
      },
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      transform: (id: any) => id.toString(), // تحويل أثناء الاستعلام
    },
    status: {
      type: String,
      enum: Object.values(ServiceStatus),
      default: ServiceStatus.ACTIVE,
    },
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

// لجعل الموقع قابلاً للفلترة الجغرافية
serviceSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "service",
});
serviceSchema.index({ location: "2dsphere" });

export default model<IService>("Service", serviceSchema);
