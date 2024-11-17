import Listing from "./listing.schema";

import Logger from "../../utils/Logger";
import CustomError from "../../utils/CustomError";

class ListingService {
  private readonly logger = new Logger(ListingService.name);

  async create(userId: string, title: string) {
    try {
      const listing = new Listing({ title, user: userId });
      await listing.save();

      await listing.populate("user");

      return listing;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async update(userId: string, listingId: string, title: string) {
    try {
      const listing = await Listing.findOneAndUpdate(
        { _id: listingId, user: userId },
        { title },
        { new: true }
      );

      if (!listing) {
        throw new CustomError("Listing not found or not authorized");
      }

      await listing.populate("user");

      return listing;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async delete(userId: string, listingId: string) {
    try {
      const listing = await Listing.findOneAndDelete({
        _id: listingId,
        user: userId,
      });

      if (!listing) {
        throw new CustomError("Listing not found or not authorized");
      }

      return { message: "Listing deleted successfully" };
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }
}

export default ListingService;
