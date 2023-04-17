import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserDoc, UsersModel } from "./types";

const { Schema, model } = mongoose;

const UsersSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true, default: " " },
});

UsersSchema.pre("save", async function () {
  const newUser = this;
  if (newUser.isModified("password")) {
    const password = newUser.password;
    const hashedPW = await bcrypt.hash(password, 11);
    newUser.password = hashedPW;
  }
});

UsersSchema.methods.toJSON = function () {
  const currentUserDoc = this;
  const currentUser = currentUserDoc.toObject();
  delete currentUser.password;
  delete currentUser.createdAt;
  delete currentUser.updatedAt;
  delete currentUser.__v;
  return currentUser;
};

UsersSchema.static("checkCredentials", async function (email, plainPW) {
  const user = await this.findOne({ email });
  if (user) {
    const passwordMatch = await bcrypt.compare(plainPW, user.password);
    if (passwordMatch) return user;
    else return null;
  } else return null;
});

export default model<UserDoc, UsersModel>("user", UsersSchema);
