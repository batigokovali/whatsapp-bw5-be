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
exports.verifyAndCreateNewTokens = exports.verifyRefreshToken = exports.createRefreshToken = exports.verifyAccessToken = exports.createAccessToken = exports.createTokens = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = __importDefault(require("../../api/users/model"));
const createTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield (0, exports.createAccessToken)({
        _id: user._id,
        email: user.email,
    });
    const refreshToken = yield (0, exports.createRefreshToken)({
        _id: user._id,
        email: user.email,
    });
    user.refreshToken = refreshToken;
    yield user.save();
    return { accessToken, refreshToken };
});
exports.createTokens = createTokens;
const createAccessToken = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "30m" }, (err, token) => {
    if (err)
        reject(err);
    else
        resolve(token);
}));
exports.createAccessToken = createAccessToken;
const verifyAccessToken = (token) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err)
        reject(err);
    else
        resolve(payload);
}));
exports.verifyAccessToken = verifyAccessToken;
const createRefreshToken = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "1 week" }, (err, token) => {
    if (err)
        reject(err);
    else
        resolve(token);
}));
exports.createRefreshToken = createRefreshToken;
const verifyRefreshToken = (token) => new Promise((resolve, reject) => {
    jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
        if (err)
            reject(err);
        else
            resolve(payload);
    });
});
exports.verifyRefreshToken = verifyRefreshToken;
const verifyAndCreateNewTokens = (currentRefreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = yield (0, exports.verifyRefreshToken)(currentRefreshToken);
        const user = (yield model_1.default.findById(_id));
        if (!user)
            throw new http_errors_1.default[404](`User with ${_id} not found!`);
        if (user.refreshToken && user.refreshToken === currentRefreshToken) {
            const { accessToken, refreshToken } = yield (0, exports.createTokens)(user);
            return { accessToken, refreshToken };
        }
    }
    catch (error) {
        throw new http_errors_1.default[401]("Session expired log in again!");
    }
});
exports.verifyAndCreateNewTokens = verifyAndCreateNewTokens;
