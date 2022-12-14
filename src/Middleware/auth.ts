import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface ExtendedRequest extends Request {
  userId?: string | JwtPayload;
}

declare module "jsonwebtoken" {
  interface ExtendedJwtPayload extends JwtPayload {
    userId: string;
    email: string;
  }
}

const isAuth = async (req: any) => {
  const header = req.headers.bearer;

  if (!header) {
    console.log("FAILED", header);
  }

  const token = header.replace("Bearer ", "");

  const decodeToken = <jwt.ExtendedJwtPayload>jwt.verify(token, `${process.env.JWT_SECRET}`);

  console.log("decode Token", decodeToken);

  if (!decodeToken) {
    console.log("failed decode");
  }
  return decodeToken;
};

export default isAuth;
