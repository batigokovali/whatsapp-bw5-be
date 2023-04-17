import { Model, Document } from "mongoose";
import {User,Message} from "../../types"

 interface Chat {
    members: User[];
    messages: Message[];
  }