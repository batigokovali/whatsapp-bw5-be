import Express from "express";
import createHttpError from "http-errors";
import { Socket } from "socket.io";
import { httpServer } from "../../server";
import messageModel from "./model";


const messageRouter=Express.Router()

messageRouter.post("/:id/sendMessage",async(req,res,next)=>{
 try {
   const socketServer= httpServer
   socketServer.emit("outgoing-msg",(req.params.id,req.body.message))
   res.send(req.body.message)
 } catch (error) {
    next(error)
 }
})


export default messageRouter