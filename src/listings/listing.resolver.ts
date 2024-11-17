import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";

import ListingService from "./listing.service";

import { protectedResolver } from "../../guards/auth.guard";

import ListingType from "./listing.graphql";

const listingService = new ListingService();

const ListingMutations = new GraphQLObjectType({
  name: "ListingMutations",
  fields: {
    createListing: {
      type: ListingType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: protectedResolver(async (_, { title }, { user }) => {
        return await listingService.create(user.userId, title);
      }),
    },
    updateListing: {
      type: ListingType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
      },
      resolve: protectedResolver(async (_, { id, title }, { user }) => {
        return await listingService.update(user.userId, id, title);
      }),
    },
    deleteListing: {
      type: new GraphQLObjectType({
        name: "DeleteListingMessage",
        fields: {
          message: { type: GraphQLString },
        },
      }),
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: protectedResolver(async (_, { id }, { user }) => {
        return await listingService.delete(user.userId, id);
      }),
    },
  },
});

export { ListingMutations };
