import createHttpError from "http-errors"
import { RequestHandler, Request } from "express"
import { verifyAccessToken, TokenPayload } from "./tools"


export interface UserRequest extends Request{
    user?:TokenPayload
}

export const JWTAuthMiddlewWare:RequestHandler=async(req,res,nextx)=>{
    const accessToken=req.headers.authorization?.replace("Bearers ","")
}