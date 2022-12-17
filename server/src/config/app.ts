import { ServerError } from "../utils/errors";

const { PORT = 8000 } = process.env;
if (!PORT) throw new ServerError(500, "PORT env not defined");

export const appConfig = {
  port: PORT!,
}