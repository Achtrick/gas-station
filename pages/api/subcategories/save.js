import auth from "@/middlewares/admin-auth";
import SubCategory from "@/models/subCategory.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { _id } = req.body;
  await connectDB();
  try {
    if (_id) {
      const subCategory = await SubCategory.findByIdAndUpdate(_id, {
        ...req.body,
      });
      await subCategory.save();
      res.status(200).json({ message: "sub-category updated" });
    } else {
      delete req.body._id;
      const subCategory = await SubCategory.create(req.body);
      await subCategory.save();
      res.status(200).json({ message: "sub-category created" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
