import createHttpError, { HttpError } from "http-errors";
import jwt from "jsonwebtoken";

export interface TokenPayload {
  _id: string;
  email: string;
}

export const createAccessToken = (payload: TokenPayload): Promise<string> =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "30m" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token as string);
      }
    )
  );

export const verifyAccessToken = (token: string): Promise<TokenPayload> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
      if (err) reject(err);
      else resolve(payload as TokenPayload);
    })
  );

export const createRefreshToken = (payload: TokenPayload): Promise<string> =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token as string);
      }
    )
  );

export const verifyRefreshToken = (token: string): Promise<TokenPayload> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET!, (err, payload) => {
      if (err) reject(err);
      else resolve(payload as TokenPayload);
    });
  });
