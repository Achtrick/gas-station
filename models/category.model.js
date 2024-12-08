import { Schema, model, models } from "mongoose";

const categorySchema = new Schema(
  {
    name: String,
  },
  { timestamps: true }
);
const Category = models.Category || model("Category", categorySchema);

export default Category;
