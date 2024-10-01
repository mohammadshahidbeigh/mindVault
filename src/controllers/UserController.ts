import {fetchUserById, User} from "../models/UserModel";

export const getUserProfile = async (userId: string): Promise<User> => {
  try {
    const user = await fetchUserById(userId);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
