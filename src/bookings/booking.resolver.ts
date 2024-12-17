import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import BookingService from "./booking.service";

import BookingType from "./booking.graphql";

import { protectedResolver } from "../../guards/auth.guard";

const bookingService = new BookingService();

const BookingMutations = new GraphQLObjectType({
  name: "BookingMutations",
  fields: {
    bookListing: {
      type: BookingType,
      args: {
        listingId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: protectedResolver(async (_, { listingId }, { user }) => {
        return await bookingService.book(user.userId, listingId);
      }),
    },
    markAsComplete: {
      type: BookingType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: protectedResolver(async (_, { id }, { user }) => {
        return await bookingService.markAsComplete(user.userId, id);
      }),
    },
  },
});

export { BookingMutations };
