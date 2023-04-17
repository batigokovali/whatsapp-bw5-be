import { Model, Document } from "mongoose";

interface User {
  name: string;
  email: string;
  avatar?: string;
  refreshToken: string;
}

export interface UserDoc extends User, Document {}

export interface UsersModel extends Model<UserDoc> {
  checkCredentials(email: string, password: string): Promise<UserDoc | null>;
}
