import { IUser } from "../src/users/user.schema";

export enum ROLES {
  "BUYER" = "BUYER",
  "SELLER" = "SELLER",
}

export type TSignUp = Pick<IUser, "email" | "username" | "password"> & {
  adminSecretKey?: string;
};

export type TLogin = Pick<IUser, "email" | "password">;

export type TSwitchRole = Pick<IUser, "email" | "username"> & {
  userId: string;
  role: ROLES;
};
