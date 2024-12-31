import auth from "@/middlewares/admin-auth";
import Category from "@/models/category.model";
import SubCategory from "@/models/subCategory.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const category = Category;

const handler = nc();

handler.post(auth, async (req, res) => {
  const { searchTerm, page } = req.body;
  const query = {};

  const withPagination = page || searchTerm;

  if (searchTerm && searchTerm !== "") {
    var blocks = searchTerm.split(" ");
    var terms = await blocks.map((b) => {
      return { name: { $regex: ".*" + b + ".*", $options: "i" } };
    });
    query.$or = terms;
  }

  await connectDB();
  try {
    const subCategories = await (withPagination
      ? SubCategory.find(query)
          .populate({
            path: "category",
          })
          .sort({ createdAt: -1 })
          .limit(process.env.DATA_PAGE_LIMIT)
          .skip((page - 1) * process.env.DATA_PAGE_LIMIT)
      : SubCategory.find({}).populate({
          path: "category",
        }));

    const total = await SubCategory.countDocuments(query);
    const count = Math.ceil(total / process.env.DATA_PAGE_LIMIT);

    res
      .status(200)
      .json(
        withPagination
          ? { subCategories: subCategories, count: count }
          : subCategories
      );
  } catch (err) {
    console.log(err);

    res.status(400).json(err);
  }
});

export default handler;
