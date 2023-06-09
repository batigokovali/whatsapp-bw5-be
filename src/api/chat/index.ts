import Express from "express";
import createHttpError from "http-errors";
import chatModel from "./model";
import UsersModel from "../users/model";
import { JWTTokenAuth } from "../../lib/auth/jwt";
import { UserRequest } from "../../lib/auth/jwt";
import { Server, Socket } from "socket.io";
import { isObjectIdOrHexString, isValidObjectId, ObjectId } from "mongoose";
import messageModel from "../messages/model";
import { imageUploader } from "../../lib/cloudinary";

const chatRouter = Express.Router();

const io = new Server();

chatRouter.get("/", JWTTokenAuth, async (req, res, next) => {
  try {
    const currentUser = (req as UserRequest).user!._id;

    const chats = await chatModel
      .find({ members: currentUser })
      .populate("members", "name email avatar");
    if (chats) {
      res.status(200).send(chats);
    } else {
      res.send("Invalid user");
    }
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/", JWTTokenAuth, async (req, res, next) => {
  try {
    const sender = (req as UserRequest).user!._id;

    const recipient = req.body.recipient;
    const exists = await chatModel.findOne({
      members: { $in: [sender, recipient] },
    });
    if (exists) {
      console.log((req as UserRequest).user!._id);
      res.status(200).send(exists);
    } else {
      const newChat = await chatModel.create({
        members: [sender, recipient],
        messages: [],
      });
      res.status(201).send(newChat);
    }
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/:id", JWTTokenAuth, async (req, res, next) => {
  try {
    const chatId = req.params.id;

    const chat = await chatModel
      .findOne({ _id: chatId })
      .populate("members messages.sender", "name email avatar");
    if (!chat) {
      return next(createHttpError(404, "Chat not found"));
    }

    res.status(200).send(chat);
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/:id", imageUploader, JWTTokenAuth, async (req, res, next) => {
  try {
    const sender = (req as UserRequest).user!._id;
    const chatId = req.params.id;
    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return next(createHttpError(404, "Chat not found"));
    } else {
      const newMessage = await messageModel.create({
        sender: sender,
        content: {
          text: req.body.message,
          media: req.file?.path,
        },
      });
      chat.messages.push(newMessage);
      chat.save();
      res.send(chat);
      console.log(newMessage);
    }
  } catch (error) {
    next(error);
  }
});

export default chatRouter;
