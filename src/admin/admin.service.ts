import { StatusCodes } from "http-status-codes";

import User from "../users/user.schema";
import Booking from "../bookings/booking.schema";

import CustomError from "../../utils/CustomError";
import Logger from "../../utils/Logger";

class AdminService {
  private readonly logger = new Logger(AdminService.name);

  private async findAdminUser(adminId: string) {
    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      throw new CustomError("Admin User not found", StatusCodes.NOT_FOUND);
    }
    return adminUser;
  }

  async getTopRatedSellers(adminId: string) {
    try {
      await this.findAdminUser(adminId);

      const users = await Booking.aggregate([
        {
          $lookup: {
            from: "listings",
            localField: "listing",
            foreignField: "_id",
            as: "listing",
          },
        },
        {
          $lookup: {
            from: "ratings",
            localField: "rating",
            foreignField: "_id",
            as: "rating",
          },
        },
        {
          $unwind: "$listing",
        },
        {
          $unwind: "$rating",
        },
        {
          $lookup: {
            from: "users",
            localField: "listing.user",
            foreignField: "_id",
            as: "listing.user",
          },
        },
        {
          $unwind: "$listing.user",
        },
        {
          $match: {
            rating: { $ne: null },
          },
        },
        {
          $group: {
            _id: "$listing.user._id",
            user: { $first: "$listing.user" },
            averageRating: {
              $avg: "$rating.sellerRating",
            },
          },
        },
        {
          $addFields: {
            "user.id": "$user._id",
          },
        },
        {
          $sort: { averageRating: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      return users;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async getTopRatedListings(adminId: string) {
    try {
      await this.findAdminUser(adminId);

      const users = await Booking.aggregate([
        {
          $lookup: {
            from: "listings",
            localField: "listing",
            foreignField: "_id",
            as: "listing",
          },
        },
        {
          $lookup: {
            from: "ratings",
            localField: "rating",
            foreignField: "_id",
            as: "rating",
          },
        },
        {
          $unwind: "$listing",
        },
        {
          $unwind: "$rating",
        },
        {
          $lookup: {
            from: "users",
            localField: "listing.user",
            foreignField: "_id",
            as: "listing.user",
          },
        },
        {
          $unwind: "$listing.user",
        },
        {
          $match: {
            rating: { $ne: null },
          },
        },
        {
          $addFields: {
            "listing.user.id": "$listing.user._id",
          },
        },
        {
          $group: {
            _id: "$listing._id",
            listing: { $first: "$listing" },
            averageRating: {
              $avg: "$rating.bookingRating",
            },
          },
        },

        {
          $sort: { averageRating: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      return users;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async getTopBuyers(adminId: string) {
    try {
      await this.findAdminUser(adminId);

      const users = await Booking.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $group: {
            _id: "$user._id",
            user: { $first: "$user" },
            totalBookings: {
              $sum: 1,
            },
          },
        },
        {
          $addFields: {
            "user.id": "$user._id",
          },
        },
        {
          $sort: { totalBookings: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      return users;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }
}

export default AdminService;
