import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";

import AuthType from "./auth.graphql";

import AuthService from "./auth.service";

import { protectedResolver } from "../../guards/auth.guard";

const authService = new AuthService();

const AuthMutations = new GraphQLObjectType({
  name: "AuthMutation",
  fields: {
    signUp: {
      type: AuthType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, username, password }) => {
        return await authService.signUp({
          email,
          username,
          password,
        });
      },
    },

    login: {
      type: AuthType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { username, password }) => {
        return await authService.login({
          username,
          password,
        });
      },
    },

    switchRole: {
      type: AuthType,
      resolve: protectedResolver(async (_, {}, context) => {
        return await authService.switchRole(context.user);
      }),
    },
  },
});

export { AuthMutations };
