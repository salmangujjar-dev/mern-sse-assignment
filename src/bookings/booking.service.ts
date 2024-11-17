import { StatusCodes } from "http-status-codes";

import Booking from "./booking.schema";
import Listing from "../listings/listing.schema";

import Logger from "../../utils/Logger";
import CustomError from "../../utils/CustomError";

class BookingService {
  private readonly logger = new Logger(BookingService.name);

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

      await booking.populate("listing user");

      return booking;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }
}

export default BookingService;
