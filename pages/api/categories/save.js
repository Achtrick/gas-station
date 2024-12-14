import auth from "@/middlewares/admin-auth";
import Category from "@/models/category.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { _id } = req.body;
  await connectDB();
  try {
    if (_id) {
      const category = await Category.findByIdAndUpdate(_id, { ...req.body });
      await category.save();
      res.status(200).json({ message: "category updated" });
    } else {
      delete req.body._id;
      const category = await Category.create(req.body);
      await category.save();
      res.status(200).json({ message: "category created" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
