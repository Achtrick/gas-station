import auth from "@/middlewares/admin-auth";
import Product from "@/models/product.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.get(auth, async (req, res) => {
  await connectDB();

  try {
    const expiringProducts = await Product.find({ qty: { $lte: 10 } })
      .sort({ qty: 1 })
      .limit(20)
      .select("_id image designation code qty");

    res.status(200).json(expiringProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default handler;
