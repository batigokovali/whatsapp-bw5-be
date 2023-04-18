import Express from "express";
import createHttpError from "http-errors";
import chatModel  from "./model"
import UsersModel from "../users/model"

const chatRouter=Express.Router()





chatRouter.get("/:id/chats", async (req, res, next) => {
    try {
      const chats = await chatModel.find(); // Find all chat documents
      const members = chats.map(chat => chat.members); // Extract members from each chat document
      res.send(chats)
    } catch (error) {
      next(error);
    }
  })


chatRouter.put("/:id/chats/:userId",async(req,res,next)=>{
    try {
        const oneUser = await UsersModel.findByIdAndUpdate(
            req.params.id,
            {$push:{chats:req.params.userId}},
            {new:true,runValidators:true}
            )
        const secondUser=await UsersModel.findByIdAndUpdate(
            req.params.userId,
            {$push:{chats:req.params.id}},
            {new:true,runValidators:true}
            )
            res.send("contact added")
    } catch (error) {
        next(error)
    }
})

chatRouter.get("/:id/chats/:chatId",async(req,res,next)=>{
    try {
        res.send("hello")
    } catch (error) {
        next(error)
    }
})



export default chatRouter