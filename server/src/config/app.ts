import { ServerError } from "../utils/errors";

const { PORT = 8000, JWT_SECRET = "my-super-secret", COOKIE_SECRET = "my-super-secret" } = process.env;
if (!PORT) throw new ServerError(500, "PORT env not defined");
if (!JWT_SECRET) throw new ServerError(500, "JWT_SECRET env not defined");
if (!COOKIE_SECRET) throw new ServerError(500, "COOKIE_SECRET env not defined");

export const appConfig = {
  port: PORT!,
  jwtSecret: JWT_SECRET!,
  cookieSecret: COOKIE_SECRET!,
}