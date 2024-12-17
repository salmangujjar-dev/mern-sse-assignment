import { GraphQLObjectType, GraphQLString } from "graphql";

import UserType from "../users/user.graphql";

const ListingType = new GraphQLObjectType({
  name: "ListingPayload",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    user: { type: UserType },
  }),
});

export default ListingType;
