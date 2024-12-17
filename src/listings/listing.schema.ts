// Import necessary modules
import mongoose, { Schema, Document } from "mongoose";

import { IUser } from "../users/user.schema";

// Define the interface for Listing document
export interface IListing extends Document {
  title: string;
  user: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
}

// Create a schema for the Listing model
const listingSchema: Schema<IListing> = new Schema(
  {
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Create and export the Listing model
export default mongoose.model<IListing>("Listing", listingSchema);
