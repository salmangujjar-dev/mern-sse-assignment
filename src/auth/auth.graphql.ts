import { GraphQLObjectType, GraphQLString } from "graphql";

import UserType from "../users/user.graphql";

const AuthType = new GraphQLObjectType({
  name: "AuthPayload",
  fields: () => ({
    accessToken: { type: GraphQLString },
    user: { type: UserType },
  }),
});

export default AuthType;
