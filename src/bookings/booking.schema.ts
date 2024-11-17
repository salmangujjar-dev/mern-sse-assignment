import mongoose, { Schema, Document } from "mongoose";

import { IUser } from "../users/user.schema";
import { IListing } from "../listings/listing.schema";

export interface IBooking extends Document {
  listing: IListing["_id"];
  user: IUser["_id"];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema<IBooking> = new Schema(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", bookingSchema);
