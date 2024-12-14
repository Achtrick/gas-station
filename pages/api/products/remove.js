import auth from "@/middlewares/admin-auth";
import Product from "@/models/product.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { _id } = req.body;
  await connectDB();
  try {
    await Product.findByIdAndDelete(_id);
    res.status(200).json({ message: "product removed" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
