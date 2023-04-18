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
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const model_1 = __importDefault(require("./model"));
const tools_1 = require("../../lib/auth/tools");
const jwt_1 = require("../../lib/auth/jwt");
const cloudinary_1 = require("../../lib/cloudinary");
const UsersRouter = express_1.default.Router();
// Sign up
UsersRouter.post("/account", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new model_1.default(req.body);
        const { _id } = yield newUser.save();
        res.status(201).send({ _id });
    }
    catch (error) {
        next(error);
    }
}));
// Login
UsersRouter.post("/session", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield model_1.default.checkCredentials(email, password);
        if (user) {
            const payload = { _id: user._id, email: user.email };
            const accessToken = yield (0, tools_1.createAccessToken)(payload);
            res.send({ accessToken });
        }
        else {
            next((0, http_errors_1.default)(401, "Creditentials are not okay!"));
        }
    }
    catch (error) {
        next(error);
    }
}));
// Log out
UsersRouter.delete("/session", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_1.default.findByIdAndUpdate(req.user._id, {
            refreshToken: "",
        });
        res.send({ message: "Successfully logged out!" });
    }
    catch (error) {
        next(error);
    }
}));
// Get all the users
UsersRouter.get("/", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield model_1.default.find();
        res.send(users);
    }
    catch (error) {
        next(error);
    }
}));
// Get user's own info
UsersRouter.get("/me", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findById(req.user._id);
        res.send(user);
    }
    catch (error) {
        next(error);
    }
}));
// Edit user's own info
UsersRouter.put("/me", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield model_1.default.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true, runValidators: true });
        res.send(updatedUser);
    }
    catch (error) {
        next(error);
    }
}));
// Get users by ID
UsersRouter.get("/:userID", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findById(req.params.userID);
        if (user)
            res.send(user);
        else
            next((0, http_errors_1.default)(404, `User with id ${req.params.userID} not found!`));
    }
    catch (error) {
        next(error);
    }
}));
// Set an avatar image
UsersRouter.post("/me/avatar", cloudinary_1.avatarUploader, jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    yield model_1.default.findByIdAndUpdate(req.user._id, {
        avatar: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
    });
    res.send({ avatarURL: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path });
}));
exports.default = UsersRouter;
