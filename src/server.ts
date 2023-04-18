import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { newConnectionHandler } from "./socket/index";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers";
import UsersRouter from "./api/users";
import passport from "passport";
import googleStrategy from "./lib/auth/googleOauth";

const expressServer = express();

const httpServer = createServer(expressServer);
const socketioServer = new Server(httpServer);

passport.use("google", googleStrategy);

socketioServer.on("connection", newConnectionHandler);

expressServer.use(cors());
expressServer.use(express.json());

expressServer.use("/users", UsersRouter);

expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(notFoundHandler);
expressServer.use(genericErrorHandler);

export { httpServer, expressServer };
