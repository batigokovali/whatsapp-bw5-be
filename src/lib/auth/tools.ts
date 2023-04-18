import createHttpError, { HttpError } from "http-errors";
import jwt from "jsonwebtoken";
import UsersModel from "../../api/users/model";
import { UserDoc } from "../../api/users/types";
export interface TokenPayload {
  _id: string;
  email: string;
}

export const createTokens = async (user: UserDoc) => {
  const accessToken = await createAccessToken({
    _id: user._id,
    email: user.email,
  });
  const refreshToken = await createRefreshToken({
    _id: user._id,
    email: user.email,
  });
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

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

export const verifyAndCreateNewTokens = async (currentRefreshToken: string) => {
  try {
    const { _id } = await verifyRefreshToken(currentRefreshToken);
    const user = (await UsersModel.findById(_id)) as UserDoc;
    if (!user) throw new createHttpError[404](`User with ${_id} not found!`);
    if (user.refreshToken && user.refreshToken === currentRefreshToken) {
      const { accessToken, refreshToken } = await createTokens(user);
      return { accessToken, refreshToken };
    }
  } catch (error) {
    throw new createHttpError[401]("Session expired log in again!");
  }
};
