import jwt from "jsonwebtoken";
import { GraphQLFieldResolver } from "graphql";
import { StatusCodes } from "http-status-codes";

import CustomError from "../utils/CustomError";
import { ROLES } from "../types/auth.types";

const BUYER_ROUTES = ["switchRole"];
const SELLER_ROUTES = ["switchRole"];

const authenticate = (token: string): any => {
  try {
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY!);
    return decoded;
  } catch (error) {
    throw new CustomError("Invalid token", StatusCodes.UNAUTHORIZED);
  }
};

export const protectedResolver =
  (resolver: GraphQLFieldResolver<any, any>): GraphQLFieldResolver<any, any> =>
  (parent, args, context, info) => {
    const user = authenticate(context.headers.authorization);
    context.user = user;

    if (user.role !== ROLES.BUYER && user.role !== ROLES.SELLER) {
      throw new CustomError("Invalid Role", StatusCodes.FORBIDDEN);
    }

    const { fieldName } = info;

    if (
      (user.role === ROLES.BUYER && !BUYER_ROUTES.includes(fieldName)) ||
      (user.role === ROLES.SELLER && !SELLER_ROUTES.includes(fieldName))
    ) {
      throw new CustomError(
        "You are not allowed to access.",
        StatusCodes.FORBIDDEN
      );
    }

    return resolver(parent, args, context, info);
  };
