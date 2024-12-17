import { GraphQLList, GraphQLObjectType } from "graphql";

import AdminService from "./admin.service";

import {
  TopBuyerType,
  TopRatedListingType,
  TopRatedSellerType,
} from "./admin.graphql";

import { protectedResolver } from "../../guards/auth.guard";

const adminService = new AdminService();

const AdminQueries = new GraphQLObjectType({
  name: "AdminQueryType",
  fields: {
    getTopRatedSellers: {
      type: new GraphQLList(TopRatedSellerType),
      resolve: protectedResolver(async (_, __, { user }) => {
        return await adminService.getTopRatedSellers(user.userId);
      }),
    },
    getTopRatedListings: {
      type: new GraphQLList(TopRatedListingType),
      resolve: protectedResolver(async (_, __, { user }) => {
        return await adminService.getTopRatedListings(user.userId);
      }),
    },
    getTopBuyers: {
      type: new GraphQLList(TopBuyerType),
      resolve: protectedResolver(async (_, __, { user }) => {
        return await adminService.getTopBuyers(user.userId);
      }),
    },
  },
});

export { AdminQueries };
