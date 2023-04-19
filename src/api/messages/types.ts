import { Model, Document } from "mongoose";
import {User} from "../../types"

export interface Message {
    sender: User;
    content: {
      text?: string;
      media?: string;
    };
    timestamp: number;
  }
  

  export interface messageDoc extends Message,Document{}
  export interface messageModel extends Model<messageDoc>{

}