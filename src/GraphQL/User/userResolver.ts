import { PrismaClient } from "@prisma/client";
import { QueryResolvers, Resolvers } from "../../Types/types";

const prisma = new PrismaClient();

const userResolvers = {
  Query: {
    user: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { id } = args;
        const user = await prisma.user.findUnique({
          where: { id: id },
        });
        if (!user) {
          return console.log("user Could not find user");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      } catch (err) {
        console.log("user Failed", err);
      }
    },
    login: async (parent: any, args: any, context: any, info: any) => {},
  },
  Mutation: {
    deleteUser: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { id } = args;
        const user = await prisma.user.delete({
          where: { id: id },
        });
        if (!user) {
          return console.log("failed to delete user");
        }
        return {
          message: "Succfully deleted user",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
        };
      } catch (err) {}
    },
    createUser: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { name, email, password } = args.userInput;
        const user = await prisma.user.create({
          data: {
            name: name,
            email: email,
            password: password,
          },
        });
        if (!user) {
          return console.log("Could not create users");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      } catch (err) {
        console.log("CreateUser Failed", err);
      }
    },
  },
};

export default userResolvers;
