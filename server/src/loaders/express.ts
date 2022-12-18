import "express-async-errors";
import express from "express";
import cors from "cors";
import session from "cookie-session";
import { Server } from "socket.io";
import http from "http";
import { routes } from "../api"
import { appConfig } from "../config";
import { handleSocketEvents } from "../utils/events";

export function createExpressApp() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      credentials: true,
      origin: appConfig.CLIENT_ORIGIN
    }
  });
  app.set('trust proxy', 1);
  
  app.use([
    cors({
      origin: appConfig.CLIENT_ORIGIN,
      credentials: true
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

  io.on('connection', (socket) => {
    console.log(socket.id + ' user connected');

    handleSocketEvents(socket);

    socket.on('disconnect', () => {
      console.log(socket.id + ' user disconnected');
    });
  });

  return server;
} 