import {IResolvers} from "@graphql-tools/utils";
import User, {IUser} from "../models/User";
import Category, {ICategory} from "../models/Category";
import Item, {IItem} from "../models/Item";

interface AddCategoryArgs {
  title: string;
  count?: number;
}

interface UpdateCategoryArgs {
  id: string;
  title?: string;
  count?: number;
}

interface AddItemArgs {
  title: string;
  description: string;
  type: string;
  tags: string[];
}

interface UpdateItemArgs {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  tags?: string[];
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
    categories: async (): Promise<ICategory[]> => {
      try {
        const categories = await Category.find();
        return categories;
      } catch (err) {
        console.error("Error fetching categories", err);
        throw new Error("Failed to fetch categories");
      }
    },
    category: async (_: unknown, {id}): Promise<ICategory | null> => {
      try {
        const category = await Category.findById(id);
        return category;
      } catch (err) {
        console.error("Error fetching category", err);
        throw new Error("Failed to fetch category");
      }
    },
    items: async (): Promise<IItem[]> => {
      try {
        const items = await Item.find();
        return items;
      } catch (err) {
        console.error("Error fetching items", err);
        throw new Error("Failed to fetch items");
      }
    },
    item: async (_: unknown, {id}): Promise<IItem | null> => {
      try {
        const item = await Item.findById(id);
        return item;
      } catch (err) {
        console.error("Error fetching item", err);
        throw new Error("Failed to fetch item");
      }
    },
  },
  Mutation: {
    addUser: async (
      _: unknown,
      {name, email}: {name: string; email: string}
    ): Promise<IUser> => {
      try {
        const newUser = new User({name, email});
        return await newUser.save();
      } catch (err) {
        console.error("Error adding user", err);
        throw new Error("Failed to add user");
      }
    },
    updateUser: async (
      _: unknown,
      {id, name, email}
    ): Promise<IUser | null> => {
      try {
        return await User.findByIdAndUpdate(id, {name, email}, {new: true});
      } catch (err) {
        console.error("Error updating user", err);
        throw new Error("Failed to update user");
      }
    },
    deleteUser: async (_: unknown, {id}): Promise<{message: string}> => {
      try {
        const result = await User.findByIdAndDelete(id);
        if (!result) throw new Error("User not found");
        return {message: "User deleted successfully"};
      } catch (err) {
        console.error("Error deleting user", err);
        throw new Error("Failed to delete user");
      }
    },
    addCategory: async (
      _: unknown,
      {title, count}: AddCategoryArgs
    ): Promise<ICategory> => {
      try {
        const newCategory = new Category({title, count: count || 0});
        return await newCategory.save();
      } catch (err) {
        console.error("Error adding category", err);
        throw new Error("Failed to add category");
      }
    },
    updateCategory: async (
      _: unknown,
      {id, title, count}: UpdateCategoryArgs
    ): Promise<ICategory | null> => {
      try {
        return await Category.findByIdAndUpdate(
          id,
          {title, count},
          {new: true}
        );
      } catch (err) {
        console.error("Error updating category", err);
        throw new Error("Failed to update category");
      }
    },
    deleteCategory: async (_: unknown, {id}): Promise<{message: string}> => {
      try {
        const result = await Category.findByIdAndDelete(id);
        if (!result) throw new Error("Category not found");
        return {message: "Category deleted successfully"};
      } catch (err) {
        console.error("Error deleting category", err);
        throw new Error("Failed to delete category");
      }
    },
    addItem: async (
      _: unknown,
      {title, description, type, tags}: AddItemArgs
    ): Promise<IItem> => {
      try {
        const newItem = new Item({title, description, type, tags});
        return await newItem.save();
      } catch (err) {
        console.error("Error adding item", err);
        throw new Error("Failed to add item");
      }
    },
    updateItem: async (
      _: unknown,
      {id, title, description, type, tags}: UpdateItemArgs
    ): Promise<IItem | null> => {
      try {
        return await Item.findByIdAndUpdate(
          id,
          {title, description, type, tags},
          {new: true}
        );
      } catch (err) {
        console.error("Error updating item", err);
        throw new Error("Failed to update item");
      }
    },
    deleteItem: async (_: unknown, {id}): Promise<{message: string}> => {
      try {
        const result = await Item.findByIdAndDelete(id);
        if (!result) throw new Error("Item not found");
        return {message: "Item deleted successfully"};
      } catch (err) {
        console.error("Error deleting item", err);
        throw new Error("Failed to delete item");
      }
    },
  },
};
