import {gql} from "apollo-server-express";
import {IUser} from "../models/User";
import User from "../models/User";
import {IResolvers} from "@graphql-tools/utils";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    hello: String
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    addUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): DeleteResponse!
  }

  type DeleteResponse {
    message: String!
  }
`;

interface AddUserArgs {
  name: string;
  email: string;
}

interface UpdateUserArgs {
  id: string;
  name?: string;
  email?: string;
}

export const resolvers: IResolvers = {
  Query: {
    hello: (): string => "Hello world!",
    users: async (): Promise<IUser[]> => {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        console.error("Error fetching users", err);
        throw new Error("Failed to fetch users");
      }
    },
    user: async (_: unknown, {id}): Promise<IUser | null> => {
      try {
        const user = await User.findById(id);
        return user;
      } catch (err) {
        console.error("Error fetching user", err);
        throw new Error("Failed to fetch user");
      }
    },
  },
  Mutation: {
    addUser: async (_: unknown, args: AddUserArgs): Promise<IUser> => {
      const {name, email} = args;

      try {
        const newUser = new User({name, email});
        const savedUser = await newUser.save();
        return savedUser;
      } catch (err) {
        console.error("Error adding user", err);
        throw new Error("Failed to add user");
      }
    },
    updateUser: async (
      _: unknown,
      args: UpdateUserArgs
    ): Promise<IUser | null> => {
      const {id, name, email} = args;

      try {
        const user = await User.findByIdAndUpdate(
          id,
          {name, email},
          {new: true}
        );
        return user;
      } catch (err) {
        console.error("Error updating user", err);
        throw new Error("Failed to update user");
      }
    },
    deleteUser: async (_: unknown, {id}): Promise<{message: string}> => {
      try {
        const result = await User.findByIdAndDelete(id);
        if (!result) {
          throw new Error("User not found");
        }
        return {message: "User deleted successfully"};
      } catch (err) {
        console.error("Error deleting user", err);
        throw new Error("Failed to delete user");
      }
    },
  },
};
