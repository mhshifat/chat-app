import express from "express";
import cors from "cors";

export function createExpressApp() {
  const app = express();

  app.use([
    cors(),
    express.json(),
    express.urlencoded({ extended: false }),
  ]);

  return app;
} 