import auth from "@/middlewares/admin-auth";
import Product from "@/models/product.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { searchTerm, page } = req.body;
  const query = {};

  const withPagination = page || searchTerm;

  if (searchTerm && searchTerm !== "") {
    var blocks = searchTerm.split(" ");
    var terms = await blocks.map((b) => {
      return { designation: { $regex: ".*" + b + ".*", $options: "i" } };
    });
    query.$or = terms;
  }

  await connectDB();
  try {
    const products = await (withPagination
      ? Product.find(query)
          .populate({
            path: "subCategory",
          })
          .sort({ createdAt: -1 })
          .limit(process.env.DATA_PAGE_LIMIT)
          .skip((page - 1) * process.env.DATA_PAGE_LIMIT)
      : Product.find({}).populate({
          path: "subCategory",
        }));

    const total = await Product.countDocuments(query);
    const count = Math.ceil(total / process.env.DATA_PAGE_LIMIT);

    res
      .status(200)
      .json(withPagination ? { products: products, count: count } : products);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
