import { StatusCodes } from "http-status-codes";

import RatingService from "../ratings/rating.service";

import Booking from "./booking.schema";
import Listing from "../listings/listing.schema";

import Logger from "../../utils/Logger";
import CustomError from "../../utils/CustomError";

class BookingService {
  private readonly logger = new Logger(BookingService.name);

  private rateSerivce: RatingService;

  constructor() {
    this.rateSerivce = new RatingService();
  }

  async book(userId: string, listingId: string) {
    try {
      const listing = await Listing.findById(listingId);

      if (!listing) {
        throw new CustomError("Listing not found!", StatusCodes.NOT_FOUND);
      }

      if (listing.user?.toString() === userId) {
        throw new CustomError(
          "Cannot book your own listing",
          StatusCodes.FORBIDDEN
        );
      }

      const booking = new Booking({ listing: listingId, user: userId });
      await booking.save();

      await booking.populate([
        { path: "listing", populate: "user" },
        { path: "user" },
      ]);

      return booking;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async markAsComplete(userId: string, bookingId: string) {
    try {
      const booking = await Booking.findById(bookingId).populate("listing");

      if (!booking) {
        throw new CustomError("Booking not found!", StatusCodes.NOT_FOUND);
      }

      if (booking.listing?.user?.toString() !== userId) {
        throw new CustomError(
          "You are not authorized to complete this booking",
          StatusCodes.FORBIDDEN
        );
      }

      if (booking.isCompleted) {
        throw new CustomError(
          "Booking is already completed",
          StatusCodes.BAD_REQUEST
        );
      }

      booking.isCompleted = true;
      await booking.save();

      await booking.populate([
        { path: "listing", populate: "user" },
        { path: "user" },
      ]);

      return booking;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }
}

export default BookingService;
