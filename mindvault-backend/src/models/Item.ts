import mongoose, {Schema, Document} from "mongoose";

// IItem interface extending Document
export interface IItem extends Document {
  user: mongoose.Types.ObjectId; // Change from userId to user
  title: string;
  description: string;
  type: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the item schema
const ItemSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt'
  }
);

// Adding index to user field to optimize queries
ItemSchema.index({user: 1});

// Create and export the Item model
const Item = mongoose.model<IItem>("Item", ItemSchema);
export default Item;
