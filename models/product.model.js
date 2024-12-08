import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    designation: { type: String, default: "" },
    image: { type: String, default: "" },
    buyingPrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
  },
  { timestamps: true }
);
const Product = models.Product || model("Product", productSchema);

export default Product;
export { productSchema };
