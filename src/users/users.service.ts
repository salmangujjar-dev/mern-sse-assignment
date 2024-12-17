// Todo: Implement the User Service Logic to be used in the Resolver - Following MVR Model (Model View Resolver)

import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";

import User from "../users/user.schema";

import CustomError from "../../utils/CustomError";
import Logger from "../../utils/Logger";

import { TUpdateUser } from "../../types/user.types";

class UserService {
  private readonly logger = new Logger(UserService.name);

  async getUser(userId: string) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new CustomError("User not found", StatusCodes.NOT_FOUND);
      }

      return user;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async getAllUsers() {
    try {
      const users = await User.find();

      if (!users || users.length === 0) {
        throw new CustomError("No users found", StatusCodes.NOT_FOUND);
      }

      return users;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async updateUser({
    id,
    email,
    username,
    password,
    adminCtx,
    isAdmin,
  }: TUpdateUser) {
    try {
      const user = await User.findById(id);

      if (!user) {
        throw new CustomError("User not found", StatusCodes.NOT_FOUND);
      }

      if (password && password.length < 8) {
        throw new CustomError(
          "Password must be at least 8 characters long",
          StatusCodes.BAD_REQUEST
        );
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      user.email = email;
      user.username = username;
      user.isAdmin = adminCtx ? isAdmin : user.isAdmin;

      await user.save();

      return user;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }

  async deleteUser(userId: string) {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        throw new CustomError("User not found", StatusCodes.NOT_FOUND);
      }

      return { message: "User deleted successfully" };
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }
}

export default UserService;
