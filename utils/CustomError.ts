import { StatusCodes } from "http-status-codes";

class CustomError extends Error {
  private statusCode: number;

  constructor(
    message: string = "Something Went Wrong",
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
