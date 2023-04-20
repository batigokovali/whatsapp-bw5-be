import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors, { CorsOptions } from "cors";
import { newConnectionHandler } from "./socket/index";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers";
import UsersRouter from "./api/users";
import chatRouter from "./api/chat";
import passport from "passport";
import googleStrategy from "./lib/auth/googleOauth";
import createHttpError from "http-errors";

const expressServer = express();

const httpServer = createServer(expressServer);
const socketioServer = new Server(httpServer);

socketioServer.on("connect", newConnectionHandler);


passport.use("google", googleStrategy);

const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
const corsOptions: CorsOptions = {
  origin: (currentOrigin, corsNext) => {
    if (!currentOrigin || whiteList.includes(currentOrigin)) {
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(400, `This origin is not allowed! ${currentOrigin}`)
      );
    }
  },
};

expressServer.use(cors(corsOptions));
expressServer.use(express.json());


expressServer.use("/users", UsersRouter);
expressServer.use("/chats", chatRouter)

expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(notFoundHandler);
expressServer.use(genericErrorHandler);


export { httpServer, expressServer };
