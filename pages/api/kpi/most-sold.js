import auth from "@/middlewares/admin-auth";
import Sale from "@/models/sale.model";
import connectDB from "@/utils/config/connectDB";
import nc from "next-connect";

const handler = nc();

handler.post(auth, async (req, res) => {
  const { type } = req.body;
  await connectDB();

  try {
    const salesData = await Sale.aggregate([
      {
        $group: {
          _id: `$${type}`,
          totalQty: { $sum: "$qty" },
        },
      },
      {
        $sort: { totalQty: -1 },
      },
      { $limit: 10 },
    ]);

    const formattedData = salesData.map((item, index) => ({
      id: index,
      value: item.totalQty,
      label: item._id || "Unknown",
    }));

    res.status(200).json({ data: formattedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sales data", details: err });
  }
});

export default handler;
