import Express from "express";
import createHttpError from "http-errors";
import chatModel  from "./model"
import UsersModel from "../users/model"
import { JWTTokenAuth } from "../../lib/auth/jwt";
import { UserRequest } from "../../lib/auth/jwt";
import { Server, Socket } from "socket.io";
import { isObjectIdOrHexString, isValidObjectId, ObjectId } from "mongoose";
import messageModel from "../messages/model";

const chatRouter=Express.Router()

const io = new Server();



chatRouter.get("/", JWTTokenAuth, async (req: UserRequest, res, next) => {
    try {
      const currentUser = req.user?._id; 
      const chats = await chatModel.find({ members: currentUser }).populate(
        "members",
        "name email avatar"
      );
      if (chats) {
        res.status(200).send(chats);
      }else{
        res.send("Invalid user")
      }
    } catch (error) {
      next(error);
    }
  });
  

  // chatRouter.post("/",JWTTokenAuth, async (req: UserRequest, res, next) => {
  //   try {
  //       const chats = await chatModel.find();
  //       const members = chats.map(chat => chat.members);
  //       const currentUser = req.user; 
  //       // const myChats=members.filter(a=>a!==currentUser)
  //       const recipient=req.body.recipient
  //       const chat=members.filter(a=>a!==recipient)
  //      if(chat){
  //       res.send("In Contact")
  //      }else{
       
  //      }
   
  //   } catch (error) {
  //     next(error);
  //   }
  // })


chatRouter.post("/", JWTTokenAuth, async (req: UserRequest, res, next) => {
    try {
      const sender=req.user?._id
      const recipient=req.body.recipient
      const exists= await chatModel.findOne({
        members:[sender,recipient]
      })
      if(exists){
        res.status(200).send(exists)
      }else{
       const newChat=await chatModel.create({
        members: [sender, recipient],
        messages: []
       })
       res.status(201).send(newChat);
     
      }
    } catch (error) {
      next(error)
    }
  });

  chatRouter.get("/:id", JWTTokenAuth, async (req, res, next) => {
    try {
      const chatId = req.params.id;
  
      const chat = await chatModel.findOne({ _id: chatId }).populate(
        "members",
        "name email avatar"
      );
      if (!chat) {
        return next(createHttpError(404, "Chat not found"));
      }
  
      res.status(200).send(chat);
    } catch (error) {
      next(error);
    }
  })


  chatRouter.post("/:id", JWTTokenAuth, async (req: UserRequest, res, next)=>{
    try {
      const sender=req.user?._id
      const chatId = req.params.id;
      const chat = await chatModel.findById(chatId)
      
      if(!chat){
        return next(createHttpError(404, "Chat not found"));
      }else{
       const newMessage=await messageModel.create({
        sender:sender,
        content:{
         text:req.body.message
        }

       })
       
       res.send(chat)
       console.log(newMessage)
      }
    } catch (error) {
      next(error)
    }
  })


export default chatRouter