import CustomError from "./CustomError";
import { StatusCodes } from "http-status-codes";

class Logger {
  private className: string;

  constructor(className: string) {
    this.className = className;
  }

  log(message: string): void {
    console.log(`${this.className} - Log: ${message}`);
  }

  info(message: string): void {
    console.info(`${this.className} - Info: ${message}`);
  }

  warn(message: string): void {
    console.warn(`${this.className} - Warn: ${message}`);
  }

  error(error: any) {
    if (!(error instanceof CustomError)) {
      error = new CustomError(error?.message);
    }

    console.error(
      `${this.className} - Error: ${error.message}\nStack: ${error.stack}`
    );

    return error;
  }
}

export default Logger;
