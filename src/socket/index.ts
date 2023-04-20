import { Socket } from "socket.io";
import { User } from "../types";
import jwt, { decode } from "jsonwebtoken";
import chatModel from "../api/chat/model";
import mongoose from "mongoose";
import { Message } from "../types";
// import jwt from "jsonwebtoken";

let onlineUserList: any = [];
let newRoom: string;
let displayedMessages: any = [];

export const newConnectionHandler = (socket: Socket) => {
  console.log(`New userJoined their id is ${socket.id}`);
  socket.emit("Welcome", socket.id);

  socket.on("setUser", (data: { token: string }) => {
    const { token } = data;
    const secret = process.env.JWT_SECRET as string;

    jwt.verify(token, secret, (err, decoded: any) => {
      if (err) {
        console.log("Token verification failed:", err);
      } else {
        onlineUserList.push({
          email: decoded.email,
          _id: decoded._id,
          socketId: socket.id,
        });
        // console.log('Token verification successful:', decoded);
        console.log(onlineUserList);
      }
    });
  });
  socket.on("join-room", (room) => {
    console.log(room);
    newRoom = room;
    console.log(newRoom);
    socket.join(room);
  });

  socket.on(
    "outgoing-msg",
    async ({ room, message }: { room: string; message: any }) => {
      console.log(room);
      const chatRoomId = new mongoose.Types.ObjectId(room);
      socket.to(String(chatRoomId)).emit(message, {
        room: room,
        message: {
          sender: String,
          content: {
            text: String,
          },
        },
      });
      console.log(message);
      await chatModel.findByIdAndUpdate(
        String(chatRoomId),
        { $push: { messages: message } },
        { new: true, runValidators: true }
      );
      socket.emit("incoming-msg", String(chatRoomId));
      const chat = await chatModel.findById(String(chatRoomId));
      console.log(chat);
    }
  );

  socket.on("incoming-msg", async ({ room }: { room: string }) => {
    const chatRoomId = new mongoose.Types.ObjectId(room);
    const chat = await chatModel.findById(String(chatRoomId));
    displayedMessages.push(chat?.messages);
    console.log(displayedMessages);
  });

  socket.on("disconnect", () => {
    onlineUserList = onlineUserList.filter(
      (a: any) => a.socketId !== socket.id
    );
    //  onlineUserList=onlineUserList.filter((a)=>a.email!==)
    socket.broadcast.emit("updateOnlineUsersList", onlineUserList);
    console.log(`User with socketId of ${socket.id} disconnected`);
    console.log(onlineUserList);
  });
};
