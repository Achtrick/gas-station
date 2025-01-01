import { StockActions } from "@/components/types/StockActions";
import auth from "@/middlewares/admin-auth";
import Product from "@/models/product.model";
import Sale from "@/models/sale.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { _id, qty, type } = req.body;
  await connectDB();
  try {
    const product = await Product.findById(_id).populate({
      path: "subCategory",
      populate: { path: "category" },
    });

    product.qty =
      type === StockActions.PLUS
        ? product.qty + Number(qty)
        : product.qty - Number(qty);

    if (type === StockActions.MINUS) {
      await Sale.create({
        category: product.subCategory.category.name,
        subCategory: product.subCategory.name,
        product: product.designation,
        qty: qty,
      });
    }

    await product.save();

    res.status(200).json({ message: "transaction success" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
