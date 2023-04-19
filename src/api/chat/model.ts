import mongoose from "mongoose";
import { chatDoc,chatModel } from "./types";

import { Model } from "mongoose";
import { Chat } from "../../types";
import { messageSchema } from "../messages/model";

const { Schema, model } = mongoose;

 const chatSchema= new Schema({
    members:[{type:mongoose.Types.ObjectId,required:false,ref:"user"}],
    messages:[messageSchema]
})



const chatModel: Model<chatDoc> = model<chatDoc>("chat", chatSchema);
export default chatModel;

