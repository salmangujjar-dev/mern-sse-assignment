import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} from "graphql";

import BookingType from "../bookings/booking.graphql";

const RatingType = new GraphQLObjectType({
  name: "RatingPayload",
  fields: () => ({
    id: { type: GraphQLID },
    bookingRating: { type: GraphQLInt, defaultValue: 0, min: 1, max: 5 },
    sellerRating: { type: GraphQLInt, defaultValue: 0, min: 1, max: 5 },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

export const BookingWithRatingType = new GraphQLObjectType({
  name: "BookingWithRatingPayload",
  fields: {
    rating: { type: RatingType },
    booking: { type: BookingType },
  },
});

export default RatingType;
