import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isAuth from "../../Middleware/auth";
import { UserInputData, ResolversParentTypes, AuthResolvers } from "../../Types/types";

const prisma = new PrismaClient();

const userResolvers = {
  Query: {
    users: async (parent: any, args: any, context: AuthResolvers, info: any) => {
      const users = await prisma.user.findMany({
        include: {
          posts: true,
        },
      });

      if (users.length < 0) {
        throw new GraphQLError("Failed to find users in database", {
          extensions: {
            code: "USERS_NOT_FOUND",
            http: {
              status: 404,
            },
          },
        });
      }

      return users;
    },

    user: async (parent: any, args: any, { req }: any, info: any) => {
      const decoded = isAuth(req);

      if (!decoded) {
        throw new GraphQLError("User is not Authenticated", {
          extensions: {
            code: "UNAUTHENTICATED)",
            http: {
              status: 401,
            },
          },
        });
      }

      const { id } = args;

      const user = await prisma.user.findUnique({
        where: { id: id },
        include: {
          posts: true,
        },
      });

      if (!user) {
        throw new GraphQLError("Failed to find user in database", {
          extensions: {
            code: "USER_NOT_FOUND",
            http: {
              status: 404,
            },
          },
        });
      }

      return {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    },
    login: async (parent: any, args: any, context: any, info: any) => {
      const { email, password } = args;

      const user = await prisma.user.findMany({
        where: { email: email },
      });

      if (user.length < 0) {
        throw new GraphQLError("Failed to find user Login in database", {
          extensions: {
            code: "USER_NOT_FOUND",
            http: {
              status: 404,
            },
          },
        });
      }

      const isEqual = await bcrypt.compare(password, user[0].password);

      if (!isEqual) {
        throw new GraphQLError("Incorrect password ", {
          extensions: {
            code: "BAD_USER_INPUT",
            http: {
              status: 403,
            },
          },
        });
      }

      const token = jwt.sign(
        {
          userId: user[0].id,
          email: user[0].email,
        },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: "1h",
        }
      );

      return {
        token: token,
        userId: user[0].id,
      };
    },
  },
  Mutation: {
    deleteUser: async (parent: any, args: any, context: any, info: any) => {
      const { id } = args;

      const decoded = isAuth(context.req);

      if (!decoded) {
        throw new GraphQLError("User is not Authenticated", {
          extensions: {
            code: "UNAUTHENTICATED)",
            http: {
              status: 401,
            },
          },
        });
      }

      const user = await prisma.user.delete({
        where: { id: id },
      });

      if (!user) {
        throw new GraphQLError("Failed to delete user in database", {
          extensions: {
            code: "USER_NOT_FOUND",
            http: {
              status: 404,
            },
          },
        });
      }
      return {
        message: "Succfully deleted user",
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      };
    },
    createUser: async (parent: any, args: any, context: any, info: any) => {
      const { name, email, password } = args.userInput;

      const isEmail = await prisma.user.findMany({
        where: { email: email },
      });

      if (isEmail.length > 0) {
        throw new GraphQLError("Email already exsits", {
          extensions: {
            code: "OPERATION_RESOLUTION_FAILURE",
            http: {
              status: 409,
            },
          },
        });
      }

      const hashPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashPassword,
        },
      });

      if (!user) {
        throw new GraphQLError("Failed to create user in database", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: {
              status: 404,
            },
          },
        });
      }

      return {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    },
  },
};

export default userResolvers;
