import mongoose, { Schema, Document } from "mongoose";

export interface IRating extends Document {
  bookingRating: Number;
  sellerRating: Number;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema: Schema<IRating> = new Schema(
  {
    bookingRating: { type: Number, default: 0, min: 0, max: 5 },
    sellerRating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

export default mongoose.model<IRating>("Rating", ratingSchema);
