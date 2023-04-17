"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { Schema, model } = mongoose_1.default;
const UsersSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
});
UsersSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = this;
        if (newUser.isModified("password")) {
            const password = newUser.password;
            const hashedPW = yield bcrypt_1.default.hash(password, 11);
            newUser.password = hashedPW;
        }
    });
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
exports.default = model("user", UsersSchema);
