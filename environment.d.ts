declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      SECRET_KEY: string;
      MONGODB_URL: string;
    }
  }
}

export {};
