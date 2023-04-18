import { Model, Document } from "mongoose";
import {User,Message} from "../../types"

 interface Chat {
    members: User[];
    messages: Message[];
  }

  export interface chatDoc extends Chat,Document{}

  export interface chatModel extends Model<chatDoc>{
    
  }