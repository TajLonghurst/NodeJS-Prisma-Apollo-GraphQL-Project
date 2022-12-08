export const typeDefs = /* GraphQL */ `
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
`;
