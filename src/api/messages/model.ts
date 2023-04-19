import mongoose from "mongoose";


import { messageDoc,messageModel,Message } from "./types";
import { Model } from "mongoose";
const { Schema, model } = mongoose;

export const messageSchema = new Schema(
    {
      sender: { type: Schema.Types.ObjectId, ref: "user" },
      content: {
        text: { type: String, required: true },
        media: { type: String },
      },
    },
    {
      timestamps: true,
    }
    );

const messageModel: Model<messageDoc> = model<messageDoc>("message", messageSchema);
export default messageModel;