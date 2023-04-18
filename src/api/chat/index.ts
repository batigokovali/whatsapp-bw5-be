import Express from "express";
import createHttpError from "http-errors";
import chatModel  from "./model"
import UsersModel from "../users/model"

const chatRouter=Express.Router()





chatRouter.get("/:id/chats", async (req, res, next) => {
    try {
      
    } catch (error) {
      next(error);
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