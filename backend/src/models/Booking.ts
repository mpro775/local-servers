// src/models/Booking.ts
import { Schema, model, Document, Types } from "mongoose";
import { IService } from "./Service";
import { IUser } from "./User";
import { RequestStatus } from "../types";

export interface IBooking extends Document {
  id: string;
  service: Types.ObjectId | IService;
  user: Types.ObjectId | IUser;
  bookingDate: Date;
  status: RequestStatus;
  isPaid: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookingDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.PENDING,
    },
    isPaid: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);


export default model<IBooking>("Booking", bookingSchema);
