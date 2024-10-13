import bcrypt from "bcryptjs";
import mongoose, {Document, Schema} from "mongoose";

// IUser interface extending Document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  items: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the user schema
const userSchema = new Schema(
  {
    // No need for 'userId', Mongoose automatically creates '_id' field
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    items: [{type: Schema.Types.ObjectId, ref: "Item"}], // Array of item references
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt'
  }
);

// Method for comparing passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Define and export the User model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
