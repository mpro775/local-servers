// src/models/Review.ts
import { Schema, model, Types } from "mongoose";

interface IReview {
  service: Types.ObjectId;
  user: Types.ObjectId;
  booking: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: () => new Date() },
});

export default model<IReview>("Review", reviewSchema);
