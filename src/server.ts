import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
// import { addResolversToSchema } from "@graphql-tools/schema";
import Resolver from "./GraphQL/resolvers";
import { typeDefs } from "./GraphQL/typeDefs";

// const schema = await loadSchema("graphql/**/*.graphql", {
//   // load files and merge them into a single schema object
//   loaders: [new GraphQLFileLoader()],
// });

// const schemaWithResolvers = addResolversToSchema({
//   schema,
//   resolvers: {
//     Query: {
//       //  ...
//     },
//   },
// });

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
