// src/graphql/schema.ts
import {gql} from "apollo-server-express";
import {IResolvers} from "@graphql-tools/utils";

// Define GraphQL schema (typeDefs)
export const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Define resolvers
export const resolvers: IResolvers = {
  Query: {
    hello: () => "Hello, MindVault!",
  },
};
