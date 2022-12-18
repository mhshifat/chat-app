import "../config";
import "reflect-metadata";
import { AppError, ServerError } from "../utils/errors";
import { createExpressApp } from "./express";
import { AppDataSource } from "./database";
import { appConfig } from "../config";
import http from "http";
import net from "net";
import { ConnectionNotFoundError } from "typeorm";

export const Loaders = (() => {
  let server: http.Server;

  return {
    async loadDatabase() {
      try {
        await AppDataSource.initialize();
        console.log('Connection has been established successfully.');
      } catch (err) {
        if (err instanceof ConnectionNotFoundError) {
          throw new ServerError(500, err.message);
        }
      }
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
        await this.loadDatabase();
        await this.loadExpressServer();
      } catch (err) {
        console.log(err);
        
        if (err instanceof AppError) {
          console.log("Got Error", err.message);
          server?.close();
          process.exit(1);
        }
      }
    }
  }
})()