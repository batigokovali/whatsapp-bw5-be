import { Socket } from "socket.io";
import { IncomingMessage } from "http";

import { User } from "../types";
import socketioJwt from 'socketio-jwt';
import jwt from "jsonwebtoken"
import { JWTTokenAuth } from "../lib/auth/jwt";


let onlineUserList: User[] = [];


 export const authMiddleware = socketioJwt.authorize({
  secret: process.env.JWT_SECRET as string, 
  handshake: true,
  decodedPropertyName: "accessToken", 
})

export const newConnectionHandler = (socket: Socket) => {
  
  console.log(`New userJoined their id is ${socket.id}`);
  socket.emit("Welcome", socket.id);


  const verifyJwt = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => { 
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  };



  socket.on("outgoing-msg", ({ recipients, message }) => {
    if (Array.isArray(recipients)) {
        recipients.forEach((recipient: Socket) => {
            let newRecipients = recipients.filter((r: Socket) => r.id !== recipient.id);
            newRecipients.push(socket.id);
            console.log(message, recipients);
            socket.to(recipient.id).emit("incoming-msg", { 
                recipients: newRecipients,
                sender: socket.id,
                message: message
            });
            console.log(message);
        });
    }
})

 


  socket.on("disconnect", () => {
    // onlineUserList=onlineUserList.filter(a=>a.socketId!==socket.id)
    //  onlineUserList=onlineUserList.filter((a)=>a.email!==)
    socket.broadcast.emit("updateOnlineUsersList", onlineUserList);
    console.log("bye");
  });
};