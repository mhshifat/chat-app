import { ServerError } from "../utils/errors";

const { PORT = 8000, JWT_SECRET = "my-super-secret", COOKIE_SECRET = "my-super-secret", CLIENT_ORIGIN = "http://localhost:3000" } = process.env;
if (!PORT) throw new ServerError(500, "PORT env not defined");
if (!JWT_SECRET) throw new ServerError(500, "JWT_SECRET env not defined");
if (!COOKIE_SECRET) throw new ServerError(500, "COOKIE_SECRET env not defined");
if (!CLIENT_ORIGIN) throw new ServerError(500, "CLIENT_ORIGIN env not defined");

export const appConfig = {
  port: PORT!,
  jwtSecret: JWT_SECRET!,
  cookieSecret: COOKIE_SECRET!,
  CLIENT_ORIGIN: CLIENT_ORIGIN!,
}