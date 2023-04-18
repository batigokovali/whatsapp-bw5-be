import { Socket } from "socket.io";
import { IncomingMessage } from "http";

import { User } from "../types";
import socketioJwt from 'socketio-jwt';
import jwt from "jsonwebtoken"
import { JWTTokenAuth } from "../lib/auth/jwt";


let onlineUserList: User[] = [];




export const newConnectionHandler = (socket: Socket) => {
  
  console.log(`New userJoined their id is ${socket.id}`);
  socket.emit("Welcome", socket.id);

  console.log(onlineUserList);



  socket.on("outgoing-msg", ({ recipients, message }) => {
    if (Array.isArray(recipients)) { // Check if recipients is an array
      recipients.forEach((recipient: Socket) => {
        let newRecipients = recipients.filter((r: Socket) => r.id !== recipient.id);
        newRecipients.push(socket.id);
        socket.emit(message);
        console.log(message,recipients);
        socket.broadcast.to(recipient.id).emit("incoming-msg", {
          recipients: newRecipients,
          sender: socket.id,
          message: message
           // Update to the actual property name for message text
        });
      });
   
    }
  });


  socket.on("disconnect", () => {
    // onlineUserList=onlineUserList.filter(a=>a.socketId!==socket.id)
    //  onlineUserList=onlineUserList.filter((a)=>a.email!==)
    socket.broadcast.emit("updateOnlineUsersList", onlineUserList);
    console.log("bye");
  });
};