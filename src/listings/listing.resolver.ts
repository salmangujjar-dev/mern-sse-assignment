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
        return await listingService.create(user.id, title);
      }),
    },
    updateListing: {
      type: ListingType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
      },
      resolve: protectedResolver(async (_, { id, title }, { user }) => {
        return await listingService.update(user.id, id, title);
      }),
    },
    deleteListing: {
      type: ListingType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: protectedResolver(async (_, { id }, { user }) => {
        return await listingService.delete(user.id, id);
      }),
    },
  },
});

export { ListingMutations };
