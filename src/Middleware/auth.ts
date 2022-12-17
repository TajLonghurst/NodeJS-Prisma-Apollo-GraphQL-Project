import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { GraphQLError } from "graphql";

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
    throw new GraphQLError("Incorrect Header was given", {
      extensions: {
        http: {
          status: 401,
        },
      },
    });
  }

  const token = header.replace("Bearer ", "");

  const decodeToken = <jwt.ExtendedJwtPayload>jwt.verify(token, `${process.env.JWT_SECRET}`);

  console.log("Decode Token", decodeToken);

  if (!decodeToken) {
    throw new GraphQLError("Failed to decode Token", {
      extensions: {
        code: "FAILED_TOKEN_DECODE",
        http: {
          status: 404,
        },
      },
    });
  }
  return decodeToken.userId;
};

export default isAuth;
