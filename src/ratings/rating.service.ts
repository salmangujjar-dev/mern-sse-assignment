import { StatusCodes } from "http-status-codes";

import Rating from "./rating.schema";
import Booking from "../bookings/booking.schema";

import Logger from "../../utils/Logger";
import CustomError from "../../utils/CustomError";

class RatingService {
  private readonly logger = new Logger(RatingService.name);

  async create(bookingId: string, sellerRating: number, bookingRating: number) {
    try {
      const rating = new Rating({ bookingId, sellerRating, bookingRating });
      await rating.save();

      return rating;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async rate(
    userId: string,
    bookingId: string,
    sellerRating: number,
    bookingRating: number
  ) {
    try {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new CustomError("Booking not found!", StatusCodes.NOT_FOUND);
      }

      if (booking.user?.toString() !== userId) {
        throw new CustomError(
          "You aren't authorized to rate this booking.",
          StatusCodes.FORBIDDEN
        );
      }

      if (!booking?.isCompleted) {
        throw new CustomError(
          "Booking isn't completed yet!",
          StatusCodes.FORBIDDEN
        );
      }

      if (booking?.rating !== null) {
        throw new CustomError(
          "Rating update is not allowed",
          StatusCodes.FORBIDDEN
        );
      }

      const rating = await this.create(bookingId, sellerRating, bookingRating);

      booking.rating = rating._id;
      await booking.save();

      await booking.populate([
        { path: "listing", populate: "user" },
        { path: "user" },
      ]);

      return { booking, rating };
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }
}

export default RatingService;
