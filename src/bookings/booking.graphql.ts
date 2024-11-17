import { GraphQLBoolean, GraphQLObjectType } from "graphql";

import UserType from "../users/user.graphql";
import ListingType from "../listings/listing.graphql";

const BookingType = new GraphQLObjectType({
  name: "BookingPayload",
  fields: () => ({
    listing: { type: ListingType },
    user: { type: UserType },
    isCompleted: { type: GraphQLBoolean },
  }),
});

export default BookingType;
