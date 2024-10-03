import mongoose, {Schema, Document} from "mongoose";

export interface ICategory extends Document {
  title: string;
  count: number;
}

const CategorySchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
