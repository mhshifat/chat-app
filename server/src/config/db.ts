import { ServerError } from "../utils/errors";

const {
  MYSQL_DATABASE = "chat-app",
  MYSQL_USER = "user",
  MYSQL_PASSWORD = "password",
  MYSQL_ROOT_PASSWORD = "password",
  DB_HOST = "localhost",
} = process.env;
if (!MYSQL_DATABASE) throw new ServerError(500, "MYSQL_DATABASE env not defined");
if (!MYSQL_USER) throw new ServerError(500, "MYSQL_USER env not defined");
if (!MYSQL_PASSWORD) throw new ServerError(500, "MYSQL_PASSWORD env not defined");
if (!MYSQL_ROOT_PASSWORD) throw new ServerError(500, "MYSQL_ROOT_PASSWORD env not defined");
if (!DB_HOST) throw new ServerError(500, "DB_HOST env not defined");

export const dbConfig = {
  DB_NAME: MYSQL_DATABASE!,
  DB_USER: MYSQL_USER!,
  DB_PASS: MYSQL_PASSWORD!,
  DB_ROOT_PASS: MYSQL_ROOT_PASSWORD!,
  DB_HOST: DB_HOST!
}