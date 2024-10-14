// src/db.ts
import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

const connectDB = async (retryCount = 0) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      console.warn(
        `Failed to connect to MongoDB. Retrying in ${
          RETRY_DELAY / 1000
        } seconds...`
      );
      setTimeout(() => connectDB(retryCount + 1), RETRY_DELAY);
    } else {
      const errorMessage =
        process.env.NODE_ENV === "production"
          ? "Failed to connect to the database. Please try again later."
          : `Error connecting to MongoDB: ${(err as Error).message}`;
      console.error(errorMessage);
      process.exit(1);
    }
  }
};

export default connectDB;
