import mongoose, {Schema, Document} from "mongoose";

export interface IItem extends Document {
  title: string;
  description: string;
  type: string;
  tags: string[];
}

const ItemSchema: Schema = new Schema({
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
});

const Item = mongoose.model<IItem>("Item", ItemSchema);

export default Item;
