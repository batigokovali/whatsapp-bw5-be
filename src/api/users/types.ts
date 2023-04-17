import { Model, Document, ObjectId } from "mongoose";

interface User {
  name: string;
  email: string;
  avatar?: string;
  chats?:Array<ObjectId>
}

export interface UserDoc extends User, Document {}

export interface UsersModel extends Model<UserDoc> {
  checkCredentials(email: string, password: string): Promise<UserDoc | null>;
}
