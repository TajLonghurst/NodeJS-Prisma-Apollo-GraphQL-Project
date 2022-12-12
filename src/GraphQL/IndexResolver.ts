import postResolvers from "./Post/postResolver";
import userResolver from "./User/userResolver";

const resolvers = {
  Query: {
    ...userResolver.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolvers.Mutation,
  },
};

export default resolvers;
