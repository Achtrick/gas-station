import auth from "@/middlewares/admin-auth";
import Category from "@/models/category.model";
import Product from "@/models/product.model";
import SubCategory from "@/models/subCategory.model";
import connectDB from "@/utils/config/connectDB";
import { Types } from "mongoose";
import nc from "next-connect";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { _id } = req.body;
  await connectDB();
  try {
    await Category.findByIdAndDelete(_id);

    const subCategories = await SubCategory.find({
      category: Types.ObjectId(_id),
    });

    subCategories.forEach(async (subcategory) => {
      await Product.deleteMany({
        subCategory: Types.ObjectId(subcategory._id),
      });
    });

    await SubCategory.deleteMany({
      category: Types.ObjectId(_id),
    });

    res.status(200).json({ message: "category removed" });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
