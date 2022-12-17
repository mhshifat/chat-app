import "../config";
import { AppError, ServerError } from "../utils/errors";
import { createExpressApp } from "./express";
import { connectDatabase } from "./database";
import { appConfig } from "../config";
import { Sequelize, Error } from "sequelize";
import http from "http";
import net from "net";

export const Loaders = (() => {
  let server: http.Server;
  let sequelize: Sequelize;

  return {
    async loadDatabase() {
      try {
        sequelize = await connectDatabase();
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (err) {
        if (err instanceof Error) {
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
          sequelize?.connectionManager.close()
          server?.close();
          process.exit(1);
        }
      }
    }
  }
})()