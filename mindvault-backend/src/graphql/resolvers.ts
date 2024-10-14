import {IUser} from "../models/User";
import User from "../models/User";
import {IResolvers} from "@graphql-tools/utils";
import {ICategory} from "../models/Category";
import Category from "../models/Category";
import {IItem} from "../models/Item";
import Item from "../models/Item";
import {generateToken} from "../utils/auth";
import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} from "apollo-server-express";
import bcrypt from "bcryptjs";
import Joi from "joi"; // Import Joi for validation

interface Context {
  user?: IUser;
}

interface AddItemArgs {
  title: string;
  description: string;
  type: string;
  tags: string[];
  user: string;
}

interface UpdateItemArgs {
  itemId: string;
  userId: string;
  title?: string;
  description?: string;
  type?: string;
  tags?: string[];
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

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const addItemSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  user: Joi.string().required(),
});

const updateItemSchema = Joi.object({
  itemId: Joi.string().required(),
  userId: Joi.string().required(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  type: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

const addCategorySchema = Joi.object({
  title: Joi.string().required(),
  count: Joi.number().integer().min(0).required(),
});

const updateCategorySchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  count: Joi.number().integer().min(0).required(),
});

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
        return await Item.find(query).populate("user");
      } catch (err) {
        console.error("Error fetching items", err);
        throw new Error("Failed to fetch items");
      }
    },
    item: async (_: unknown, {id}): Promise<IItem | null> => {
      try {
        return await Item.findById(id).populate("user");
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
    itemsByUser: async (
      _: unknown,
      {userId}: {userId: string}
    ): Promise<IItem[]> => {
      try {
        return await Item.find({user: userId}).populate("user");
      } catch (err) {
        console.error("Error fetching items by user", err);
        throw new Error("Failed to fetch items by user");
      }
    },
  },
  Mutation: {
    register: async (
      _: unknown,
      args: RegisterArgs
    ): Promise<{token: string; user: IUser}> => {
      const {error} = registerSchema.validate(args);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

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
      const {error} = loginSchema.validate({email, password});
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

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

    updateUser: async (
      _: unknown,
      args: {name?: string; email?: string},
      context: Context
    ): Promise<IUser> => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to update your profile"
        );
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          context.user.id,
          args,
          {new: true}
        );
        if (!updatedUser) {
          throw new Error("User not found");
        }
        return updatedUser;
      } catch (err) {
        console.error("Error updating user", err);
        throw new Error("Failed to update user");
      }
    },

    deleteUser: async (
      _: unknown,
      __: unknown,
      context: Context
    ): Promise<{message: string}> => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to delete your account"
        );
      }

      try {
        const result = await User.findByIdAndDelete(context.user.id);
        if (!result) {
          throw new Error("User not found");
        }
        return {message: "User deleted successfully"};
      } catch (err) {
        console.error("Error deleting user", err);
        throw new Error("Failed to delete user");
      }
    },

    addItem: async (
      _: unknown,
      args: AddItemArgs,
      context: Context
    ): Promise<IItem> => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in to add an item");
      }

      const {error} = addItemSchema.validate(args);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

      try {
        console.log("Adding item with details:", args);

        const newItem = new Item({
          ...args,
          user: context.user.id, // Use context user ID
        });

        const savedItem = await newItem.save();
        console.log("Saved item:", savedItem);

        return savedItem.populate("user");
      } catch (err) {
        console.error("Error adding item", err);
        throw new Error("Failed to add item");
      }
    },

    updateItem: async (
      _: unknown,
      args: UpdateItemArgs,
      context: Context
    ): Promise<IItem | null> => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to update an item"
        );
      }

      const {error} = updateItemSchema.validate(args);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

      const {itemId, userId, title, description, type, tags} = args;

      try {
        const item = await Item.findById(itemId);
        if (!item) {
          throw new Error("Item not found");
        }
        if (item.user?.toString() !== userId) {
          throw new ForbiddenError(
            "You don't have permission to update this item"
          );
        }

        const updatedFields: Partial<IItem> = {};
        if (title !== undefined) updatedFields.title = title;
        if (description !== undefined) updatedFields.description = description;
        if (type !== undefined) updatedFields.type = type;
        if (tags !== undefined) updatedFields.tags = tags;

        const updatedItem = await Item.findByIdAndUpdate(
          itemId,
          updatedFields,
          {new: true}
        ).populate("user");
        return updatedItem;
      } catch (err) {
        console.error("Error updating item", err);
        throw new Error("Failed to update item");
      }
    },

    deleteItem: async (
      _: unknown,
      {itemId, userId}: {itemId: string; userId: string},
      context: Context
    ): Promise<IItem> => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to delete an item"
        );
      }

      try {
        const item = await Item.findById(itemId);
        if (!item) {
          throw new Error("Item not found");
        }
        if (item.user?.toString() !== userId) {
          throw new ForbiddenError(
            "You don't have permission to delete this item"
          );
        }

        const deletedItem = await Item.findByIdAndDelete(itemId);
        if (!deletedItem) {
          throw new Error("Failed to delete item");
        }
        return deletedItem;
      } catch (err) {
        console.error("Error deleting item", err);
        throw new Error("Failed to delete item");
      }
    },

    addCategory: async (
      _: unknown,
      args: AddCategoryArgs,
      context: Context
    ): Promise<ICategory> => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to add a category"
        );
      }

      const {error} = addCategorySchema.validate(args);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

      try {
        const newCategory = new Category(args);
        const savedCategory = await newCategory.save();
        return savedCategory;
      } catch (err) {
        console.error("Error adding category", err);
        throw new Error("Failed to add category");
      }
    },

    updateCategory: async (
      _: unknown,
      args: UpdateCategoryArgs,
      context: Context
    ): Promise<ICategory | null> => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to update a category"
        );
      }

      const {error} = updateCategorySchema.validate(args);
      if (error) {
        throw new UserInputError(error.details[0].message);
      }

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

    deleteCategory: async (
      _: unknown,
      {id}: {id: string},
      context: Context
    ): Promise<{message: string}> => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to delete a category"
        );
      }

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
