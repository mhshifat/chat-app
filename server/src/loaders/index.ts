import { AppError } from "../utils/errors";
import { createExpressApp } from "./express";
import { appConfig } from "../config";
import http from "http";
import net from "net";

export const Loaders = (() => {
  let server: http.Server;

  return {
    async loadConfigs() {
      require("../config");
    },
    async loadExpressServer() {
      const app = createExpressApp();
      server = app.listen(appConfig.port, () => {
        const { address, port } = server.address() as net.AddressInfo;
        console.log(`Server is running on ${address}:${port}`);
      });
    },
    async load() {
      try {
        await this.loadConfigs();
        await this.loadExpressServer();
      } catch (err) {
        if (err instanceof AppError) {
          console.log("Got Error", err.message);
          process.exit(1);
        }
      }
    }
  }
})()