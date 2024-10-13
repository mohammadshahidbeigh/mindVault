// src/graphql/schema.ts
import {gql} from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    items: [Item!]!
  }

  type Category {
    id: ID!
    title: String!
    count: Int!
  }

  type Item {
    id: ID!
    title: String!
    description: String!
    type: String!
    tags: [String!]!
    user: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    hello: String
    users: [User!]!
    user(id: ID!): User
    categories: [Category!]!
    items(type: String, searchTerm: String): [Item!]!
    item(id: ID!): Item
    category(id: ID!): Category
    itemsByUser(userId: ID!): [Item!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(name: String, email: String): User!
    deleteUser: DeleteResponse!

    addItem(
      title: String!
      description: String!
      type: String!
      tags: [String!]!
      user: ID!
    ): Item!
    updateItem(
      itemId: ID!
      userId: ID!
      title: String
      description: String
      type: String
      tags: [String!]
    ): Item!
    deleteItem(itemId: ID!, userId: ID!): Item!

    addCategory(title: String!, count: Int): Category!
    updateCategory(id: ID!, title: String!, count: Int): Category!
    deleteCategory(id: ID!): DeleteResponse!
  }

  type DeleteResponse {
    message: String!
  }
`;
