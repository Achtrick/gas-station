import auth from "@/middlewares/admin-auth";
import SubCategory from "@/models/subCategory.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.get(auth, async (req, res) => {
  await connectDB();
  try {
    const subCategories = await SubCategory.find({}).populate({
      path: "category",
    });
    res.status(200).json(subCategories);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
