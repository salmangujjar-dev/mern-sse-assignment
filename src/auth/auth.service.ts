import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";

import JWTService from "./jwt.service";

import User from "../users/user.schema";

import CustomError from "../../utils/CustomError";
import { ROLES, TLogin, TSignUp, TSwitchRole } from "../../types/auth.types";
class AuthService {
  private jwtService: JWTService;

  constructor() {
    this.jwtService = JWTService.getInstance();
  }

  async signUp({ email, username, password, adminSecretKey }: TSignUp) {
    try {
      if (adminSecretKey && adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        throw new CustomError(
          "You are not authorized to create an Admin",
          StatusCodes.UNAUTHORIZED
        );
      }

      if (!!(await User.findOne({ email }))) {
        throw new CustomError("Email Already Exists!", StatusCodes.CONFLICT);
      }

      const hashedPwd = bcrypt.hashSync(password, 10);

      const user = new User({ email, username, password: hashedPwd });
      await user.save();

      const accessToken = this.jwtService.sign({
        userId: user._id,
        email: user.email,
        role: ROLES.BUYER,
      });

      return { accessToken, user };
    } catch (error: any) {
      return new CustomError(error?.message, error?.statusCode);
    }
  }

  async login({ email, password }: TLogin) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new CustomError("User not found", StatusCodes.NOT_FOUND);
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new CustomError("Invalid password", StatusCodes.UNAUTHORIZED);
      }

      const accessToken = this.jwtService.sign({
        userId: user._id,
        email: user.email,
        role: ROLES.BUYER,
      });

      return { accessToken, user };
    } catch (error: any) {
      return new CustomError(error?.message, error?.statusCode);
    }
  }

  async switchRole({ userId, email, role }: TSwitchRole) {
    try {
      const newRole = role === ROLES.BUYER ? ROLES.SELLER : ROLES.BUYER;
      const newAccessToken = this.jwtService.sign({
        userId,
        email,
        role: newRole,
      });

      return { accessToken: newAccessToken };
    } catch (error: any) {
      return new CustomError();
    }
  }
}

export default AuthService;
