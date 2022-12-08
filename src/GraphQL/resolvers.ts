import { PrismaClient } from "@prisma/client";
import { GraphQLArgs } from "graphql";
const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const resolvers = {
  Query: {
    books: (args: GraphQLArgs) => books,
  },
};

export default resolvers;
