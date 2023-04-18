import mongoose from "mongoose";


import { messageDoc,messageModel,Message } from "./types";
import { Model } from "mongoose";
const { Schema, model } = mongoose;

const messageSchema= new Schema<Message>({
    sender:{type:mongoose.Types.ObjectId,required:true,ref:"user"},
    content:{
        text:{type:String},
        media:{type:String}

    },
    timestamp:{type:Number}
})

const messageModel: Model<messageDoc> = model<messageDoc>("message", messageSchema);
export default messageModel;