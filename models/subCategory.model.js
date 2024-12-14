import { Schema, model, models } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);
const SubCategory =
  models.SubCategory || model("SubCategory", subCategorySchema);

export default SubCategory;
