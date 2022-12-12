import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import Resolver from "./GraphQL/IndexResolver";

const typeDefs = loadSchemaSync("./src/**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});

interface MyContext {
  token?: String;
}

const server = new ApolloServer<MyContext>({
  typeDefs: typeDefs,
  resolvers: Resolver,
  introspection: true,
});

const Server = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
    context: async ({ req }) => ({ token: req.headers.token }),
  });
  console.log(`🚀 Server ready ${url}`);
};
Server();
