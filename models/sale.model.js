import { Schema, model, models } from "mongoose";

const saleSchema = new Schema(
  {
    category: { type: String, default: "" },
    subCategory: { type: String, default: "" },
    product: { type: String, default: "" },
    qty: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Sale = models.Sale || model("Sale", saleSchema);

export default Sale;
export { saleSchema };
