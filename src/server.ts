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
import chatRouter from "./api/chat";
import { instrument } from "@socket.io/admin-ui";
import { JWTTokenAuth } from "./lib/auth/jwt";
import { authorize } from "socketio-jwt";
const expressServer = express();

const httpServer = createServer(expressServer);
const socketioServer = new Server(httpServer);

socketioServer.on("connect", newConnectionHandler);


expressServer.use(cors());
expressServer.use(express.json());

const userIo=socketioServer.of("/user")
userIo.on("connect",socket=>{
  console.log(socket.id,"connected to namespace")
})


// userIo.use((socket,next)=>{
//  if(socket.handshake.auth.token){
  
//  }else{
//   next(new Error("Please send token"))
//  }
// })

expressServer.use("/users", UsersRouter);
expressServer.use("/users",chatRouter)

expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(notFoundHandler);
expressServer.use(genericErrorHandler);

instrument(socketioServer,{auth:false})
export { httpServer, expressServer };
