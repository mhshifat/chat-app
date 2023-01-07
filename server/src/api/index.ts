import { Router } from "express";
import { API_ROUTES } from "./modules";
import { errorHandler, extractAuthUser } from "./middlewares";
import { RequestResponse } from "../utils/response";

export function routes() {
  const router = Router();

  router.use(extractAuthUser);
  router.get("/", (_, res) => res.send("Hello from server"));
  Object.keys(API_ROUTES).forEach((key) => {
    router.use(`/api/${key}`, API_ROUTES[key as keyof typeof API_ROUTES]);
  });
  router.use("*", (_, res) => RequestResponse.setResponse(res).setStatusCode(404).setReason("Route not found!").failure());
  router.use(errorHandler);

  return router;
}