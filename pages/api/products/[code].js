import auth from "@/middlewares/admin-auth";
import Product from "@/models/product.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.get(auth, async (req, res) => {
  const { code } = req.query;
  await connectDB();
  try {
    const product = await Product.findOne({ code: code });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
