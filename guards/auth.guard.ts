import jwt from "jsonwebtoken";
import { GraphQLFieldResolver } from "graphql";
import { StatusCodes } from "http-status-codes";

import CustomError from "../utils/CustomError";

import { ROLES } from "../types/auth.types";

const ROUTES = {
  [ROLES.BUYER]: ["bookListing", "rateBooking"],
  [ROLES.SELLER]: [
    "createListing",
    "updateListing",
    "deleteListing",
    "markAsComplete",
  ],
  COMMON_ROUTES: ["switchRole", "updateUser", "deleteUser", "user"],
  ADMIN: ["users", "getTopRatedSellers", "getTopRatedListings", "getTopBuyers"],
};

const authenticate = (token: string): any => {
  try {
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY!);

    // if (typeof decoded !== "string" && decoded.userId) {
    //   const user = await User.findById(decoded.userId);
    //   if (!user) {
    //     throw new CustomError(
    //       "Inavlid Token. User Not Found!",
    //       StatusCodes.NOT_FOUND
    //     );
    //   }
    // } else {
    //   throw new CustomError("Invalid token payload", StatusCodes.UNAUTHORIZED);
    // }

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

    if (![ROLES.BUYER, ROLES.SELLER].includes(user.role)) {
      throw new CustomError("Invalid Role", StatusCodes.FORBIDDEN);
    }

    const { fieldName } = info;
    const allowedRoutes = [
      ...ROUTES[user.role as ROLES],
      ...ROUTES.COMMON_ROUTES,
      ...(user.isAdmin ? ROUTES.ADMIN : []),
    ];

    if (!allowedRoutes.includes(fieldName)) {
      throw new CustomError(
        "You are not allowed to access.",
        StatusCodes.FORBIDDEN
      );
    }

    return resolver(parent, args, context, info);
  };
