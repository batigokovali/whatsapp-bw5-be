import Express from "express";
import createHttpError from "http-errors";
import chatModel  from "./model"
import UsersModel from "../users/model"
import { JWTTokenAuth } from "../../lib/auth/jwt";
import { UserRequest } from "../../lib/auth/jwt";
const chatRouter=Express.Router()





chatRouter.get("/", JWTTokenAuth, async (req: UserRequest, res, next) => {
    try {
      const chats = await chatModel.find();
      const members = chats.map(chat => chat.members);
      const currentUser = req.user; 
    //   const myChats = members.filter(member => !member.equals(currentUser))
    // const myChats = members.filter(member => member.toString() !== currentUser._id.toString());
    const myChats = members.filter(member => member.toString() !== (currentUser?.toString() ?? ''));
      if (currentUser) {
        res.status(200).send();
      }
    } catch (error) {
      next(error);
    }
  });
  

  chatRouter.post("/",JWTTokenAuth, async (req: UserRequest, res, next) => {
    try {
        const chats = await chatModel.find();
        const members = chats.map(chat => chat.members);
        const currentUser = req.user; 
        // const myChats=members.filter(a=>a!==user)
        const recipient=req.body.recipient
        const chat=members.filter(a=>a!==recipient)
       if(chat){
       }
      res.status(200).send(chats)
    } catch (error) {
      next(error);
    }
  })

  chatRouter.get("/:id", async (req, res, next) => {
    try {
      const chats= await chatModel.find()
      if(chats)
      res.status(200).send(chats)
    } catch (error) {
      next(error);
    }
  })


export default chatRouter