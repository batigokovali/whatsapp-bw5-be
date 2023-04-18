import { Socket } from "socket.io";
import { JWTTokenAuth,UserRequest } from "../lib/auth/jwt";
import { User } from "../types";
import socketioJwt from 'socketio-jwt';
import { ObjectId } from "mongoose";
import jwt from "jsonwebtoken"

let onlineUserList: User[] = [];

export const newConnectionHandler = (socket: Socket) => {
  console.log(`New userJoined their id is ${socket.id}`);
  socket.emit("Welcome", socket.id);

  console.log(onlineUserList);



  
  // const token = socket.handshake.auth.token;
  // const secretKey=process.env.JWT_SECRET as string
  // console.log(socket.handshake.auth)

  const handleAuthenticatedConnection = (socket: Socket, decodedToken: any) => {
    console.log(`Authenticated user connected with socket ID: ${socket.id}`);
    console.log("Decoded token:", decodedToken);
  
    // Your logic for handling the authenticated socket connection goes here
    // ...
  };
  
  // Wrap JWTTokenAuth middleware in a custom function to use with Socket.IO
  const socketJWTAuth = (socket: Socket, callback: (decodedToken: any) => void) => {
    // Extract the token from the socket handshake
    const token = socket.handshake.auth.token;
  
    // Call JWTTokenAuth middleware with a mock Request object
    const req: UserRequest = { headers: { authorization: `Bearer ${token}` } } as any;
    JWTTokenAuth(req, {} as any, (error: any) => {
      if (error) {
        console.error("Socket authentication failed:", error);
        callback(null); // Call the callback with null if authentication fails
      } else {
        // Call the callback with the decoded token if authentication is successful
        callback(req.user);
      }
    });
  };
  
  // Attach the middleware to the socket connection event
  socket.on("connect", (socket: Socket) => {
    // Use the socketJWTAuth middleware to authenticate the socket connection
    socketJWTAuth(socket, (decodedToken: any) => {
      if (decodedToken) {
        // Call the callback function to handle the authenticated socket connection
        handleAuthenticatedConnection(socket, decodedToken);
      } else {
        // Handle authentication error
        console.error("Socket authentication failed");
        // Optionally, you can emit an error event to the client and disconnect the socket
        socket.emit("authError", "Authentication failed");
        socket.disconnect(true);
      }
    });
  })



  // console.log( socket.use(socketioJwt.authorize({
  //   secret: process.env.JWT_SECRET as string,
  //   handshake: true
  // })))

    // const decoded = jwt.verify(token, secretKey);
    // console.log(decoded);
    // Decoded contains the decoded JWT payload



  

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