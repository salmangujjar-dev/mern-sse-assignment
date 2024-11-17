import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import RatingService from "./rating.service";

import { protectedResolver } from "../../guards/auth.guard";
import { BookingWithRatingType } from "./rating.graphql";

const ratingService = new RatingService();

const RatingMutations = new GraphQLObjectType({
  name: "RatingMutations",
  fields: {
    rateBooking: {
      type: BookingWithRatingType,
      args: {
        bookingId: { type: new GraphQLNonNull(GraphQLString) },
        bookingRating: { type: new GraphQLNonNull(GraphQLInt) },
        sellerRating: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: protectedResolver(
        async (_, { bookingId, bookingRating, sellerRating }, { user }) => {
          return await ratingService.rate(
            user.userId,
            bookingId,
            bookingRating,
            sellerRating
          );
        }
      ),
    },
  },
});

export { RatingMutations };
