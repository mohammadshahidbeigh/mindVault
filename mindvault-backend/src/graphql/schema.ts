// src/graphql/schema.ts
import {gql} from "apollo-server-express";
import {IUser} from "../models/User";
import User from "../models/User";
import {IResolvers} from "@graphql-tools/utils";
import {ICategory} from "../models/Category";
import Category from "../models/Category";
import {IItem} from "../models/Item";
import Item from "../models/Item";
import {generateToken} from "../utils/auth";
import {AuthenticationError, UserInputError} from "apollo-server-express";
import bcrypt from "bcryptjs";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
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
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): DeleteResponse!

    addItem(
      title: String!
      description: String!
      type: String!
      tags: [String!]!
    ): Item!
    updateItem(
      id: ID!
      title: String!
      description: String!
      type: String!
      tags: [String!]!
    ): Item!
    deleteItem(id: ID!): DeleteResponse!

    addCategory(title: String!, count: Int): Category!
    updateCategory(id: ID!, title: String!, count: Int): Category!
    deleteCategory(id: ID!): DeleteResponse!
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

interface AddItemArgs {
  title: string;
  description: string;
  type: string;
  tags: string[];
}

interface UpdateItemArgs {
  id: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
}

interface AddCategoryArgs {
  title: string;
  count: number;
}

interface UpdateCategoryArgs {
  id: string;
  title: string;
  count: number;
}

interface RegisterArgs {
  name: string;
  email: string;
  password: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

export const resolvers: IResolvers = {
  Query: {
    hello: (): string => "Hello world!",
    users: async (): Promise<IUser[]> => {
      try {
        return await User.find();
      } catch (err) {
        console.error("Error fetching users", err);
        throw new Error("Failed to fetch users");
      }
    },
    user: async (_: unknown, {id}): Promise<IUser | null> => {
      try {
        return await User.findById(id);
      } catch (err) {
        console.error("Error fetching user", err);
        throw new Error("Failed to fetch user");
      }
    },
    categories: async (): Promise<ICategory[]> => {
      try {
        return await Category.find();
      } catch (err) {
        console.error("Error fetching categories", err);
        throw new Error("Failed to fetch categories");
      }
    },
    items: async (
      _: unknown,
      {searchTerm}: {searchTerm?: string}
    ): Promise<IItem[]> => {
      try {
        const query = searchTerm
          ? {title: {$regex: String(searchTerm), $options: "i"}}
          : {};
        return await Item.find(query);
      } catch (err) {
        console.error("Error fetching items", err);
        throw new Error("Failed to fetch items");
      }
    },
    item: async (_: unknown, {id}): Promise<IItem | null> => {
      try {
        return await Item.findById(id);
      } catch (err) {
        console.error("Error fetching item", err);
        throw new Error("Failed to fetch item");
      }
    },
    category: async (_: unknown, {id}): Promise<ICategory | null> => {
      try {
        return await Category.findById(id);
      } catch (err) {
        console.error("Error fetching category", err);
        throw new Error("Failed to fetch category");
      }
    },
  },
  Mutation: {
    register: async (
      _: unknown,
      args: RegisterArgs
    ): Promise<{token: string; user: IUser}> => {
      const {name, email, password} = args;

      try {
        // Check if the user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
          throw new UserInputError("User already exists");
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password: hashedPassword});
        const savedUser = await newUser.save();

        // Generate authentication token
        const token = generateToken(savedUser.id);
        return {token, user: savedUser};
      } catch (err) {
        console.error("Error registering user", err);
        throw new Error("Failed to register user");
      }
    },

    login: async (
      _: unknown,
      {email, password}: LoginArgs
    ): Promise<{token: string; user: IUser}> => {
      try {
        console.log("Attempting to log in user with email:", email);

        const user = await User.findOne({email});
        if (!user) {
          console.error("User not found with email:", email);
          throw new UserInputError("Invalid email or password");
        }

        console.log("User found:", user);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.error("Password is invalid for email:", email);
          throw new UserInputError("Invalid email or password");
        }

        console.log("Password is valid for user:", user.email);

        const token = generateToken(user.id);
        return {token, user};
      } catch (err) {
        console.error("Error logging in user:", err);
        if (err instanceof UserInputError) {
          throw err;
        }
        throw new AuthenticationError("Failed to login");
      }
    },

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
    addItem: async (_: unknown, args: AddItemArgs): Promise<IItem> => {
      const {title, description, type, tags} = args;

      try {
        const newItem = new Item({title, description, type, tags});
        const savedItem = await newItem.save();
        return savedItem;
      } catch (err) {
        console.error("Error adding item", err);
        throw new Error("Failed to add item");
      }
    },
    updateItem: async (
      _: unknown,
      args: UpdateItemArgs
    ): Promise<IItem | null> => {
      const {id, title, description, type, tags} = args;

      try {
        const item = await Item.findByIdAndUpdate(
          id,
          {title, description, type, tags},
          {new: true}
        );
        return item;
      } catch (err) {
        console.error("Error updating item", err);
        throw new Error("Failed to update item");
      }
    },
    deleteItem: async (_: unknown, {id}): Promise<{message: string}> => {
      try {
        const result = await Item.findByIdAndDelete(id);
        if (!result) {
          throw new Error("Item not found");
        }
        return {message: "Item deleted successfully"};
      } catch (err) {
        console.error("Error deleting item", err);
        throw new Error("Failed to delete item");
      }
    },
    addCategory: async (
      _: unknown,
      args: AddCategoryArgs
    ): Promise<ICategory> => {
      const {title, count} = args;

      try {
        const newCategory = new Category({title, count});
        const savedCategory = await newCategory.save();
        return savedCategory;
      } catch (err) {
        console.error("Error adding category", err);
        throw new Error("Failed to add category");
      }
    },
    updateCategory: async (
      _: unknown,
      args: UpdateCategoryArgs
    ): Promise<ICategory | null> => {
      const {id, title, count} = args;

      try {
        const category = await Category.findByIdAndUpdate(
          id,
          {title, count},
          {new: true}
        );
        return category;
      } catch (err) {
        console.error("Error updating category", err);
        throw new Error("Failed to update category");
      }
    },
    deleteCategory: async (_: unknown, {id}): Promise<{message: string}> => {
      try {
        const result = await Category.findByIdAndDelete(id);
        if (!result) {
          throw new Error("Category not found");
        }
        return {message: "Category deleted successfully"};
      } catch (err) {
        console.error("Error deleting category", err);
        throw new Error("Failed to delete category");
      }
    },
  },
};
