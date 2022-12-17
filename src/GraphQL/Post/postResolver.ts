import { GraphQLRequest } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import { GraphQLArgs } from "graphql";
import isAuth from "../../Middleware/auth";

const prisma = new PrismaClient();

const postResolvers = {
  Query: {
    posts: async (parent: any, args: any, context: any, info: any) => {
      const posts = await prisma.post.findMany();

      if (posts.length < 0) {
        throw new GraphQLError("Could not find posts", {
          extensions: {
            code: "NO_POSTS",
            http: {
              status: 404,
            },
          },
        });
      }

      return posts;
      // Change the UpdatedAt to IsoString()
    },
  },
  Mutation: {
    createPost: async (parent: any, args: any, context: any, info: any) => {
      const userId = await isAuth(context.req);

      const { title, content } = args.postInput;

      const user = await prisma.user.findUnique({ where: { id: userId } });

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

      const createPost = await prisma.post.create({
        data: {
          title: title,
          content: content,
          userId: user.id,
        },
      });

      if (!createPost) {
        throw new GraphQLError("Could not find posts", {
          extensions: {
            code: "NO_POSTS",
            http: {
              status: 404,
            },
          },
        });
      }

      return {
        ...createPost,
        createdAt: createPost.createdAt.toISOString(),
        updatedAt: createPost.updatedAt.toISOString(),
      };
    },
    updatePost: async (parent: any, args: any, context: any, info: any) => {
      await isAuth(context.req);

      const { title, content, postId } = args.postInput;

      const postUpdated = await prisma.post.update({
        where: { id: postId },
        data: {
          title: title,
          content: content,
        },
      });

      if (!postUpdated) {
        throw new GraphQLError("Failed to updated post", {
          extensions: {
            code: "FAILED_UPDATE",
            http: {
              status: 404,
            },
          },
        });
      }

      return {
        ...postUpdated,
        createdAt: postUpdated.createdAt.toISOString(),
        updatedAt: postUpdated.updatedAt.toISOString(),
      };
    },
    deletePost: async (parent: any, args: any, context: any, info: any) => {
      const { id } = args;

      const deltedPost = await prisma.post.delete({ where: { id: id } });

      if (!deltedPost) {
        throw new GraphQLError("Failed to deleted post", {
          extensions: {
            code: "FAILED_DELETE_POST",
            http: {
              status: 401,
            },
          },
        });
      }
      return {
        ...deltedPost,
        createdAt: deltedPost.createdAt.toISOString(),
        updatedAt: deltedPost.updatedAt.toISOString(),
      };
    },
  },
};

export default postResolvers;
