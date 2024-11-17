import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
} from "graphql";

import UserType from "../users/user.graphql";
import ListingType from "../listings/listing.graphql";

const TopRatedSellerType = new GraphQLObjectType({
  name: "TopRatedSeller",
  fields: () => ({
    _id: { type: GraphQLID },
    user: { type: UserType },
    averageRating: { type: GraphQLFloat },
  }),
});

const TopRatedListingType = new GraphQLObjectType({
  name: "TopRatedLising",
  fields: () => ({
    _id: { type: GraphQLID },
    listing: { type: ListingType },
    averageRating: { type: GraphQLFloat },
  }),
});

const TopBuyerType = new GraphQLObjectType({
  name: "TopBuyers",
  fields: () => ({
    _id: { type: GraphQLID },
    user: { type: UserType },
    totalBookings: { type: GraphQLInt },
  }),
});

export { TopRatedSellerType, TopRatedListingType, TopBuyerType };
