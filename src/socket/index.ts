import { Socket } from "socket.io";
import { User } from "../types";
<<<<<<< Updated upstream
=======
import jwt, { decode } from "jsonwebtoken"
>>>>>>> Stashed changes

import jwt from "jsonwebtoken";

<<<<<<< Updated upstream
import { JWTTokenAuth } from "../lib/auth/jwt";

let onlineUserList: User[] = [];

export const newConnectionHandler = (socket: Socket) => {
  console.log(`New user joined their id is ${socket.id}`);
  socket.emit("welcome", { message: `${socket.id}` });

  socket.on("setUser", (data: { token: string }) => {
    const { token } = data;
    console.log("Received token:", token);
    const secret = process.env.JWT_SECRET as string;

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log("Token verification failed:", err);
      } else {
        console.log("Token verification successful:", decoded);
      }
    });
  });

=======

let onlineUserList:any = [];


export const newConnectionHandler = (socket: Socket) => {
  
  console.log(`New userJoined their id is ${socket.id}`);
  socket.emit("Welcome", socket.id);
console.log(onlineUserList)

  socket.on("setUser", (data: { token: string }) => {
    const { token } = data;
    // console.log('Received token:', token);
    const secret = process.env.JWT_SECRET as string;
   
    jwt.verify(token, secret, (err, decoded:any) => {
      if (err) {
        console.log('Token verification failed:', err);
      } else {
      
        onlineUserList.push({email:decoded.email, _id:decoded._id, socketId:socket.id})
        // console.log('Token verification successful:', decoded);
        console.log(onlineUserList)
      }
    });
  });
  
>>>>>>> Stashed changes
  socket.on("outgoing-msg", ({ recipients, message }) => {
    if (Array.isArray(recipients)) {
      recipients.forEach((recipient: Socket) => {
        let newRecipients = recipients.filter(
          (r: Socket) => r.id !== recipient.id
        );
        newRecipients.push(socket.id);
        console.log(message, recipients);
        socket.to(recipient.id).emit("incoming-msg", {
          recipients: newRecipients,
          sender: socket.id,
          message: message,
        });
        console.log(message);
      });
    }
<<<<<<< Updated upstream
  });
=======
})
>>>>>>> Stashed changes

  socket.on("disconnect", () => {
    onlineUserList=onlineUserList.filter((a:any)=>a.socketId!==socket.id)
    //  onlineUserList=onlineUserList.filter((a)=>a.email!==)
    socket.broadcast.emit("updateOnlineUsersList", onlineUserList);

    console.log(onlineUserList);
  });
};
