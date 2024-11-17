import { IUser } from "../src/users/user.schema";

export type TUpdateUser = Pick<
  IUser,
  "id" | "email" | "username" | "password" | "isAdmin"
> & { adminCtx: boolean };
