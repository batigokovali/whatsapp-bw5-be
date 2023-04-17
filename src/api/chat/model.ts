import mongoose from "mongoose";

const { Schema, model } = mongoose;

 const chatSchema= new Schema({
    members:[{type:mongoose.Types.ObjectId,required:false,ref:"user"}],
    messages:[{type:mongoose.Types.ObjectId,required:false,ref:"message"}]
})

export default model ("chat", chatSchema);
