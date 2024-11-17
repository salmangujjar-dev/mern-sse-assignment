import mongoose, { Schema, Document } from "mongoose";

import { IUser } from "../users/user.schema";
import { IListing } from "../listings/listing.schema";
import { IRating } from "../ratings/rating.schema";

export interface IBooking extends Document {
  listing: IListing["_id"] & IListing;
  user: IUser["_id"];
  isCompleted: boolean;
  rating: IRating["_id"] | null;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema<IBooking> = new Schema(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Schema.Types.ObjectId, ref: "Rating", default: null },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", bookingSchema);
