import "express-async-errors";
import express from "express";
import cors from "cors";
import session from "cookie-session";
import { routes } from "../api"
import { appConfig } from "../config";

export function createExpressApp() {
  const app = express();
  app.set('trust proxy', 1);
  
  app.use([
    cors({
      origin: "*"
    }),
    express.json(),
    express.urlencoded({ extended: false }),
    session({
      name: 'session',
      secret: appConfig.cookieSecret,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    }),
    routes(),
  ]);

  return app;
} 