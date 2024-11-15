import jwt from "jsonwebtoken";

class JWTService {
  private static instance: JWTService;
  private signingSecret: string;

  constructor() {
    this.signingSecret = process.env.SECRET_KEY || "secret";
  }

  public static getInstance(): JWTService {
    if (!JWTService.instance) {
      JWTService.instance = new JWTService();
    }
    return JWTService.instance;
  }

  public sign(payload: object, expiresIn: string | number = "1h"): string {
    return jwt.sign(payload, this.signingSecret, { expiresIn });
  }
}

export default JWTService;
