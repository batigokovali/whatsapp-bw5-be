import express from "express";
import { Server, Socket } from "socket.io";
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
import socketioJwt, { authorize } from "socketio-jwt"; 
import jwt from "jsonwebtoken";
import { JWTTokenAuth } from "./lib/auth/jwt";
import messageModel from "./api/messages/model";
import messageRouter from "./api/messages";

const expressServer = express();

const httpServer = createServer(expressServer);
const socketioServer = new Server(httpServer);

socketioServer.on("connect", newConnectionHandler);

// const socket = socketioServer({
//   auth: {
//     token: "abc"
//   }
// })


const getUsernameFromToken=(token: any)=>{
return token
}

socketioServer.use((socket, next) => {
 if(socket.handshake.auth.token){
// socket.name=getUsernameFromToken(socket.handshake.auth.token)
 }else{
  next(new Error("Please send token"))
 }
  
})

socketioServer.on("connection", socket => {
  console.log(socket);
  require("./controllers/socket-io/socket-io-controller")(socket, socketioServer);
})



expressServer.use(cors());
expressServer.use(express.json());



const userIo=socketioServer.of("/user")

userIo.on("connect",socket=>{
  console.log(socket.id,"connected to namespace")
})





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
