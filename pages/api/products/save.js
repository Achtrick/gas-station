import auth from "@/middlewares/admin-auth";
import Product from "@/models/product.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { _id } = req.body;
  await connectDB();
  try {
    if (_id) {
      const product = await Product.findByIdAndUpdate(_id, {
        ...req.body,
      });
      await product.save();
      res.status(200).json({ message: "product updated" });
    } else {
      delete req.body._id;
      const product = await Product.create(req.body);
      await product.save();
      res.status(200).json({ message: "product created" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
