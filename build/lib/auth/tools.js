"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.createRefreshToken = exports.verifyAccessToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
