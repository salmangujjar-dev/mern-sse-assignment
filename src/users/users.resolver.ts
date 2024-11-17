import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";
import { StatusCodes } from "http-status-codes";

import UserService from "./users.service";

import UserType from "./user.graphql";

import { protectedResolver } from "./../../guards/auth.guard";

import CustomError from "../../utils/CustomError";

const userService = new UserService();

// Queries
const UserQueries = new GraphQLObjectType({
  name: "UserQueryType",
  fields: {
    // Todo: Only Admin User can fetch All the users.
    users: {
      type: new GraphQLList(UserType),
      resolve: protectedResolver(async (_, __, { user }) => {
        if (!user.isAdmin) {
          throw new CustomError("Not authorized", StatusCodes.FORBIDDEN);
        }
        return await userService.getAllUsers(user.userId);
      }),
    },

    // Todo: Only Admin user and the user himself can fetch their data.
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve: protectedResolver(async (_, args, { user }) => {
        if (!user.isAdmin && args.id && user.userId !== args.id) {
          throw new CustomError("Not authorized", StatusCodes.FORBIDDEN);
        }
        const userId = user.isAdmin ? args.id : user.userId;
        return await userService.getUser(userId, user.userId);
      }),
    },
  },
});

// Mutations
const UserMutations = new GraphQLObjectType({
  name: "UserMutations",
  fields: {
    // Todo: Only Admin user can update another to become an admin
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLString },
        isAdmin: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve: protectedResolver(async (_, args, { user }) => {
        if (!user.isAdmin && args.id && user.userId !== args.id) {
          throw new CustomError("Not authorized", StatusCodes.FORBIDDEN);
        }
        const userId = user.isAdmin ? args.id : user.userId;
        const adminCtx = user.isAdmin;
        return await userService.updateUser(
          {
            ...args,
            adminCtx,
            id: userId,
          },
          user.userId
        );
      }),
    },

    // Only Admin user and the user himself can delete their account.
    deleteUser: {
      type: new GraphQLObjectType({
        name: "DeleteUserMessage",
        fields: {
          message: { type: GraphQLString },
        },
      }),
      args: { id: { type: GraphQLString } },
      resolve: protectedResolver(async (_, args, { user }) => {
        if (!user.isAdmin && args.id && user.userId !== args.id) {
          throw new CustomError("Not authorized", StatusCodes.FORBIDDEN);
        }
        const userId = user.isAdmin ? args.id : user.userId;
        return await userService.deleteUser(userId, user.userId);
      }),
    },
  },
});

export { UserMutations, UserQueries };
