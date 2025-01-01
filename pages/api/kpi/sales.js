import { TimeSpan } from "@/components/types/TimeSpan";
import auth from "@/middlewares/admin-auth";
import Sale from "@/models/sale.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const currentYear = new Date().getFullYear();
const startOfYear = new Date(currentYear, 0, 1);
const endOfYear = new Date(currentYear + 1, 0, 1);

const startOfWeek = (() => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  return new Date(now.setDate(diff));
})();

const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(endOfWeek.getDate() + 7);

const handler = nc();

handler.post(auth, async (req, res) => {
  const { type } = req.body;
  await connectDB();

  try {
    let filter = {};
    let groupBy;

    if (type === TimeSpan.DAILY) {
      filter.createdAt = {
        $gte: startOfWeek,
        $lt: endOfWeek,
      };
      groupBy = { $dayOfWeek: "$createdAt" };
    } else if (type === TimeSpan.MONTHLY) {
      filter.createdAt = {
        $gte: startOfYear,
        $lt: endOfYear,
      };
      groupBy = { $month: "$createdAt" };
    }

    const sales = await Sale.aggregate([
      { $match: filter },
      {
        $group: {
          _id: groupBy,
          totalQty: { $sum: "$qty" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const results =
      type === TimeSpan.DAILY ? Array(7).fill(0) : Array(12).fill(0);

    sales.forEach((entry) => {
      const index = type === TimeSpan.DAILY ? entry._id - 1 : entry._id - 1;
      results[index] = entry.totalQty;
    });

    res.status(200).json(results);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default handler;
