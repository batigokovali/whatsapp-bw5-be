import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
// import {  authMiddleware } from "./socket/index";
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
import { instrument } from "@socket.io/admin-ui";
import socketioJwt, { authorize } from "socketio-jwt"; 
import jwt from "jsonwebtoken";
import { JWTTokenAuth } from "./lib/auth/jwt";
import messageModel from "./api/messages/model";
import messageRouter from "./api/messages";
import passport from "passport";
import googleStrategy from "./lib/auth/googleOauth";
import createHttpError from "http-errors";

const expressServer = express();

const httpServer = createServer(expressServer);
const socketioServer = new Server(httpServer);

socketioServer.on("connect", newConnectionHandler);

// socketioServer.use(authMiddleware)

// socketioServer.use((socket, next) => {
//  if(socket.handshake.auth.token){
// // socket.name=getUsernameFromToken(socket.handshake.auth.token)
//  }else{
//   next(new Error("Please send token"))
//  }
  
// })

// socketioServer.on("connection", socket => {
//   console.log(socket);
//   require("./controllers/socket-io/socket-io-controller")(socket, socketioServer);
// })


passport.use("google", googleStrategy);

socketioServer.on("connection", newConnectionHandler);

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



// const userIo=socketioServer.of("/user")

// userIo.on("connect",socket=>{
//   console.log(socket.id,"connected to namespace")
// })





expressServer.use("/users", UsersRouter);
expressServer.use("/chats",chatRouter)
expressServer.use("/users",messageRouter)

expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(notFoundHandler);
expressServer.use(genericErrorHandler);

instrument(socketioServer,{auth:false})
export { httpServer, expressServer };
