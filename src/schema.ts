import { GraphQLObjectType, GraphQLSchema } from "graphql";

import { UserQueries, UserMutations } from "./users/users.resolver";
import { AuthMutations } from "./auth/auth.resolver";
import { ListingMutations } from "./listings/listing.resolver";
import { BookingMutations } from "./bookings/booking.resolver";
import { RatingMutations } from "./ratings/rating.resolver";

const rootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    user: {
      type: UserQueries,
      resolve: () => ({}), // Add Root Resolver If Necessary
    },
    // Todo: Add More Resolvers here for each of the defined modules
  },
});

const rootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    user: {
      type: UserMutations,
      resolve: () => ({}),
    },
    auth: {
      type: AuthMutations,
      resolve: () => ({}),
    },
    listing: {
      type: ListingMutations,
      resolve: () => ({}),
    },
    booking: {
      type: BookingMutations,
      resolve: () => ({}),
    },
    rating: {
      type: RatingMutations,
      resolve: () => ({}),
    },
  },
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

export default schema;
