// src/db.ts
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mohammadshahidbeigh:Ecoli2ADmtk9xXQg@mindvault.g2otu.mongodb.net/mindvault"
    );
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

export default connectDB;
